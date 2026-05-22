import { useState } from "react";
import { motion } from "motion/react";
import ReactPlayer from "react-player";
import { Volume2, VolumeX } from "lucide-react";

// Bypass React 18/19 mismatch issues on library typing definitions
const Player = ReactPlayer as any;

interface VideoSlideProps {
  url: string;
  onComplete: () => void;
}

export function VideoSlide({ url, onComplete }: VideoSlideProps) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Standard Full-Aspect Cinematic Container */}
      <div className="absolute inset-0 w-full h-full relative z-0">
        <Player
          url={url}
          playing={true}
          controls={false}
          muted={isMuted}
          width="100%"
          height="100%"
          onEnded={onComplete}
          onError={(e: any) => {
             console.error("Video failed to play", e);
             onComplete(); // Skip slide on failure
          }}
          config={{
             youtube: {
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  disablekb: 1,
                  modestbranding: 1,
                  rel: 0,
                  iv_load_policy: 3,
                  mute: isMuted ? 1 : 0
                }
             }
          }}
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />
      </div>

      {/* Subtle overlay for better contrast in standard layouts */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />

      {/* Floating Audio Status Toggle Button */}
      <div className="absolute bottom-10 left-6 md:left-20 z-20 flex items-center gap-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center gap-2.5 bg-black/75 border border-white/20 hover:border-red-600/50 hover:bg-black text-white px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer"
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
          *Tap to toggle sound feed
        </p>
      </div>

      {/* Live Signage Indicator Tag */}
      <div className="absolute top-0 right-0 bg-red-600 text-white font-sans px-5 py-2 text-[10px] uppercase font-black tracking-widest leading-none shadow-lg z-25 select-none rounded-bl-sm">
        Video Interstitial
      </div>
    </motion.div>
  );
}
