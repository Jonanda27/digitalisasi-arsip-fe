import { motion } from "framer-motion";
import { HiOutlineFolderOpen, HiOutlineCube, HiOutlineShieldCheck, HiOutlineDatabase } from "react-icons/hi";

export default function WelcomeBannerArsip() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#163a7a] via-[#1D4EA8] to-[#2563eb] p-8 text-white shadow-2xl shadow-blue-900/30"
    >
      {/* Ornamen Background Dekoratif */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-[100px]" />
      <div className="absolute right-1/4 -bottom-32 h-64 w-64 rounded-full bg-blue-400/10 blur-[80px]" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23fff' fill-rule='evenodd'/%3E%3C/svg%3E")` }} 
      />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        {/* Sisi Kiri: Branding & Judul */}
        <div className="flex items-start md:items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <HiOutlineDatabase className="text-4xl text-blue-200" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-1 w-8 bg-blue-400 rounded-full" />
              <h1 className="text-[10px] font-black tracking-[0.3em] text-blue-200 uppercase">
                Enterprise Document Management
              </h1>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase leading-none">
              Repositori <span className="text-blue-300">Arsip Digital</span>
            </h2>
            <p className="text-sm text-blue-100/60 font-medium max-w-md mt-2">
              Kelola, amankan, dan telusuri dokumen perusahaan dalam satu platform terpusat.
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Quick Info Cards (Stats Ringkas) */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-[1.5rem] transition-hover hover:bg-white/10">
            <div className="p-2 bg-blue-400/20 rounded-xl text-blue-300">
              <HiOutlineShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-tighter">Status Sistem</p>
              <p className="text-xs font-bold text-white uppercase">Terproteksi</p>
            </div>
          </div>

          
        </div>
      </div>

      {/* Footer Bar: Tip atau Notifikasi */}
      <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-[#1D4EA8] bg-blue-400 flex items-center justify-center text-[8px] font-bold">
                {i}
              </div>
            ))}
          </div>
          <p className="text-[11px] font-medium text-blue-100/70 italic">
            "Gunakan fitur grid view untuk pratinjau dokumen secara instan."
          </p>
        </div>
        
        
      </div>
    </motion.div>
  );
}