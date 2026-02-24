import { motion } from "framer-motion";
import { HiOutlineFingerPrint } from "react-icons/hi2"; // Menggunakan hi2 untuk konsistensi

export default function LogBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 text-white shadow-xl relative overflow-hidden mb-8"
    >
      {/* Container Utama */}
      <div className="relative z-10 flex items-center gap-4 md:gap-6">
        
        {/* Ikon: Glassmorphism & Glow Effect */}
        <div className="shrink-0 p-3.5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/5 shadow-inner">
          <HiOutlineFingerPrint className="text-3xl md:text-4xl text-slate-200 drop-shadow-[0_0_8px_rgba(226,232,240,0.4)]" />
        </div>

        {/* Text Area */}
        <div className="flex flex-col">
          <h1 className="text-lg md:text-2xl font-black tracking-tight leading-tight uppercase">
            Log Aktivitas
          </h1>
          <p className="text-[11px] md:text-sm text-slate-400 leading-snug mt-0.5 max-w-[200px] md:max-w-none font-medium">
            Rekaman jejak digital dan audit sistem Anda secara real-time untuk transparansi data.
          </p>
        </div>
      </div>
      
      {/* --- Elemen Dekoratif --- */}
      
      {/* Cahaya di pojok kanan atas (Biru Audit) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -mr-20 -mt-20 pointer-events-none" />
      
      {/* Cahaya di pojok kiri bawah (Emerald Audit) */}
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 blur-[60px] -ml-20 -mb-20 pointer-events-none" />

      {/* Dot Pattern (Tekstur Audit Trail) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden sm:block">
        <svg width="80" height="80" viewBox="0 0 20 20" fill="white">
          <rect width="1.2" height="1.2" x="2" y="2"/><rect width="1.2" height="1.2" x="7" y="2"/><rect width="1.2" height="1.2" x="12" y="2"/>
          <rect width="1.2" height="1.2" x="2" y="7"/><rect width="1.2" height="1.2" x="7" y="7"/><rect width="1.2" height="1.2" x="12" y="7"/>
          <rect width="1.2" height="1.2" x="2" y="12"/><rect width="1.2" height="1.2" x="7" y="12"/><rect width="1.2" height="1.2" x="12" y="12"/>
        </svg>
      </div>

      {/* Aksen Garis Halus Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Aksen Garis Top (Mirroring) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
    </motion.div>
  );
}