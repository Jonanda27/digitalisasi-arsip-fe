import { motion } from "framer-motion";
import { HiHeart } from "react-icons/hi";

export default function FavoriteBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      // Menggunakan p-8 (sebelumnya p-10) agar sama dengan StatusBanner
      className="bg-gradient-to-r from-[#1D4EA8] to-[#2563EB] rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden"
    >
      <div className="relative z-10 flex items-center gap-5">
        {/* Menggunakan p-3 dan rounded-2xl agar ukuran kotak ikon sama */}
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
          {/* Ikon menggunakan text-3xl agar tingginya seragam */}
          <HiHeart className="text-3xl text-white" />
        </div>
        <div>
          {/* Menggunakan text-2xl agar ukuran judul konsisten */}
          <h1 className="text-2xl font-black tracking-tight">Koleksi Favorit</h1>
          <p className="text-blue-100 text-sm">Akses cepat dokumen penting yang telah Anda tandai.</p>
        </div>
      </div>
      
      {/* Efek Cahaya Dekoratif - disamakan hanya satu di pojok kanan atas */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-20 -mt-20" />
    </motion.div>
  );
}