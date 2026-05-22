import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp, ArrowDown, Check, Video } from "lucide-react";
import { boardConfigSchema, type BoardConfig, AVAILABLE_SLIDES } from "../schemas/config";

interface ConfigScreenProps {
  onStart: (config: BoardConfig) => void;
}

export function ConfigScreen({ onStart }: ConfigScreenProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Omit<BoardConfig, "playlistOrder" | "enabledSlides">>({
    resolver: zodResolver(boardConfigSchema.pick({ slideDuration: true, youtubeUrl: true })),
    defaultValues: {
      slideDuration: 6,
      youtubeUrl: "",
    },
  });

  const [playlistOrder, setPlaylistOrder] = useState<string[]>(
    AVAILABLE_SLIDES.map((s) => s.id)
  );
  
  const [enabledSlides, setEnabledSlides] = useState<Record<string, boolean>>(
    AVAILABLE_SLIDES.reduce((acc, s) => ({ ...acc, [s.id]: s.id !== "video" }), {})
  );

  const youtubeUrlValue = watch("youtubeUrl");

  // Dynamic automatic enabling of video slide if youtubeUrl starts to look valid
  const hasVideoUrl = !!(youtubeUrlValue && youtubeUrlValue.includes("youtube.com") || youtubeUrlValue?.includes("youtu.be"));

  const toggleSlide = (id: string) => {
    setEnabledSlides((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const moveSlide = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === playlistOrder.length - 1) return;

    const newOrder = [...playlistOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setPlaylistOrder(newOrder);
  };

  const onSubmit = (data: any) => {
    // If user has video url inside data but video slide is disabled, we warn or force enable it
    let finalEnabled = { ...enabledSlides };
    if (hasVideoUrl) {
      finalEnabled.video = true;
    }

    onStart({
      slideDuration: data.slideDuration,
      youtubeUrl: data.youtubeUrl,
      playlistOrder: playlistOrder,
      enabledSlides: finalEnabled,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* CONFIGURATION PANEL (SIDEBAR) */}
      <aside className="w-full lg:w-[420px] min-h-screen lg:h-screen bg-[#111] border-r border-[#222] p-6 md:p-8 flex flex-col justify-between z-20 shadow-2xl overflow-y-auto shrink-0 select-none">
        <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-between gap-8">
          <div>
            {/* Red Light Signage Status */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-red-500 font-sans">
                Signage Pipeline Config
              </h2>
            </div>

            <div className="space-y-6">
              {/* Slide Duration Input */}
              <div className="space-y-2">
                <label htmlFor="slideDuration" className="block text-[10px] uppercase tracking-widest text-[#999] font-bold">
                  Slide Transition Duration (Seconds)
                </label>
                <input
                  id="slideDuration"
                  type="number"
                  {...register("slideDuration", { valueAsNumber: true })}
                  className="w-full bg-black border border-[#2a2a2a] px-4 py-2.5 text-lg text-white font-mono outline-none focus:border-red-600 transition-colors"
                  placeholder="5"
                />
                {errors.slideDuration && (
                  <p className="text-red-500 text-xs font-mono">{errors.slideDuration.message}</p>
                )}
              </div>

              {/* YouTube Background / Interstitial Input */}
              <div className="space-y-2">
                <label htmlFor="youtubeUrl" className="block text-[10px] uppercase tracking-widest text-[#999] font-bold">
                  YouTube Live / Video Interstitial URL
                </label>
                <input
                  id="youtubeUrl"
                  type="url"
                  {...register("youtubeUrl")}
                  className="w-full bg-black border border-[#2a2a2a] p-3 text-xs text-white outline-none focus:border-red-600 transition-colors placeholder-zinc-700 font-mono"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {errors.youtubeUrl && (
                  <p className="text-red-500 text-xs font-mono">{errors.youtubeUrl.message}</p>
                )}
                <p className="text-[10px] italic opacity-40 leading-relaxed">
                  Tip: Supports full videos or 24/7 stream feeds. Unmute toggle available in layout.
                </p>
              </div>

              {/* Dynamic Playlist Sequence Customizer */}
              <div className="space-y-3 pt-2">
                <label className="block text-[10px] uppercase tracking-widest text-[#999] font-bold">
                  Drag &amp; Arrange Cycle Order
                </label>
                
                <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                  {playlistOrder.map((slideId, index) => {
                    const slideMeta = AVAILABLE_SLIDES.find((s) => s.id === slideId);
                    if (!slideMeta) return null;

                    const isEnabled = enabledSlides[slideId];
                    const isVideo = slideId === "video";
                    
                    // Force display option info
                    const showWarning = isVideo && !hasVideoUrl && isEnabled;

                    return (
                      <div 
                        key={slideId} 
                        className={`flex items-center justify-between p-2.5 border transition-all ${
                          isEnabled 
                            ? "bg-black border-[#262626] text-white" 
                            : "bg-[#161616]/40 border-transparent text-zinc-600"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Toggle Active Switch */}
                          <button
                            type="button"
                            onClick={() => toggleSlide(slideId)}
                            className={`w-5 h-5 rounded-sm border cursor-pointer flex items-center justify-center transition-all ${
                              isEnabled 
                                ? "bg-red-600 border-red-700 text-white" 
                                : "bg-transparent border-[#333]"
                            }`}
                          >
                            {isEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium truncate">
                              {slideMeta.label}
                            </span>
                            {showWarning && (
                              <span className="text-[9px] text-amber-500/70 font-sans italic leading-none mt-0.5">
                                *Needs YouTube URL to show
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveSlide(index, "up")}
                            className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === playlistOrder.length - 1}
                            onClick={() => moveSlide(index, "down")}
                            className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* LAUNCH CONTROLLERS */}
          <div className="space-y-4 pt-4 border-t border-[#222]">
            <button
              type="submit"
              className="w-full bg-white text-black py-3 px-4 font-bold uppercase text-[11px] tracking-[0.25em] hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-lg outline-none active:scale-[0.98]"
            >
              Launch Signage Stream
            </button>
            <p className="text-[10px] text-center text-zinc-500 font-mono italic">
              Press <kbd className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800 mx-1">Esc</kbd> anytime during play to return here.
            </p>
          </div>
        </form>
      </aside>

      {/* LIVE PREVIEW AREA (RESTAURANT TV VIEW) / RIGHT DECORATIVE COLUMN */}
      <main className="relative flex-1 hidden lg:flex flex-col justify-center h-screen bg-[#050505] overflow-hidden select-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-45 grayscale-[15%]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>

        <div className="relative h-full flex flex-col justify-center px-16 max-w-3xl z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-red-600"></div>
            <span className="text-[11px] uppercase tracking-[0.4em] text-red-600 font-bold leading-none">
              Chef&apos;s Recommendation
            </span>
          </div>

          <h1 className="text-7xl xl:text-[92px] font-serif leading-[0.98] italic font-black text-white drop-shadow-2xl mb-6">
            Prime<br/>Smoked<br/>Brisket
          </h1>

          <p className="max-w-md text-base leading-relaxed text-[#CCC] font-light border-l border-red-600 pl-6 mb-8">
            12-hour slow-cooked black angus beef, served with toasted sourdough and house-made bourbon barbecue reduction.
          </p>

          <div className="flex items-baseline gap-1">
            <span className="text-6xl xl:text-[76px] font-mono tracking-tighter text-white font-medium">$34</span>
            <span className="text-3xl font-mono text-red-600 font-bold">.90</span>
          </div>
        </div>

        <div className="absolute top-10 right-10 flex flex-col items-end z-20">
          <div className="text-[8px] uppercase tracking-[0.55em] mb-4 opacity-50 [writing-mode:vertical-rl] font-medium font-sans">
            Est. 1982 — Culinary Arts
          </div>
          <div className="w-[1px] h-32 bg-white/20"></div>
        </div>

        <div className="absolute bottom-10 right-16 flex items-center gap-6 z-20">
          <div className="flex gap-2">
            <div className="w-12 h-[2px] bg-red-600 w-16"></div>
            <div className="w-12 h-[2px] bg-white/20"></div>
            <div className="w-12 h-[2px] bg-white/20"></div>
          </div>
          <span className="font-mono text-xs opacity-50 italic">01 / 03</span>
        </div>

        <div className="absolute top-0 right-0 bg-red-600 text-white font-bold px-4 py-2 text-[10px] uppercase tracking-widest leading-none shadow-lg z-20">
          Signage Live Preview
        </div>
      </main>

    </div>
  );
}
