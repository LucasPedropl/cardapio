import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause } from "lucide-react";
import { ProductSlide } from "./ProductSlide";
import { DrinkSlide } from "./DrinkSlide";
import { GridSlide } from "./GridSlide";
import { VideoSlide } from "./VideoSlide";
import { DessertSlide } from "./DessertSlide";
import { SaladSlide } from "./SaladSlide";
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
  | { type: "desserts"; id: string }
  | { type: "salads"; id: string }
  | { type: "video"; url: string; id: string };

export function DisplayScreen({ config, onExit }: DisplayScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Fallbacks in case config array fields are empty or undefined
  const rawOrder = config.playlistOrder || [];
  const rawEnabled = config.enabledSlides || {};

  // Get all enabled non-video slides according to user ordering
  const nonVideoSlides: SlideItem[] = rawOrder
    .filter((id) => id !== "video" && rawEnabled[id] !== false)
    .map((id) => {
      switch (id) {
        case "product_1":
          return { type: "product" as const, data: MOCK_PRODUCTS[0], id };
        case "product_2":
          return { type: "product" as const, data: MOCK_PRODUCTS[1], id };
        case "product_3":
          return { type: "product" as const, data: MOCK_PRODUCTS[2], id };
        case "drinks":
          return { type: "drinks" as const, id };
        case "grid_sides":
          return { type: "grid" as const, id };
        case "desserts":
          return { type: "desserts" as const, id };
        case "salads":
          return { type: "salads" as const, id };
        default:
          return null;
      }
    })
    .filter((item) => item !== null) as SlideItem[];

  // Build final playlist based on layout interleaving settings
  let playlist: SlideItem[] = [];
  const videoItem: SlideItem | null = config.youtubeUrl
    ? { type: "video" as const, url: config.youtubeUrl, id: "video" }
    : null;

  if (config.interleaveVideo && videoItem) {
    // Interleaved mode: Slide 1 -> Video -> Slide 2 -> Video...
    nonVideoSlides.forEach((slide, idx) => {
      playlist.push(slide);
      playlist.push({
        ...videoItem,
        id: `video-interleaved-${idx}-${slide.id}`,
      });
    });
  } else {
    // Standard mode: Slides list first, and then the video at the end of loop
    playlist = [...nonVideoSlides];
    if (videoItem && rawEnabled["video"] !== false) {
      playlist.push({
        ...videoItem,
        id: "video-at-end",
      });
    }
  }

  const currentItem = playlist[currentIndex];

  const nextSlide = () => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  // Keyboard shortcut controller: Space, Esc, Right Arrow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault(); // Stop webpage standard scrolling
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playlist.length, onExit, currentIndex]);

  // Handle slide transition intervals
  useEffect(() => {
    if (playlist.length === 0 || !currentItem) return;
    // Skip intervals for active live video player slides or when paused
    if (currentItem.type === "video" || isPaused) return;

    const timer = setTimeout(nextSlide, config.slideDuration * 1000);
    return () => clearTimeout(timer);
  }, [currentIndex, config.slideDuration, currentItem?.type, playlist.length, isPaused]);

  // Safe fallback if user disables all slides
  if (playlist.length === 0) {
    return (
      <div className="w-full h-screen bg-[#050505] flex flex-col items-center justify-center text-[#F5F5F0] font-sans p-6">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-sm opacity-50 uppercase tracking-[0.2em]">Playlist Empty</p>
          <h3 className="text-2xl font-serif italic font-bold">No slides are currently active</h3>
          <p className="text-xs text-zinc-500 leading-relaxed font-light">
            Go back to the configuration panel, toggle slide options, and arrange their live feed order sequence.
          </p>
          <button 
            onClick={onExit}
            className="bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-red-650 hover:text-white transition-all cursor-pointer shadow-lg outline-none"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button") || target.closest("input") || target.closest("a") || target.closest("label")) {
          return;
        }
        setIsPaused((prev) => !prev);
      }}
      className="w-full h-screen bg-[#050505] overflow-hidden relative select-none cursor-pointer"
    >
      {/* Dynamic Floating Command Instructions */}
      {currentItem?.type !== "video" && (
        <div className="absolute top-4 left-4 z-50 text-white/20 hover:text-white/40 transition-colors text-[9px] font-mono uppercase tracking-widest pointer-events-none flex items-center gap-3">
          <span>ESC: EXIT</span>
          <span>•</span>
          <span>SPACEBAR: {isPaused ? "RESUME" : "PAUSE"}</span>
          <span>•</span>
          <span>RIGHT ARROW: SKIP</span>
        </div>
      )}

      {/* Slide Carousel render */}
      <AnimatePresence mode="wait">
        {currentItem?.type === "product" && (
          <ProductSlide 
            key={currentItem.id} 
            product={currentItem.data} 
            index={currentIndex}
            total={playlist.length}
          />
        )}
        {currentItem?.type === "drinks" && (
          <DrinkSlide 
            key={currentItem.id} 
            index={currentIndex}
            total={playlist.length}
          />
        )}
        {currentItem?.type === "grid" && (
          <GridSlide 
            key={currentItem.id} 
            index={currentIndex}
            total={playlist.length}
          />
        )}
        {currentItem?.type === "desserts" && (
          <DessertSlide
            key={currentItem.id}
            index={currentIndex}
            total={playlist.length}
          />
        )}
        {currentItem?.type === "salads" && (
          <SaladSlide
            key={currentItem.id}
            index={currentIndex}
            total={playlist.length}
          />
        )}
        {currentItem?.type === "video" && (
          <VideoSlide
            key={`${currentItem.id}-${currentIndex}`} // Forces hard remount each loop
            url={currentItem.url}
            isPaused={isPaused}
            startAt={config.splitVideoChunks ? videoProgress : 0}
            maxDuration={config.splitVideoChunks ? config.videoChunkDuration : undefined}
            onProgressUpdate={config.splitVideoChunks ? setVideoProgress : undefined}
            onComplete={nextSlide}
          />
        )}
      </AnimatePresence>

      {/* Global Pause Frame overlay state */}
      <AnimatePresence>
        {isPaused && currentItem?.type !== "video" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-6 z-50 bg-black/85 border border-red-600/30 text-white px-4 py-2 text-xs font-mono tracking-widest uppercase flex items-center gap-2.5 rounded-sm shadow-xl"
          >
            <Pause className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="font-bold">Rotation Paused</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
