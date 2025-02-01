/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { VideoControls } from './VideoControls';

interface YouTubePlayerProps {
  videoId: string;
}

export const YouTubePlayer = ({ videoId }: YouTubePlayerProps) => {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
          return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };
      });
    };

    const initializePlayer = async () => {
      try {
        await loadYouTubeAPI();

        playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            showinfo: 0,
            mute: 0, // Changed to 0 to not force mute
            enablejsapi: 1,
            playsinline: 1,
            origin: window.location.origin,
            fs: 1
          },
          events: {
            onReady: (event: YT.PlayerEvent) => {
              setPlayerReady(true);
              setDuration(event.target.getDuration());
              // Set initial volume
              event.target.setVolume(50);
              setIsMuted(false);
            },
            onStateChange: (event: YT.OnStateChangeEvent) => {
              setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.seekTo(0, true);
                if (hasUserInteracted) {
                  event.target.playVideo();
                }
              }
            },
            onError: (error: YT.OnErrorEvent) => {
              console.error('YouTube Player Error:', error);
            }
          },
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
      }
    };

    initializePlayer();
    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playerReady && isPlaying) {
      interval = setInterval(() => {
        try {
          if (playerRef.current && playerRef.current.getCurrentTime) {
            const time = playerRef.current.getCurrentTime();
            setCurrentTime(time);
          }
        } catch (error) {
          console.error('Error getting current time:', error);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playerReady, isPlaying]);

  const handlePlay = () => {
    if (!playerRef.current || !playerReady) return;
    try {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
        playerRef.current.unMute();
        playerRef.current.setVolume(50);
      }
      
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (error) {
      console.error('Error toggling play state:', error);
    }
  };

  const handleSeek = (time: number) => {
    try {
      if (playerRef.current && playerRef.current.seekTo && playerReady) {
        playerRef.current.seekTo(time, true);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const handleMute = (muted: boolean) => {
    if (!playerRef.current) return;
    try {
      if (muted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(50);
      }
      setIsMuted(muted);
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div id={`youtube-player-${videoId}`} className="w-full h-full" />
      {playerReady && (
        <VideoControls
          isYoutube={true}
          isPlaying={isPlaying}
          duration={duration}
          currentTime={currentTime}
          onPlay={handlePlay}
          onSeek={handleSeek}
          onFullscreen={handleFullscreen}
          isMuted={isMuted}
          onMute={handleMute}
        />
      )}
      {!hasUserInteracted && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer z-10"
          onClick={handlePlay}
        >
          <div className="text-white text-center bg-black/70 p-6 rounded-lg">
            <div className="text-6xl mb-4">🔊</div>
            <p className="text-lg">Click to play with sound</p>
          </div>
        </div>
      )}
    </div>
  );
};
