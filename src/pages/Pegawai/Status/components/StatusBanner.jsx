import { motion } from "framer-motion";
import { HiOutlineClock } from "react-icons/hi";

export default function StatusBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#1D4EA8] to-[#2563EB] rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden"
    >
      <div className="relative z-10 flex items-center gap-5">
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
          <HiOutlineClock className="text-3xl text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Riwayat Permintaan</h1>
          <p className="text-blue-100 text-sm">Pantau status persetujuan akses dokumen rahasia Anda.</p>
        </div>
      </div>
      
      {/* Efek Cahaya Dekoratif */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-20 -mt-20" />
    </motion.div>
  );
}