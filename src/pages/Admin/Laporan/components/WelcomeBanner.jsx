import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi"; // Menggunakan ikon yang senada

export default function WelcomeBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      // Gradien dan ukuran tetap dipertahankan sesuai permintaan
      className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden"
    >
      <div className="relative z-10 flex items-center gap-5">
        {/* Kotak Ikon tetap p-3, rounded-2xl */}
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
          <HiOutlineSparkles className="text-3xl text-white" />
        </div>

        <div className="min-w-0">
          {/* Judul diubah menjadi LAPORAN REKAP ARSIP dengan format uppercase agar konsisten */}
          <h1 className="text-2xl font-black tracking-tight truncate uppercase">
            LAPORAN REKAP ARSIP
          </h1>
          {/* Deskripsi tetap text-sm */}
          <p className="text-blue-100 text-sm leading-tight">
            Pantau ringkasan aktivitas arsip dan statistik sistem Anda hari ini.
          </p>
        </div>
      </div>
      
      {/* Efek Cahaya Dekoratif tetap di posisi semula */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 blur-[50px] -ml-10 -mb-10" />
    </motion.div>
  );
}