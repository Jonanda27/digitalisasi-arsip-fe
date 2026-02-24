import { motion } from "framer-motion";
import { HiOutlineClock } from "react-icons/hi2"; // Menggunakan versi hi2 untuk konsistensi icon

export default function StatusBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[#1D4EA8] via-[#2563EB] to-[#3B82F6] rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 text-white shadow-xl relative overflow-hidden"
    >
      {/* Container Utama */}
      <div className="relative z-10 flex items-center gap-4 md:gap-6">
        
        {/* Ikon: Menonjol dengan Glassmorphism & Glow */}
        <div className="shrink-0 p-3.5 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/10 shadow-inner">
          <HiOutlineClock className="text-3xl md:text-4xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        </div>

        {/* Text Area */}
        <div className="flex flex-col">
          <h1 className="text-lg md:text-2xl font-black tracking-tight leading-tight uppercase">
            Status Permintaan
          </h1>
          <p className="text-[11px] md:text-sm text-blue-100/90 leading-snug mt-0.5 max-w-[200px] md:max-w-none font-medium">
            Pantau status persetujuan dan masa aktif akses dokumen rahasia Anda secara real-time.
          </p>
        </div>
      </div>
      
      {/* --- Elemen Dekoratif --- */}
      
      {/* Cahaya di pojok kanan atas */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-300/20 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
      
      {/* Lingkaran abstrak (Hanya Mobile) */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl md:hidden" />
      
      {/* Dot Pattern untuk tekstur (Hanya Desktop/Tablet) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none hidden sm:block">
        <svg width="80" height="80" viewBox="0 0 20 20" fill="white">
          <rect width="1.5" height="1.5" x="2" y="2"/><rect width="1.5" height="1.5" x="7" y="2"/><rect width="1.5" height="1.5" x="12" y="2"/>
          <rect width="1.5" height="1.5" x="2" y="7"/><rect width="1.5" height="1.5" x="7" y="7"/><rect width="1.5" height="1.5" x="12" y="7"/>
          <rect width="1.5" height="1.5" x="2" y="12"/><rect width="1.5" height="1.5" x="7" y="12"/><rect width="1.5" height="1.5" x="12" y="12"/>
        </svg>
      </div>

      {/* Aksen Garis Halus */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.div>
  );
}