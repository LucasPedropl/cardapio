import { motion } from "motion/react";
import { DRINK_PRODUCTS } from "../data/products";

interface DrinkSlideProps {
  index: number;
  total: number;
}

export function DrinkSlide({ index, total }: DrinkSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full bg-[#050505] text-[#F5F5F0] flex flex-col p-6 md:p-16 select-none overflow-hidden"
    >
      {/* Editorial Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[2px] w-8 bg-red-600"></div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-red-600 font-bold font-sans">
              Liquid Refreshments
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif italic text-white font-semibold">
            Signature House Drinks
          </h2>
        </div>
        <p className="text-xs text-zinc-400 font-light mt-2 md:mt-0 tracking-wider">
          ARTISANAL BREWS • FRESHLY CONCOCTED EVERY MORNING
        </p>
      </div>

      {/* 3 Columns Drinks Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
        {DRINK_PRODUCTS.map((drink, i) => {
          const priceParts = drink.price.split(".");
          const priceWhole = priceParts[0] || "$0";
          const priceCents = priceParts[1] ? `.${priceParts[1]}` : ".00";

          return (
            <motion.div
              key={drink.id}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i + 0.3, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col h-full bg-[#0c0c0c] border border-white/5 hover:border-red-600/30 transition-colors duration-500 rounded-sm overflow-hidden group"
            >
              {/* Product Image Frame */}
              <div className="relative h-48 md:h-64 w-full overflow-hidden flex-shrink-0">
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${drink.imageUrl})` }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent opacity-60" />
              </div>

              {/* Product Details info Card */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white group-hover:text-red-500 transition-colors duration-300">
                    {drink.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light line-clamp-3 mt-2 leading-relaxed">
                    {drink.description}
                  </p>
                </div>

                <div className="flex items-baseline pt-2">
                  <span className="text-3xl font-mono tracking-tight text-white">{priceWhole}</span>
                  <span className="text-sm font-mono text-red-600 font-semibold">{priceCents}</span>
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
