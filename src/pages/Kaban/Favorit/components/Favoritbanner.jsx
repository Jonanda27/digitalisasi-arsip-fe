import { motion } from "framer-motion";
import { HiHeart } from "react-icons/hi";

export default function FavoriteBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[#1D4EA8] via-[#2563EB] to-[#3B82F6] rounded-[2rem] p-5 md:p-8 text-white shadow-xl relative overflow-hidden"
    >
      {/* Container Utama */}
      <div className="relative z-10 flex items-center gap-4 md:gap-6">
        
        {/* Ikon: Dibuat lebih menonjol dengan efek glow soft */}
        <div className="shrink-0 p-3.5 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/10 shadow-inner">
          <HiHeart className="text-3xl md:text-4xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        </div>

        {/* Text Area: Menghilangkan kesan kosong dengan line-height yang pas */}
        <div className="flex flex-col">
          <h1 className="text-lg md:text-2xl font-black tracking-tight leading-tight">
            Koleksi Favorit
          </h1>
          <p className="text-[11px] md:text-sm text-blue-100/90 leading-snug mt-0.5 max-w-[180px] md:max-w-none font-medium">
            Simpan dan akses kembali dokumen penting Anda dalam satu tempat.
          </p>
        </div>
      </div>
      
      {/* --- Elemen Dekoratif agar tidak "Kosong" --- */}
      
      {/* Lingkaran abstrak di pojok kanan (Hanya Mobile) */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl md:hidden" />
      
      {/* Cahaya Gradient di pojok kanan atas */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-300/20 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
      
      {/* Pattern Titik-titik (Dot Pattern) untuk mengisi tekstur */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden sm:block">
        <svg width="60" height="60" viewBox="0 0 20 20" fill="currentColor">
          <rect width="1" height="1" x="2" y="2"/><rect width="1" height="1" x="6" y="2"/><rect width="1" height="1" x="10" y="2"/>
          <rect width="1" height="1" x="2" y="6"/><rect width="1" height="1" x="6" y="6"/><rect width="1" height="1" x="10" y="6"/>
          <rect width="1" height="1" x="2" y="10"/><rect width="1" height="1" x="6" y="10"/><rect width="1" height="1" x="10" y="10"/>
        </svg>
      </div>

    </motion.div>
  );
}