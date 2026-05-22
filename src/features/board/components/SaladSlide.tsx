import { motion } from "motion/react";
import { SALAD_PRODUCTS } from "../data/products";

interface SaladSlideProps {
  index: number;
  total: number;
}

export function SaladSlide({ index, total }: SaladSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full bg-[#030504] text-[#F5F5F0] flex flex-col p-6 md:p-16 select-none overflow-hidden"
    >
      {/* Editorial Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-emerald-950/30 pb-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[2px] w-8 bg-emerald-600"></div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-emerald-500 font-bold font-sans">
              Green &amp; Fresh
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif italic text-white font-semibold">
            Garden Bowls &amp; Greens
          </h2>
        </div>
        <p className="text-xs text-emerald-300/40 font-light mt-2 md:mt-0 tracking-wider font-mono">
          LOCALLY SOURCED • ORGANIC VEG
        </p>
      </div>

      {/* Columns Salads Display (since they are 2, let's span beautifully or build a double-column showcase) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1 max-w-5xl mx-auto w-full items-center">
        {SALAD_PRODUCTS.map((salad, i) => {
          const priceParts = salad.price.split(".");
          const priceWhole = priceParts[0] || "$0";
          const priceCents = priceParts[1] ? `.${priceParts[1]}` : ".00";

          return (
            <motion.div
              key={salad.id}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i + 0.3, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col h-full md:max-h-[85%] bg-[#060807] border border-emerald-950/10 hover:border-emerald-600/30 transition-colors duration-500 rounded-sm overflow-hidden group"
            >
              {/* Product Image Frame */}
              <div className="relative h-48 md:h-56 lg:h-64 w-full overflow-hidden flex-shrink-0">
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${salad.imageUrl})` }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060807] to-transparent opacity-60" />
              </div>

              {/* Product Details info Card */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                    {salad.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light line-clamp-3 mt-2 leading-relaxed">
                    {salad.description}
                  </p>
                </div>

                <div className="flex items-baseline pt-2">
                  <span className="text-3xl font-mono tracking-tight text-white">{priceWhole}</span>
                  <span className="text-sm font-mono text-emerald-500 font-semibold">{priceCents}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slide Indicators Navigation Footer */}
      <div className="absolute bottom-10 right-16 hidden md:flex items-center gap-6 z-20">
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

      {/* Live Signage Indicator Tag */}
      <div className="absolute top-0 right-0 bg-red-600 text-white font-sans px-5 py-2 text-[10px] uppercase font-black tracking-widest leading-none shadow-lg z-20 select-none rounded-bl-sm">
        Live Feed Mode
      </div>
    </motion.div>
  );
}
