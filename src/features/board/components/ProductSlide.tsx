import { motion } from "motion/react";
import type { Product } from "../data/products";

interface ProductSlideProps {
  product: Product;
  index: number;
  total: number;
}

export function ProductSlide({ product, index, total }: ProductSlideProps) {
  // Parse price into dollar portion and cent portion nicely
  const priceParts = product.price.split(".");
  const priceWhole = priceParts[0] || "$0";
  const priceCents = priceParts[1] ? `.${priceParts[1]}` : ".00";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full bg-[#050505] text-[#F5F5F0] overflow-hidden select-none"
    >
      {/* Background Image with Overlay and Subtle Grayscale Ken Burns Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center filter grayscale-[15%]"
          style={{ backgroundImage: `url(${product.imageUrl})` }}
          initial={{ scale: 1.08, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 8, ease: "easeOut" }}
        />
        {/* Cinematic rich black gradient for text contrast and premium depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-transparent md:via-[#050505]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
      </div>

      {/* Main Editorial Content Container */}
      <div className="relative h-full flex flex-col justify-center px-6 md:px-20 max-w-4xl z-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Chef Tag Category line */}
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-red-600"></div>
            <span className="text-xs uppercase tracking-[0.4em] text-red-600 font-bold font-sans">
              Chef&apos;s Featured Recommendation
            </span>
          </div>

          {/* Large Serif Editorial Heading */}
          <h1 className="text-5xl sm:text-7xl md:text-[90px] font-serif leading-[1.05] italic font-black text-white hover:text-red-500 transition-colors duration-500 drop-shadow-xl max-w-2xl whitespace-pre-line">
            {product.name}
          </h1>

          {/* Left Red Bordered Sleek Description */}
          <p className="max-w-xl text-base md:text-xl leading-relaxed text-zinc-300 font-light border-l border-red-600 pl-6">
            {product.description}
          </p>

          {/* Price Layout in Editorial style */}
          <div className="pt-4 flex items-baseline gap-1">
            <span className="text-6xl md:text-[80px] font-mono tracking-tighter text-white font-medium">
              {priceWhole}
            </span>
            <span className="text-3xl md:text-4xl font-mono text-red-600 font-bold">
              {priceCents}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Right Column Visual Adornments */}
      <div className="absolute top-10 right-10 hidden md:flex flex-col items-end z-20">
        <div className="text-[9px] uppercase tracking-[0.55em] mb-4 text-[#F5F5F0]/50 [writing-mode:vertical-rl] font-medium font-sans select-none">
          Est. 1982 — Culinary Arts
        </div>
        <div className="w-[1px] h-32 bg-white/20"></div>
      </div>

      {/* Elegant Bottom Progress Slide Counter */}
      <div className="absolute bottom-10 px-6 md:px-20 left-0 md:left-auto md:right-16 flex items-center justify-between md:justify-end gap-6 w-full md:w-auto z-20">
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

      {/* Live Signage Indicator */}
      <div className="absolute top-0 right-0 bg-red-600 text-white font-sans px-5 py-2 text-[10px] uppercase font-black tracking-widest leading-none shadow-lg z-20 select-none rounded-bl-sm">
        Live Feed Mode
      </div>
    </motion.div>
  );
}

