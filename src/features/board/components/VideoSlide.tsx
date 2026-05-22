import { motion } from "motion/react";
import ReactPlayer from "react-player";

// Bypass React 18/19 mismatch issues on library typing definitions
const Player = ReactPlayer as any;

interface VideoSlideProps {
  url: string;
  onComplete: () => void;
}

export function VideoSlide({ url, onComplete }: VideoSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="w-full h-[150vh] min-w-[200vw] sm:w-[150vw] sm:min-w-0 sm:min-h-0 sm:h-[120vh] md:w-full md:h-full pointer-events-none relative scale-125">
        <Player
          url={url}
          playing={true}
          controls={false}
          muted={false}
          width="100%"
          height="100%"
          onEnded={onComplete}
          onError={(e: any) => {
             console.error("Video failed to load or play", e);
             onComplete(); // Skip slide if failed
          }}
          config={{
             youtube: {
                disablekb: 1,
                rel: 0,
                iv_load_policy: 3
             }
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
    </motion.div>
  );
}

