import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, Pause } from "lucide-react";

interface VideoSlideProps {
  url: string;
  onComplete: () => void;
  isPaused: boolean;
  startAt?: number;
  maxDuration?: number;
  onProgressUpdate?: (seconds: number) => void;
}

function extractYouTubeID(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
}

export function VideoSlide({ 
  url, 
  onComplete, 
  isPaused,
  startAt = 0,
  maxDuration,
  onProgressUpdate
}: VideoSlideProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [initialStartAt] = useState(() => startAt);
  const playerRef = useRef<any>(null);
  const containerId = useRef(`yt-container-${Math.random().toString(36).substring(2, 9)}`);
  const videoId = extractYouTubeID(url);

  const onCompleteRef = useRef(onComplete);
  const onProgressUpdateRef = useRef(onProgressUpdate);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  // Load the YouTube Iframe Player API script if not present
  useEffect(() => {
    if (!videoId) {
      console.error("Invalid YouTube URL");
      onCompleteRef.current();
      return;
    }

    let isMounted = true;

    // Helper to initialize Player on the existing iframe
    const initPlayer = () => {
      if (!isMounted) return;

      const YT = (window as any).YT;
      if (!YT || !YT.Player) return;

      try {
        playerRef.current = new YT.Player(containerId.current, {
          events: {
            onReady: (event: any) => {
              if (isMounted) {
                // Ensure initial mute state is correct
                if (isMuted) {
                  event.target.mute();
                } else {
                  event.target.unMute();
                }

                if (isPaused) {
                  event.target.pauseVideo();
                } else {
                  event.target.playVideo();
                }
              }
            },
            onStateChange: (event: any) => {
              // 0 means ended
              if (event.data === 0 && isMounted) {
                if (onProgressUpdateRef.current) {
                  onProgressUpdateRef.current(0);
                }
                onCompleteRef.current();
              }
            },
            onError: (err: any) => {
              if (isMounted) {
                console.error("YouTube Player error encountered, skipping.", err);
                onCompleteRef.current();
              }
            },
          },
        });
      } catch (err) {
        console.error("Error creating YT.Player on iframe:", err);
        onCompleteRef.current();
      }
    };

    // Script injection check
    if (!(window as any).YT) {
      // Create script tag
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }

      // Hook up callback
      (window as any).onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      // API already loaded, init directly
      const timer = setTimeout(initPlayer, 150);
      return () => clearTimeout(timer);
    }

    return () => {
      isMounted = false;
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Sync mute state updates with YouTube Player instance
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.mute === "function") {
      try {
        if (isMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      } catch (err) {
        console.warn("Unable to sync mute state", err);
      }
    }
  }, [isMuted]);

  // Sync play/pause updates from Spacebar actions with YouTube Player
  useEffect(() => {
    if (playerRef.current) {
      try {
        const state = playerRef.current.getPlayerState?.();
        if (isPaused) {
          if (state !== 2) playerRef.current.pauseVideo(); // 2 is paused state
        } else {
          if (state !== 1) playerRef.current.playVideo(); // 1 is playing state
        }
      } catch (err) {
        console.warn("Unable to sync play/pause state", err);
      }
    }
  }, [isPaused]);

  // Poll playback progress and handle chunk limits
  useEffect(() => {
    if (isPaused) return;
    
    let intervalId: any;
    
    const startPolling = () => {
      intervalId = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
          try {
            const currentTime = playerRef.current.getCurrentTime();
            if (currentTime > 0) {
              if (onProgressUpdateRef.current) {
                onProgressUpdateRef.current(currentTime);
              }
              
              if (maxDuration) {
                const elapsedSinceStart = currentTime - initialStartAt;
                if (elapsedSinceStart >= maxDuration) {
                  clearInterval(intervalId);
                  onCompleteRef.current();
                }
              }
            }
          } catch (err) {
            console.warn("Error polling playback position:", err);
          }
        }
      }, 500);
    };

    startPolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPaused, initialStartAt, maxDuration]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Container Element injected into by YouTube Player API */}
      <div className="absolute inset-0 w-full h-full relative z-0 scale-105 pointer-events-none">
        {videoId && (
          <iframe
            id={containerId.current}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}${initialStartAt > 0 ? `&start=${Math.floor(initialStartAt)}` : ""}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="YouTube video player"
            frameBorder="0"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        )}
      </div>

      {/* Transparent Overlay to block interactive click-jacking which disrupts the sign display loop */}
      <div className="absolute inset-0 z-10 bg-transparent" />

      {/* Floating Audio Toggle Controls */}
      <div className="absolute bottom-10 left-6 md:left-20 z-20 flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Avoid triggering full screen pause
            setIsMuted(!isMuted);
          }}
          className="flex items-center gap-2.5 bg-black/75 border border-white/20 hover:border-red-600/50 hover:bg-black text-white px-4 py-2.5 text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer shadow-lg outline-none"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Unmute Video</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Mute Audio</span>
            </>
          )}
        </button>
        <p className="text-[10px] text-white/40 font-mono tracking-wider italic">
          *Tap to toggle audio track
        </p>
      </div>

      {/* Visual Indicator overlay if paused */}
      <AnimatePresence>
        {isPaused && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-white/10 p-6 rounded-full z-30 flex items-center justify-center shadow-2xl"
          >
            <Pause className="w-10 h-10 text-red-500 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage Live Sign Indicator */}
      <div className="absolute top-0 right-0 bg-red-600 text-white font-sans px-5 py-2 text-[10px] uppercase font-black tracking-widest leading-none shadow-lg z-25 select-none rounded-bl-sm">
        Video Interstitial
      </div>
    </motion.div>
  );
}
export default VideoSlide;
