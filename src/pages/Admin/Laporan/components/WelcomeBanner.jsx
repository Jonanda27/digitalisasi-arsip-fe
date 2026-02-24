import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi";

export default function WelcomeBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 text-white shadow-xl relative overflow-hidden"
    >
      <div className="relative z-10 flex items-center gap-4 md:gap-6">
        <div className="p-3 bg-white/20 backdrop-blur-lg rounded-xl md:rounded-2xl shrink-0 border border-white/20">
          <HiOutlineSparkles className="text-2xl md:text-4xl text-white" />
        </div>

        <div className="min-w-0">
          <h1 className="text-lg md:text-3xl font-black tracking-tight uppercase">
            Rekap Laporan
          </h1>
          <p className="text-blue-100 text-[10px] md:text-sm font-medium opacity-80 leading-snug">
            Pantau aktivitas arsip dan statistik sistem secara real-time hari ini.
          </p>
        </div>
      </div>
      
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 blur-[50px] md:blur-[100px] -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-400/20 blur-[40px] -ml-5 -mb-5" />
    </motion.div>
  );
}