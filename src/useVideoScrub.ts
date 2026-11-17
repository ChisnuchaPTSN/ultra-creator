import { useEffect, useRef, useState, useCallback } from 'react';
import * as MP4Box from 'mp4box';

const LERP_TAU = 8;
const SNAP = 0.002;
const LRU_MAX = 24;
const LEAD = 24;
const WATCHDOG = 60000;

export interface FrameBankEntry {
  ts: number; // in microseconds
  blob: Blob;
}

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}

function getTrackDescription(file: any, track: any): Uint8Array | undefined {
  try {
    const trak = file.getTrackById(track.id);
    if (!trak) return undefined;
    for (const entry of trak.mdia.minf.stbl.stsd.entries) {
      const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
      if (box) {
        const stream = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN);
        box.write(stream);
        return new Uint8Array(stream.buffer, 8);
      }
    }
  } catch (err) {
    console.warn('Failed to extract codec description box:', err);
  }
  return undefined;
}

export function useVideoScrub(videoSrc: string, scrubRange: [number, number] = [0, 1]) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [canvasLive, setCanvasLive] = useState(false);
  const [duration, setDuration] = useState(0);

  const bankRef = useRef<FrameBankEntry[]>([]);
  const lruRef = useRef<Map<number, ImageBitmap | null>>(new Map());

  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const durRef = useRef(0);

  const readyRef = useRef(false);
  const revertedRef = useRef(false);
  const paintedRef = useRef(false);
  const buildingRef = useRef(false);
  const lastIndexDrawnRef = useRef(-1);

  // Compute scroll progress p = clamp(0, 1, (window.scrollY - containerTop) / (container.offsetHeight - window.innerHeight))
  const getProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    const scrollSpan = container.offsetHeight - window.innerHeight;
    if (scrollSpan <= 0) return 0;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const currentScroll = window.scrollY - containerTop;
    return clamp(0, 1, currentScroll / scrollSpan);
  }, []);

  // Update duration from video element metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        durRef.current = video.duration;
        setDuration(video.duration);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (video.duration && !isNaN(video.duration)) {
      handleLoadedMetadata();
    }
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Frame Bank binary search for closest timestamp
  const findNearestFrameIndex = useCallback((targetTs: number): number => {
    const bank = bankRef.current;
    if (bank.length === 0) return -1;
    let low = 0;
    let high = bank.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (bank[mid].ts < targetTs) {
        low = mid + 1;
      } else if (bank[mid].ts > targetTs) {
        high = mid - 1;
      } else {
        return mid;
      }
    }
    if (low >= bank.length) return bank.length - 1;
    if (high < 0) return 0;
    return Math.abs(bank[low].ts - targetTs) < Math.abs(bank[high].ts - targetTs) ? low : high;
  }, []);

  // LRU cache maintenance
  const warmLRU = useCallback((targetIndex: number) => {
    const bank = bankRef.current;
    const lru = lruRef.current;
    if (bank.length === 0) return;

    const minIdx = Math.max(0, targetIndex - 1);
    const maxIdx = Math.min(bank.length - 1, targetIndex + 2);

    for (let k = minIdx; k <= maxIdx; k++) {
      if (!lru.has(k)) {
        lru.set(k, null);
        createImageBitmap(bank[k].blob)
          .then((bmp) => {
            lru.set(k, bmp);
          })
          .catch((err) => {
            console.warn('createImageBitmap failed for index', k, err);
            lru.delete(k);
          });
      }
    }

    // Evict oldest / furthest when size exceeds LRU_MAX
    while (lru.size > LRU_MAX) {
      let furthestKey: number | null = null;
      let maxDist = -1;
      for (const key of lru.keys()) {
        const dist = Math.abs(key - targetIndex);
        if (dist > maxDist) {
          maxDist = dist;
          furthestKey = key;
        }
      }
      if (furthestKey !== null) {
        const bmp = lru.get(furthestKey);
        if (bmp) {
          bmp.close();
        }
        lru.delete(furthestKey);
      } else {
        break;
      }
    }
  }, []);

  // Frame Bank Builder using WebCodecs + MP4Box
  const buildFrameBank = useCallback(async () => {
    if (buildingRef.current || readyRef.current || revertedRef.current) return;
    if (typeof window === 'undefined') return;

    // Skip if reduced motion or WebCodecs VideoDecoder not supported
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof window.VideoDecoder === 'undefined') {
      console.log('Skipping frame bank: reduced motion or VideoDecoder unsupported');
      revertedRef.current = true;
      return;
    }

    buildingRef.current = true;

    // 60s Watchdog timer
    const watchdogTimer = setTimeout(() => {
      if (!paintedRef.current) {
        console.warn('Watchdog expired (60s): reverting to video currentTime seeking fallback');
        revertedRef.current = true;
        readyRef.current = false;
        setCanvasLive(false);
      }
    }, WATCHDOG);

    let retrySoftware = false;

    const runDecoder = async (hardwarePreference: HardwarePreference): Promise<boolean> => {
      try {
        const response = await fetch(videoSrc, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`HTTP error fetching video: ${response.status}`);
        }
        const buffer = await response.arrayBuffer();

        return new Promise<boolean>((resolve) => {
          const mp4boxFile = MP4Box.createFile();
          let decoder: VideoDecoder | null = null;
          let activeBlobEncodings = 0;
          let trackId = -1;
          const collectedBank: FrameBankEntry[] = [];
          const offscreen = document.createElement('canvas');
          const offCtx = offscreen.getContext('2d');

          let sampleQueue: any[] = [];
          let feedingActive = false;

          const feedNextChunks = () => {
            if (!decoder || decoder.state !== 'configured') return;
            while (sampleQueue.length > 0 && activeBlobEncodings < LEAD) {
              const sample = sampleQueue.shift();
              const chunk = new EncodedVideoChunk({
                type: sample.is_sync ? 'key' : 'delta',
                timestamp: (1e6 * sample.cts) / sample.timescale,
                duration: (1e6 * sample.duration) / sample.timescale,
                data: sample.data,
              });
              decoder.decode(chunk);
            }
          };

          decoder = new VideoDecoder({
            output: (frame: VideoFrame) => {
              activeBlobEncodings++;
              if (offscreen.width !== frame.displayWidth || offscreen.height !== frame.displayHeight) {
                offscreen.width = frame.displayWidth;
                offscreen.height = frame.displayHeight;
              }
              if (offCtx) {
                offCtx.drawImage(frame, 0, 0);
              }
              const ts = frame.timestamp;
              frame.close();

              offscreen.toBlob(
                (blob) => {
                  activeBlobEncodings--;
                  if (blob) {
                    collectedBank.push({ ts, blob });
                  }
                  feedNextChunks();
                },
                'image/webp',
                0.82
              );
            },
            error: (err: any) => {
              console.warn(`VideoDecoder (${hardwarePreference}) error:`, err);
              if (decoder && decoder.state !== 'closed') {
                decoder.close();
              }
              resolve(false);
            },
          });

          mp4boxFile.onReady = (info: any) => {
            if (!info.videoTracks || info.videoTracks.length === 0) {
              resolve(false);
              return;
            }
            const track = info.videoTracks[0];
            trackId = track.id;
            const description = getTrackDescription(mp4boxFile, track);

            try {
              decoder?.configure({
                codec: track.codec,
                codedWidth: track.track_width,
                codedHeight: track.track_height,
                description,
                hardwareAcceleration: hardwarePreference,
              });
            } catch (cfgErr) {
              console.warn(`Failed to configure decoder with ${hardwarePreference}:`, cfgErr);
              resolve(false);
              return;
            }

            mp4boxFile.setExtractionOptions(trackId, null, { nbSamples: Infinity });
            mp4boxFile.start();
          };

          mp4boxFile.onSamples = (_id: number, _user: any, samples: any[]) => {
            sampleQueue.push(...samples);
            feedNextChunks();
          };

          mp4boxFile.onError = (err: any) => {
            console.warn('MP4Box parse error:', err);
            resolve(false);
          };

          // Append buffer to mp4box
          const fileBuf = buffer as any;
          fileBuf.fileStart = 0;
          mp4boxFile.appendBuffer(fileBuf);
          mp4boxFile.flush();

          // Check for completion
          const checkDoneInterval = setInterval(async () => {
            if (sampleQueue.length === 0 && activeBlobEncodings === 0 && collectedBank.length > 0) {
              clearInterval(checkDoneInterval);
              try {
                if (decoder && decoder.state === 'configured') {
                  await decoder.flush();
                }
              } catch (_) {}
              if (decoder && decoder.state !== 'closed') {
                decoder.close();
              }

              // Sort bank chronologically by ts
              collectedBank.sort((a, b) => a.ts - b.ts);
              bankRef.current = collectedBank;
              readyRef.current = true;
              console.log(`Frame bank live: decoded ${collectedBank.length} frames`);
              resolve(true);
            }
          }, 150);
        });
      } catch (e) {
        console.warn(`Decoder run failed (${hardwarePreference}):`, e);
        return false;
      }
    };

    // Attempt hardware decode first
    let success = await runDecoder('prefer-hardware');
    if (!success && !revertedRef.current) {
      console.log('Retrying with prefer-software hardware acceleration...');
      retrySoftware = true;
      success = await runDecoder('prefer-software');
    }

    clearTimeout(watchdogTimer);

    if (!success) {
      revertedRef.current = true;
      readyRef.current = false;
      setCanvasLive(false);
    }
  }, [videoSrc]);

  // Launch build after window load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (document.readyState === 'complete') {
      buildFrameBank();
    } else {
      const handleLoad = () => buildFrameBank();
      window.addEventListener('load', handleLoad, { once: true });
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [buildFrameBank]);

  // Main rAF loop every frame
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const deltaSeconds = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(0.1, deltaSeconds);

      const p = getProgress();
      setScrollProgress(p);

      const dur = durRef.current;
      if (dur > 0) {
        const normalizedP = clamp(0, 1, (p - scrubRange[0]) / (scrubRange[1] - scrubRange[0]));
        const target = normalizedP * dur;
        targetRef.current = target;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
          currentRef.current = target;
        } else {
          currentRef.current += (target - currentRef.current) * (1 - Math.exp(-dt * LERP_TAU));
          if (Math.abs(target - currentRef.current) < SNAP) {
            currentRef.current = target;
          }
        }

        const current = currentRef.current;

        // If frame bank is ready, render to canvas
        if (readyRef.current && bankRef.current.length > 0) {
          const nearestIdx = findNearestFrameIndex(current * 1e6);
          if (nearestIdx >= 0) {
            warmLRU(nearestIdx);

            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              const bmp = lruRef.current.get(nearestIdx);

              if (bmp && ctx) {
                if (canvas.width !== bmp.width || canvas.height !== bmp.height) {
                  canvas.width = bmp.width;
                  canvas.height = bmp.height;
                }
                ctx.drawImage(bmp, 0, 0);
                lastIndexDrawnRef.current = nearestIdx;

                if (!paintedRef.current) {
                  paintedRef.current = true;
                  setCanvasLive(true);
                }
              }
            }
          }
        } else {
          // Fallback: video element currentTime seeking
          const video = videoRef.current;
          if (video && !video.seeking) {
            if (Math.abs(video.currentTime - current) > 0.01) {
              video.currentTime = current;
            }
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const handleResize = () => {
      setScrollProgress(getProgress());
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [getProgress, findNearestFrameIndex, warmLRU]);

  return {
    containerRef,
    videoRef,
    canvasRef,
    scrollProgress,
    canvasLive,
    duration,
  };
}
