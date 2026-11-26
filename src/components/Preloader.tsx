import React, { useEffect, useState, useRef } from 'react';

const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/').replace(/\/$/, '');
const asset = (p: string) => {
  if (!p) return '';
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) return p;
  if (base && p.startsWith(base)) return p;
  return `${base}${p.startsWith('/') ? p : '/' + p}`;
};

interface PreloaderProps {
  onComplete?: () => void;
  lang?: string;
}

export default function Preloader({ onComplete, lang = 'th' }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const progressRef = useRef(0);

  // Status captions based on language
  const getStatusText = (pct: number) => {
    if (lang === 'en') {
      if (pct < 30) return 'INITIALIZING CREATIVE ENGINE...';
      if (pct < 70) return 'CALIBRATING 4K VISUALS & CODECS...';
      if (pct < 95) return 'SYNCHRONIZING AUDIO-VISUAL ASSETS...';
      return 'EXPERIENCE READY';
    }
    if (lang === 'zh') {
      if (pct < 30) return '正在初始化视听引擎...';
      if (pct < 70) return '正在校准电影级画质与编解码器...';
      if (pct < 95) return '正在同步高精度工作室资源...';
      return '系统就绪 · 即刻开启';
    }
    // Thai (default)
    if (pct < 30) return 'กำลังเริ่มต้นระบบประมวลผลสตูดิโอ...';
    if (pct < 70) return 'กำลังจัดเตรียมไทม์ไลน์ 4K และเอฟเฟกต์ภาพยนตร์...';
    if (pct < 95) return 'กำลังปรับเทียบความคมชัดและระบบเสียง...';
    return 'พร้อมเปิดประสบการณ์ ULTRA CREATOR';
  };

  useEffect(() => {
    let isMounted = true;
    let targetProgress = 0;
    const startTime = performance.now();
    const MIN_DURATION = 1400; // minimum duration in ms for cinematic feel

    // 1. Task: Fonts ready
    const fontPromise = (document as any).fonts ? (document as any).fonts.ready : Promise.resolve();

    // 2. Task: Preload critical logo image
    const logoPromise = new Promise<void>((resolve) => {
      const img = new Image();
      img.src = asset('/brand/uc-logo-white.png');
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

    // 3. Task: Preload intro video metadata
    const videoPromise = new Promise<void>((resolve) => {
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.src = asset('/videos/intro-light-loop.mp4');
      vid.onloadedmetadata = () => resolve();
      vid.onerror = () => resolve();
      // Timeout fallback in case video fails or network blocks
      setTimeout(() => resolve(), 3000);
    });

    // Track real assets progress
    fontPromise.then(() => {
      if (isMounted) targetProgress = Math.max(targetProgress, 35);
    });

    logoPromise.then(() => {
      if (isMounted) targetProgress = Math.max(targetProgress, 60);
    });

    videoPromise.then(() => {
      if (isMounted) targetProgress = Math.max(targetProgress, 90);
    });

    // Smooth animation tick
    const interval = setInterval(() => {
      if (!isMounted) return;
      const elapsed = performance.now() - startTime;
      const timeRatio = Math.min(1, elapsed / MIN_DURATION);
      
      // Target combines time progression + asset readiness
      const currentTarget = Math.max(targetProgress, Math.floor(timeRatio * 92));

      if (progressRef.current < currentTarget) {
        progressRef.current = Math.min(currentTarget, progressRef.current + Math.ceil((currentTarget - progressRef.current) * 0.18) + 1);
        setProgress(progressRef.current);
      }

      // Check if finished
      if (elapsed >= MIN_DURATION && progressRef.current >= 90) {
        progressRef.current = 100;
        setProgress(100);
        clearInterval(interval);

        // Initiate fade-out after brief pause at 100%
        setTimeout(() => {
          if (!isMounted) return;
          setIsFading(true);
          if (onComplete) onComplete();
          
          setTimeout(() => {
            if (isMounted) setIsDone(true);
          }, 850);
        }, 220);
      }
    }, 24);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      className="preloader-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#070109',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: isFading ? 'none' : 'auto',
        transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
      aria-label="Loading Ultra Creator"
      role="status"
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.18) 0%, rgba(130, 24, 180, 0.08) 45%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'preloader-pulse 3s ease-in-out infinite alternate',
        }}
      />

      {/* Main Content Card */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: '440px',
        }}
      >
        {/* Animated Brand Logo with Glowing Halo */}
        <div
          style={{
            position: 'relative',
            width: '84px',
            height: '84px',
            marginBottom: '28px',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {/* Subtle spinning glow ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              border: '1.5px solid transparent',
              borderTopColor: 'rgba(232, 121, 249, 0.7)',
              borderRightColor: 'rgba(192, 132, 252, 0.2)',
              animation: 'preloader-spin 2.4s linear infinite',
            }}
          />
          {/* Brand Icon */}
          <img
            src={asset('/brand/uc-logo-white.png')}
            alt="Ultra Creator Logo"
            style={{
              width: '56px',
              height: 'auto',
              filter: 'drop-shadow(0 0 25px rgba(232, 121, 249, 0.65))',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Studio Eyebrow */}
        <p
          style={{
            fontFamily: "'Cinzel', 'Sora', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.28em',
            color: '#e879f9',
            textTransform: 'uppercase',
            marginBottom: '8px',
            fontWeight: 500,
          }}
        >
          ULTRA CREATOR
        </p>

        {/* Sub-label */}
        <p
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'rgba(255, 255, 255, 0.45)',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}
        >
          PRODUCTION &amp; EDITING STUDIO
        </p>

        {/* Progress Bar Container */}
        <div
          style={{
            width: '260px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '16px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {/* Active Progress Line */}
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #9333ea 0%, #e879f9 70%, #ffffff 100%)',
              borderRadius: '9999px',
              transition: 'width 0.12s ease-out',
              boxShadow: '0 0 12px rgba(232, 121, 249, 0.9)',
            }}
          />
        </div>

        {/* Percentage Counter & Dynamic Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '260px',
            fontSize: '11px',
            color: 'rgba(240, 215, 255, 0.7)',
            fontFamily: "'Prompt', sans-serif",
          }}
        >
          <span style={{ fontSize: '10px', letterSpacing: '0.04em', color: '#c084fc' }}>
            {getStatusText(progress)}
          </span>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              fontWeight: 600,
              color: '#ffffff',
              marginLeft: '8px',
            }}
          >
            {progress < 10 ? `0${progress}` : progress}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes preloader-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes preloader-pulse {
          0% { transform: scale(0.95); opacity: 0.6; }
          100% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
