import storageSvg from "../icons/storage.svg";

export default function StorageCard() {
  const used = 250;
  const total = 1000;
  const percentage = (used / total) * 100;

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-white p-6 sm:p-6 shadow-md border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-mobile-entry">
      
      {/* Glow Decorative Effect */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-2xl" />

      {/* Header Section: Diberi gap lebih besar di mobile agar tidak rapat */}
      <div className="flex items-center justify-between relative z-10 mb-6 sm:mb-0">
        <div className="flex items-center gap-3 sm:gap-2">
          <div className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-blue-50 transition-transform duration-500 group-hover:rotate-12">
            <img src={storageSvg} alt="" className="h-5 w-5 sm:h-4 sm:w-4" />
          </div>
          <div className="text-[12px] sm:text-sm font-bold text-slate-500 uppercase tracking-widest sm:tracking-wide">Penyimpanan</div>
        </div>
        <div className="px-3 py-1.5 sm:px-2 sm:py-1 rounded-full sm:rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-600 border border-emerald-100 flex items-center gap-1.5 sm:gap-1">
          <span className="h-2 w-2 sm:h-1.5 sm:w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden xs:inline">SERVER OK</span>
          <span className="xs:hidden">OK</span>
        </div>
      </div>

      {/* Content Section: Diberi padding bawah di mobile agar tidak menempel ke border */}
      <div className="flex-1 flex flex-col justify-center gap-6 sm:gap-4 relative z-10 pb-4 sm:pb-0">
        <div className="flex items-end gap-2">
          <span className="text-5xl sm:text-4xl font-black text-slate-800 tracking-tight animate-count-up">
            {used}
          </span>
          <span className="text-sm sm:text-sm font-bold text-slate-400 mb-2 sm:mb-1.5 italic">/ {total} GB</span>
        </div>

        <div className="w-full">
            <div className="flex justify-between text-[11px] sm:text-xs mb-3 sm:mb-2">
              <span className="font-bold text-blue-600 italic transition-all group-hover:translate-x-1">
                {percentage}% Terpakai
              </span>
              <span className="text-slate-400 font-medium italic">Tersisa {total - used} GB</span>
            </div>
            
            {/* Progress Bar Container: Ditinggikan sedikit di mobile agar lebih mudah dilihat */}
            <div className="h-4 sm:h-3 w-full rounded-full bg-slate-100 overflow-hidden p-[3px] sm:p-[2px] shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-400 relative transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                style={{ 
                  width: `${percentage}%`,
                  animation: 'progress-load 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                }}
              >
                 {/* Shine Sweep Effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shine" />
              </div>
            </div>
        </div>
      </div>

      <style jsx>{`
        /* Animasi khusus Entry Mobile */
        @keyframes mobile-entry {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes progress-load {
          from { width: 0%; }
          to { width: ${percentage}%; }
        }

        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .animate-mobile-entry {
          animation: mobile-entry 0.6s ease-out forwards;
        }

        .animate-shine {
          animation: shine 2.5s infinite;
        }

        @media (min-width: 640px) {
           .animate-mobile-entry {
              animation: none; /* Matikan animasi entry di desktop agar tidak mengganggu slide-in bawaan */
           }
        }
      `}</style>
    </div>
  );
}