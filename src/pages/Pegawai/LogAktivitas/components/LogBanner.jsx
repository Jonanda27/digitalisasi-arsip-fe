import { motion } from "framer-motion";
import { HiOutlineFingerPrint } from "react-icons/hi2";

export default function LogBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 text-white shadow-xl relative overflow-hidden mb-8"
    >
      <div className="relative z-10 flex items-center gap-4 md:gap-6">
        <div className="shrink-0 p-3.5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/5 shadow-inner">
          <HiOutlineFingerPrint className="text-3xl md:text-4xl text-slate-200" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-lg md:text-2xl font-black tracking-tight uppercase">
            Log Aktivitas
          </h1>
          <p className="text-[11px] md:text-sm text-slate-400 leading-snug mt-0.5 font-medium">
            {/* Teks Ringkas khusus Mobile */}
            <span className="md:hidden">Rekaman jejak digital sistem secara real-time.</span>
            {/* Teks Lengkap khusus iPad/Laptop */}
            <span className="hidden md:inline">
              Rekaman jejak digital dan audit sistem Anda secara real-time untuk transparansi data.
            </span>
          </p>
        </div>
      </div>
      
      {/* Decorative Lights */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -mr-20 -mt-20 pointer-events-none" />
    </motion.div>
  );
}