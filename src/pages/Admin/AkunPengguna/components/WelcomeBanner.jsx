import { motion } from "framer-motion";
// Mengganti Sparkles menjadi ShieldCheck untuk kesan keamanan akun
import { HiOutlineShieldCheck } from "react-icons/hi"; 

export default function WelcomeBanner({ userName = "Admin" }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden"
    >
      <div className="relative z-10 flex items-center gap-5">
        {/* Container Ikon */}
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
          <HiOutlineShieldCheck className="text-3xl text-white" />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight truncate uppercase">
            Akun Pengguna
          </h1>
          <p className="text-blue-100 text-sm leading-tight">
            Kelola akses pengguna dan atur hak dekripsi dokumen dalam sistem kearsipan.
          </p>
        </div>
      </div>
      
      {/* Ornamen Cahaya Dekoratif */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 blur-[50px] -ml-10 -mb-10" />
    </motion.div>
  );
}