import { motion } from "framer-motion";
import { HiOutlineShieldCheck } from "react-icons/hi2";

export default function ApprovalsBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      // Mempertahankan warna asli: Blue Gradient
      className="bg-gradient-to-br from-[#1D4EA8] to-[#2563EB] rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 text-white shadow-xl relative overflow-hidden mb-8"
    >
      <div className="relative z-10 flex items-center gap-4 md:gap-6">
        {/* Ikon tetap Putih dengan backdrop blur */}
        <div className="shrink-0 p-3.5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-inner">
          <HiOutlineShieldCheck className="text-3xl md:text-4xl text-white" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-lg md:text-2xl font-black tracking-tight uppercase">
            Persetujuan Akses
          </h1>
          <p className="text-[11px] md:text-sm text-blue-100 leading-snug mt-0.5 font-medium">
            {/* Teks Ringkas khusus Mobile */}
            <span className="md:hidden">Kelola izin dokumen secara efisien dan aman.</span>
            
            {/* Teks Lengkap khusus iPad/Laptop */}
            <span className="hidden md:inline">
              Kelola dan audit permintaan izin akses dokumen sistem Anda secara efisien untuk keamanan data.
            </span>
          </p>
        </div>
      </div>
      
      {/* Efek Cahaya Dekoratif Putih/Biru Muda */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 blur-[50px] -ml-10 -mb-10 pointer-events-none" />
    </motion.div>
  );
}