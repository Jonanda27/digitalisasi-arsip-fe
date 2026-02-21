import { motion } from "framer-motion";
import { HiOutlineShieldCheck, HiOutlineDatabase } from "react-icons/hi";
import arsipBg from "../../../../assets/arsip.png"; // Pastikan path file benar

export default function WelcomeBannerArsip() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-b-[2.5rem] bg-[#163a7a] p-8 text-white shadow-2xl shadow-blue-900/30"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={arsipBg} 
          alt="background" 
          className="h-full w-full object-cover object-center"
        />
        {/* Overlay Biru Solid untuk kontras teks */}
        <div className="absolute inset-0 bg-[#163a7a]/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#163a7a] via-transparent to-transparent opacity-60" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        {/* Sisi Kiri: Branding & Judul */}
        <div className="flex items-start md:items-center gap-6">
          {/* Box Icon: Solid Blue */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-blue-600 shadow-lg">
            <HiOutlineDatabase className="text-4xl text-white" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase leading-none">
              Repositori <span className="text-blue-300">Arsip Digital</span>
            </h2>
            <p className="text-sm text-blue-100/90 font-medium max-w-md mt-2">
              Kelola, amankan, dan telusuri dokumen perusahaan dalam satu platform terpusat.
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Quick Info Card */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-3 bg-blue-800 border border-blue-700 px-5 py-3 rounded-[1.5rem] shadow-md transition-all hover:bg-blue-700">
            <div className="p-2 bg-blue-500 rounded-xl text-white">
              <HiOutlineShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-tighter">Status Sistem</p>
              <p className="text-xs font-bold text-white uppercase">Terproteksi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-blue-800 bg-blue-500 flex items-center justify-center text-[8px] font-bold">
                {i}
              </div>
            ))}
          </div>
          <p className="text-[11px] font-medium text-blue-50 italic">
            "Gunakan fitur grid view untuk pratinjau dokumen secara instan."
          </p>
        </div>
      </div>
    </motion.div>
  );
}