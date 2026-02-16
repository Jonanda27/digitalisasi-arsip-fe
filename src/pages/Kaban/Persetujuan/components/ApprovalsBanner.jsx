import { motion } from "framer-motion";
import { HiOutlineShieldCheck } from "react-icons/hi";

export default function ApprovalsBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      // Warna dan ukuran identik dengan FavoriteBanner
      className="bg-gradient-to-r from-[#1D4EA8] to-[#2563EB] rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden mb-8"
    >
      <div className="relative z-10 flex items-center gap-5">
        {/* Kotak ikon disesuaikan ukurannya */}
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
          <HiOutlineShieldCheck className="text-3xl text-white" />
        </div>
        <div>
          {/* Tipografi disesuaikan konsistensinya */}
          <h1 className="text-2xl font-black tracking-tight">Persetujuan Akses</h1>
          <p className="text-blue-100 text-sm font-medium">Kelola permintaan izin akses dokumen secara efisien.</p>
        </div>
      </div>
      
      {/* Efek Cahaya Dekoratif - identik di pojok kanan atas */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-20 -mt-20" />
    </motion.div>
  );
}