import { motion } from "framer-motion";
import { HiOutlineFingerPrint } from "react-icons/hi";

export default function LogBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden mb-8"
    >
      <div className="relative z-10 flex items-center gap-5">
        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
          <HiOutlineFingerPrint className="text-3xl text-slate-200" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Log Aktivitas</h1>
          <p className="text-slate-400 text-sm font-medium">Rekaman jejak digital dan audit sistem Anda secara real-time.</p>
        </div>
      </div>
      
      {/* Dekorasi audit trail */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -mr-20 -mt-20" />
      <div className="absolute bottom-0 right-20 w-32 h-32 bg-emerald-500/10 blur-[50px]" />
    </motion.div>
  );
}