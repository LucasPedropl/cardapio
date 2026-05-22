import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { ProductSlide } from "./ProductSlide";
import { VideoSlide } from "./VideoSlide";
import { MOCK_PRODUCTS } from "../data/products";
import type { BoardConfig } from "../schemas/config";

interface DisplayScreenProps {
  config: BoardConfig;
  onExit: () => void;
}

type SlideItem = 
  | { type: "product"; data: typeof MOCK_PRODUCTS[0]; id: string }
  | { type: "video"; url: string; id: string };

export function DisplayScreen({ config, onExit }: DisplayScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Setup the playlist sequence
  const playlist: SlideItem[] = MOCK_PRODUCTS.map((p) => ({
    type: "product",
    data: p,
    id: `product-${p.id}`,
  }));

  if (config.youtubeUrl) {
    playlist.push({
      type: "video",
      url: config.youtubeUrl,
      id: "video-interstitial",
    });
  }

  const currentItem = playlist[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  useEffect(() => {
    // If the slide is a video, progression is handled by onEnded callback in VideoSlide
    if (currentItem.type === "video") return;

    const timer = setTimeout(nextSlide, config.slideDuration * 1000);
    return () => clearTimeout(timer);
  }, [currentIndex, config.slideDuration, currentItem.type, playlist.length]);

  // Handle escape key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit]);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative cursor-none select-none">
       {/* Small hint on first load, fades out quickly */}
      <div className="absolute top-4 left-4 z-50 text-white/30 text-xs font-mono uppercase animate-pulse pointer-events-none fade-out-after-5s">
        Press ESC to exit
      </div>

      <AnimatePresence mode="wait">
        {currentItem.type === "product" && (
          <ProductSlide
            key={currentItem.id}
            product={currentItem.data}
            index={MOCK_PRODUCTS.indexOf(currentItem.data)}
            total={MOCK_PRODUCTS.length}
          />
        )}
        {currentItem.type === "video" && (
          <VideoSlide
            key={`${currentItem.id}-${currentIndex}`} // Force remount if looping through the same video
            url={currentItem.url}
            onComplete={nextSlide}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
