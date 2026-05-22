import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { ProductSlide } from "./ProductSlide";
import { DrinkSlide } from "./DrinkSlide";
import { GridSlide } from "./GridSlide";
import { VideoSlide } from "./VideoSlide";
import { MOCK_PRODUCTS } from "../data/products";
import type { BoardConfig } from "../schemas/config";

interface DisplayScreenProps {
  config: BoardConfig;
  onExit: () => void;
}

type SlideItem = 
  | { type: "product"; data: typeof MOCK_PRODUCTS[0]; id: string }
  | { type: "drinks"; id: string }
  | { type: "grid"; id: string }
  | { type: "video"; url: string; id: string };

export function DisplayScreen({ config, onExit }: DisplayScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Build the playlist beautifully sequence
  const playlist: SlideItem[] = [
    // 1st burger
    { type: "product", data: MOCK_PRODUCTS[0], id: `product-${MOCK_PRODUCTS[0].id}` },
    // 2nd burger
    { type: "product", data: MOCK_PRODUCTS[1], id: `product-${MOCK_PRODUCTS[1].id}` },
    // Beverages slide
    { type: "drinks", id: "slide-drinks-special" },
    // 3rd food item
    { type: "product", data: MOCK_PRODUCTS[2], id: `product-${MOCK_PRODUCTS[2].id}` },
    // Mixed sides grid
    { type: "grid", id: "slide-grid-sides" },
  ];

  // Insert YouTube interstitial at the end of the rotation if configured
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
    // If the slide is a video, transition is handled by onEnded callback in VideoSlide
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
    <div className="w-full h-screen bg-[#050505] overflow-hidden relative select-none">
      {/* Press esc indicator */}
      <div className="absolute top-4 left-4 z-50 text-white/20 text-[10px] font-mono uppercase tracking-widest pointer-events-none fade-out-after-5s">
        Press ESC to exit
      </div>

      <AnimatePresence mode="wait">
        {currentItem.type === "product" && (
          <ProductSlide 
            key={currentItem.id} 
            product={currentItem.data} 
            index={currentIndex}
            total={playlist.length}
          />
        )}
        {currentItem.type === "drinks" && (
          <DrinkSlide 
            key={currentItem.id} 
            index={currentIndex}
            total={playlist.length}
          />
        )}
        {currentItem.type === "grid" && (
          <GridSlide 
            key={currentItem.id} 
            index={currentIndex}
            total={playlist.length}
          />
        )}
        {currentItem.type === "video" && (
          <VideoSlide
            key={`${currentItem.id}-${currentIndex}`} // Force remount each time the user reaches the video
            url={currentItem.url}
            onComplete={nextSlide}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
