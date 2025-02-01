interface YTEvent {
  target: YT.Player;
  data: number;
}

interface YT {
  Player: {
    new (
      elementId: string,
      config: {
        videoId?: string;
        height?: string | number;
        width?: string | number;
        playerVars?: {
          autoplay?: 0 | 1;
          controls?: 0 | 1;
          rel?: 0 | 1;
          enablejsapi?: 0 | 1;
          origin?: string;
          mute?: 0 | 1;
          playsinline?: 0 | 1;
          fs?: 0 | 1;
          showinfo?: 0 | 1;
        };
        events?: {
          onReady?: (event: YTEvent) => void;
          onStateChange?: (event: YTEvent) => void;
          onError?: (event: YTEvent) => void;
        };
      }
    ): YT.Player;
  };
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

interface Player {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getVideoLoadedFraction(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setVolume(volume: number): void;
  getVolume(): number;
  destroy(): void;
}

declare global {
  interface Window {
    YT: YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

declare namespace YT {
  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    rel?: 0 | 1;
    showinfo?: 0 | 1;
    mute?: 0 | 1;
    enablejsapi?: 0 | 1;
    playsinline?: 0 | 1;
    origin?: string;
    fs?: 0 | 1;
  }
}

export {};
