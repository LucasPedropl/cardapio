import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boardConfigSchema, type BoardConfig } from "../schemas/config";

interface ConfigScreenProps {
  onStart: (config: BoardConfig) => void;
}

export function ConfigScreen({ onStart }: ConfigScreenProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardConfig>({
    resolver: zodResolver(boardConfigSchema),
    defaultValues: {
      slideDuration: 5,
      youtubeUrl: "",
    },
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* CONFIGURATION PANEL (SIDEBAR) */}
      <aside className="w-full lg:w-96 min-h-screen lg:h-screen bg-[#141414] border-r border-[#262626] p-8 md:p-10 flex flex-col justify-between z-20 shadow-2xl overflow-y-auto">
        <form onSubmit={handleSubmit(onStart)} className="h-full flex flex-col justify-between gap-10">
          <div>
            {/* System Status Indicators */}
            <div className="flex items-center gap-2 mb-10">
              <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold opacity-60">
                Signage System Configuration
              </h2>
            </div>

            <div className="space-y-8">
              {/* Slide Duration Input */}
              <div className="space-y-3">
                <label htmlFor="slideDuration" className="block text-[10px] uppercase tracking-widest text-[#999] font-medium">
                  Slide Transition (Seconds)
                </label>
                <input
                  id="slideDuration"
                  type="number"
                  {...register("slideDuration", { valueAsNumber: true })}
                  className="w-full bg-black border border-[#2a2a2a] px-4 py-3 text-lg text-white font-mono outline-none focus:border-red-600 transition-colors"
                  placeholder="5"
                />
                {errors.slideDuration && (
                  <p className="text-red-500 text-xs font-mono">{errors.slideDuration.message}</p>
                )}
              </div>

              {/* YouTube Background / Interstitial Input */}
              <div className="space-y-3">
                <label htmlFor="youtubeUrl" className="block text-[10px] uppercase tracking-widest text-[#999] font-medium">
                  YouTube Background / Interstitial URL
                </label>
                <input
                  id="youtubeUrl"
                  type="url"
                  {...register("youtubeUrl")}
                  className="w-full bg-black border border-[#2a2a2a] px-4 py-3 text-sm text-white outline-none focus:border-red-600 transition-colors placeholder-zinc-700"
                  placeholder="https://youtube.com/watch?v=..."
                />
                {errors.youtubeUrl && (
                  <p className="text-red-500 text-xs font-mono">{errors.youtubeUrl.message}</p>
                )}
                <p className="text-[10px] italic opacity-40 leading-relaxed font-sans mt-1">
                  Optional: Plays in full-screen as an interstitial layout between product slides.
                </p>
              </div>

              {/* Active Playlist Sneak Peek */}
              <div className="space-y-3 pt-2">
                <label className="block text-[10px] uppercase tracking-widest text-[#999] font-medium">
                  Active Display Pipeline
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-black border border-[#262626] text-xs">
                    <div className="w-8 h-8 bg-[#222] bg-[url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=80')] bg-cover bg-center flex-shrink-0 border border-zinc-800"></div>
                    <div className="flex flex-col">
                      <span className="font-medium text-white">Artisan Double Smash</span>
                      <span className="text-[9px] opacity-40 font-mono">$11.99</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-black border border-[#262626] text-xs">
                    <div className="w-8 h-8 bg-[#222] bg-[url('https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=100&q=80')] bg-cover bg-center flex-shrink-0 border border-zinc-800"></div>
                    <div className="flex flex-col">
                      <span className="font-medium text-white opacity-60">Spicy Crispy Chicken</span>
                      <span className="text-[9px] opacity-35 font-mono">$9.49</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-white text-black py-4 font-bold uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-lg outline-none"
            >
              Launch Live Feed
            </button>
            <p className="text-[10px] text-center text-zinc-500 font-mono italic">
              Press <kbd className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800 mx-1">Esc</kbd> anytime during playback to re-configure.
            </p>
          </div>
        </form>
      </aside>

      {/* LIVE PREVIEW AREA (RESTAURANT TV VIEW) / RIGHT DECORATIVE COLUMN */}
      <main className="relative flex-1 hidden lg:flex flex-col justify-center h-screen bg-[#050505] overflow-hidden select-none">
        
        {/* Background Image of a prime BBQ with Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-45 grayscale-[15%]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>

        {/* Content Teaser Mock */}
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

        {/* Vertical Custom Metadata Overlay */}
        <div className="absolute top-10 right-10 flex flex-col items-end z-20">
          <div className="text-[8px] uppercase tracking-[0.55em] mb-4 opacity-50 [writing-mode:vertical-rl] font-medium font-sans">
            Est. 1982 — Culinary Arts
          </div>
          <div className="w-[1px] h-32 bg-white/20"></div>
        </div>

        {/* Slide Indicators Teaser */}
        <div className="absolute bottom-10 right-16 flex items-center gap-6 z-20">
          <div className="flex gap-2">
            <div className="w-12 h-[2px] bg-red-600 w-16"></div>
            <div className="w-12 h-[2px] bg-white/20"></div>
            <div className="w-12 h-[2px] bg-white/20"></div>
          </div>
          <span className="font-mono text-xs opacity-50 italic">01 / 03</span>
        </div>

        {/* Live Indicator on Top Right */}
        <div className="absolute top-0 right-0 bg-red-600 text-white font-bold px-4 py-2 text-[10px] uppercase tracking-widest leading-none shadow-lg z-20">
          Signage Live Preview
        </div>
      </main>

    </div>
  );
}

