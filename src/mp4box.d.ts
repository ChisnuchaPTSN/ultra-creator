declare module 'mp4box' {
  export interface MP4MediaTrack {
    id: number;
    created: Date;
    modified: Date;
    volume: number;
    track_width: number;
    track_height: number;
    timescale: number;
    duration: number;
    bitrate: number;
    codec: string;
    language: string;
    nb_samples: number;
  }

  export interface MP4VideoTrack extends MP4MediaTrack {
    video: {
      width: number;
      height: number;
    };
  }

  export interface MP4Info {
    duration: number;
    timescale: number;
    isFragmented: boolean;
    isProgressive: boolean;
    hasMoov: boolean;
    tracks: MP4MediaTrack[];
    videoTracks: MP4VideoTrack[];
    audioTracks: MP4MediaTrack[];
  }

  export interface MP4Sample {
    track_id: number;
    number: number;
    data: Uint8Array;
    size: number;
    cts: number;
    dts: number;
    duration: number;
    is_sync: boolean;
    timescale: number;
  }

  export class DataStream {
    static BIG_ENDIAN: number;
    static LITTLE_ENDIAN: number;
    position: number;
    buffer: ArrayBuffer;
    constructor(buffer?: ArrayBuffer, byteOffset?: number, endianness?: number);
    writeUint8(value: number): void;
    writeUint16(value: number): void;
    writeUint32(value: number): void;
  }

  export interface MP4BoxFile {
    onReady?: (info: MP4Info) => void;
    onError?: (err: any) => void;
    onSamples?: (track_id: number, user: any, samples: MP4Sample[]) => void;
    appendBuffer(data: ArrayBuffer & { fileStart?: number }): number;
    flush(): void;
    start(): void;
    stop(): void;
    setExtractionOptions(track_id: number, user?: any, options?: { nbSamples?: number; rapAlignment?: boolean }): void;
    getTrackById(track_id: number): any;
  }

  export function createFile(): MP4BoxFile;

  const MP4Box: {
    createFile: () => MP4BoxFile;
    DataStream: typeof DataStream;
  };

  export default MP4Box;
}
