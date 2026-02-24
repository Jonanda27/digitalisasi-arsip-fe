import { motion } from "framer-motion";
import { HiOutlineShieldCheck } from "react-icons/hi"; 

export default function WelcomeBanner({ userName = "Admin" }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden"
    >
      <div className="relative z-10 flex items-center gap-4 md:gap-6">
        {/* Ikon dengan Glassmorphism */}
        <div className="p-3.5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shrink-0 shadow-inner">
          <HiOutlineShieldCheck className="text-3xl md:text-4xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
        </div>

        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-black tracking-tight uppercase leading-tight">
            Manajemen Akun
          </h1>
          
          <div className="mt-1">
            {/* Teks Pendek Mobile */}
            <p className="md:hidden text-[11px] text-blue-100 font-medium opacity-90 leading-relaxed">
              Kelola akses dan hak dekripsi personil secara real-time.
            </p>
            
            {/* Teks Lengkap iPad/Laptop */}
            <p className="hidden md:block text-sm text-blue-50 font-medium opacity-80 max-w-xl">
              Kelola seluruh akses pengguna, penempatan bidang, dan atur hak dekripsi dokumen dalam ekosistem sistem kearsipan digital Anda.
            </p>
          </div>
        </div>
      </div>
      
      {/* Dekorasi Ornamen Modern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 blur-[60px] -ml-20 -mb-20 pointer-events-none" />
      
      {/* Aksen Garis Halus */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  );
}