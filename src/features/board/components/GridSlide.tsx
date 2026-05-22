import { motion } from "motion/react";
import { GRID_PRODUCTS } from "../data/products";

interface GridSlideProps {
  index: number;
  total: number;
}

export function GridSlide({ index, total }: GridSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full bg-[#050505] p-6 md:p-16 flex flex-col justify-between overflow-hidden select-none text-[#F5F5F0]"
    >
      <div>
        {/* Category Header */}
        <div className="flex items-center gap-4 mb-2">
          <div className="h-[1px] w-12 bg-red-600"></div>
          <span className="text-xs uppercase tracking-[0.40em] text-red-600 font-bold font-sans">
            Complements &amp; Starters
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-5 mb-8">
          <h2 className="text-4xl md:text-5xl font-serif italic text-white font-black">
            Sides &amp; Sharable Boards
          </h2>
          <p className="text-[10px] tracking-widest uppercase opacity-40 font-mono mt-1 md:mt-0">
            HAND-CUT FRESH • SUSTAINABLE INGREDIENTS ONLY
          </p>
        </div>
      </div>

      {/* Grid containing 4 items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 items-center mt-2">
        {GRID_PRODUCTS.map((prod, i) => {
          const priceParts = prod.price.split(".");
          const priceWhole = priceParts[0] || "$0";
          const priceCents = priceParts[1] ? `.${priceParts[1]}` : ".00";

          return (
            <motion.div
              key={prod.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 * i + 0.3, duration: 0.7, ease: "easeOut" }}
              className="flex flex-col h-full bg-[#0c0c0c] border border-[#222] p-5 justify-between relative group"
            >
              {/* Box Image preview */}
              <div className="relative w-full h-36 md:h-40 overflow-hidden mb-4">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                  style={{ backgroundImage: `url(${prod.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              <div className="space-y-2 flex-grow">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-lg font-serif font-bold text-white leading-tight group-hover:text-red-500 transition-colors duration-300">
                    {prod.name}
                  </h3>
                </div>
                <p className="text-[11px] text-zinc-400 font-light leading-relaxed line-clamp-2">
                  {prod.description}
                </p>
              </div>

              {/* Price Tag with layout alignment similar to premium menus */}
              <div className="border-t border-zinc-900 pt-3 mt-4 flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">Gourmet Select</span>
                <div className="flex items-baseline font-mono">
                  <span className="text-xl text-white font-medium">{priceWhole}</span>
                  <span className="text-xs text-red-600 font-semibold">{priceCents}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-8 flex justify-between items-center">
        {/* Small Note */}
        <p className="text-[10px] text-zinc-500 italic max-w-md hidden md:block">
          *Inform our servers about any specific allergens or dietary requirements before ordering.
        </p>

        {/* Slide Counter Footer */}
        <div className="flex items-center gap-6 ml-auto z-20">
          <div className="flex gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <div 
                key={i} 
                className={`w-12 h-[2.5px] transition-all duration-700 ${
                  i === index ? "bg-red-600 w-16" : "bg-white/25"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-xs text-white/50 italic select-none">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Live Signage Indicator Tag */}
      <div className="absolute top-0 right-0 bg-red-600 text-white font-sans px-5 py-2 text-[10px] uppercase font-black tracking-widest leading-none shadow-lg z-20 select-none rounded-bl-sm">
        Live Feed Mode
      </div>
    </motion.div>
  );
}
