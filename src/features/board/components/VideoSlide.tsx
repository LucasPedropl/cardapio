import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";

interface VideoSlideProps {
  url: string;
  onComplete: () => void;
}

function extractYouTubeID(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
}

export function VideoSlide({ url, onComplete }: VideoSlideProps) {
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<any>(null);
  const containerId = useRef(`yt-container-${Math.random().toString(36).substring(2, 9)}`);
  const videoId = extractYouTubeID(url);

  // Load the YouTube Iframe Player API script if not present
  useEffect(() => {
    if (!videoId) {
      console.error("Invalid YouTube URL");
      onComplete();
      return;
    }

    let isMounted = true;

    // Helper to initialize Player
    const initPlayer = () => {
      if (!isMounted) return;

      const YT = (window as any).YT;
      if (!YT || !YT.Player) return;

      try {
        playerRef.current = new YT.Player(containerId.current, {
          videoId: videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            origin: window.location.origin,
            mute: isMuted ? 1 : 0,
          },
          events: {
            onReady: (event: any) => {
              if (isMounted) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              // 0 means ended
              if (event.data === 0 && isMounted) {
                onComplete();
              }
            },
            onError: () => {
              if (isMounted) {
                console.error("YouTube Player error encountered, skipping.");
                onComplete();
              }
            },
          },
        });
      } catch (err) {
        console.error("Error creating YT.Player:", err);
        onComplete();
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
      // Tiny timeout ensures DOM is fully painted
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
        <div id={containerId.current} className="w-full h-full" />
      </div>

      {/* Transparent Overlay to block interactive click-jacking which disrupts the sign display loop */}
      <div className="absolute inset-0 z-10 bg-transparent" />

      {/* Floating Audio Toggle Controls */}
      <div className="absolute bottom-10 left-6 md:left-20 z-20 flex items-center gap-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
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

      {/* Stage Live Sign Indicator */}
      <div className="absolute top-0 right-0 bg-red-600 text-white font-sans px-5 py-2 text-[10px] uppercase font-black tracking-widest leading-none shadow-lg z-20 select-none rounded-bl-sm">
        Video Interstitial
      </div>
    </motion.div>
  );
}
