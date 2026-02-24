import { motion } from "framer-motion";
import { HiOutlineShieldCheck, HiOutlineDatabase } from "react-icons/hi";
import arsipBg from "../../../../assets/arsip.png";

export default function WelcomeBannerArsip() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      // Padding: p-4 (Mobile), md:p-6 (iPad), lg:p-8 (Laptop)
      className="relative overflow-hidden rounded-b-2xl md:rounded-b-[2.5rem] bg-[#163a7a] p-4 md:p-6 lg:p-8 text-white shadow-xl shadow-blue-900/30"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={arsipBg} 
          alt="background" 
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#163a7a]/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#163a7a] via-transparent to-transparent opacity-60" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Sisi Kiri: Branding & Judul */}
        <div className="flex flex-row items-center gap-3 md:gap-5">
          {/* Icon Box: h-10 (Mobile), h-14 (iPad), h-20 (Laptop) */}
          <div className="flex h-10 w-10 md:h-14 md:w-14 lg:h-20 lg:w-20 shrink-0 items-center justify-center rounded-xl md:rounded-2xl lg:rounded-3xl bg-blue-600 shadow-lg transition-all">
            <HiOutlineDatabase className="text-xl md:text-2xl lg:text-4xl text-white" />
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-lg md:text-2xl lg:text-4xl font-black tracking-tight text-white uppercase leading-tight">
              Repositori <span className="md:block lg:inline text-blue-300">Arsip Digital</span>
            </h2>
            
            {/* Deskripsi: Hilang di mobile, muncul di iPad (md) dengan text kecil, normal di Laptop (lg) */}
            <p className="hidden md:block lg:block text-[10px] lg:text-sm text-blue-100/90 font-medium max-w-xs lg:max-w-md mt-1 lg:mt-2 leading-relaxed line-clamp-1 lg:line-clamp-none">
              Kelola, amankan, dan telusuri dokumen perusahaan dalam satu platform.
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Status Sistem - Muncul di iPad & Laptop dengan ukuran adaptif */}
        <div className="hidden md:flex items-center gap-3 bg-blue-800/40 backdrop-blur-md border border-blue-700/50 px-3 py-2 lg:px-5 lg:py-3 rounded-2xl lg:rounded-[1.5rem] shadow-md">
          <div className="p-1.5 lg:p-2 bg-blue-500 rounded-lg lg:rounded-xl text-white">
            <HiOutlineShieldCheck className="w-4 h-4 lg:w-5 lg:h-5" />
          </div>
          <div className="leading-tight">
            <p className="text-[8px] lg:text-[10px] font-black text-blue-200 uppercase tracking-tighter mb-0.5">Status Sistem</p>
            <p className="text-[10px] lg:text-xs font-bold text-white uppercase">Terproteksi</p>
          </div>
        </div>
      </div>

      {/* Footer Bar: Hanya muncul di laptop (lg) untuk menjaga kebersihan layout iPad/Mobile */}
      <div className="hidden lg:flex relative z-10 mt-10 pt-6 border-t border-white/10 items-center gap-3">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-6 rounded-full border-2 border-blue-800 bg-blue-500 flex items-center justify-center text-[8px] font-bold">
              {i}
            </div>
          ))}
        </div>
        <p className="text-[11px] font-medium text-blue-50/80 italic">
          "Gunakan fitur grid view untuk pratinjau dokumen secara instan."
        </p>
      </div>
    </motion.div>
  );
}