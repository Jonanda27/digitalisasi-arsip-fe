import storageSvg from "../icons/storage.svg";

export default function StorageCard() {
  const used = 250;
  const total = 1000;
  const percentage = (used / total) * 100;

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-md border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Glow Decorative Effect */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-2xl" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 transition-transform duration-500 group-hover:rotate-12">
            <img src={storageSvg} alt="" className="h-4 w-4" />
          </div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Penyimpanan</div>
        </div>
        <div className="px-2 py-1 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-600 border border-emerald-100 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          SERVER OK
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4 relative z-10">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black text-slate-800 tracking-tight">
            {used}
          </span>
          <span className="text-sm font-bold text-slate-400 mb-1.5 italic">/ {total} GB</span>
        </div>

        <div className="w-full">
           <div className="flex justify-between text-xs mb-2">
              <span className="font-bold text-blue-600 italic transition-all group-hover:translate-x-1">
                {percentage}% Terpakai
              </span>
              <span className="text-slate-400 font-medium italic">Tersisa {total - used} GB</span>
           </div>
           
           {/* Progress Bar Container */}
           <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden p-[2px] shadow-inner">
             <div 
               className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-400 relative transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(59,130,246,0.4)]"
               style={{ 
                 width: `${percentage}%`,
                 animation: 'progress-load 1.5s ease-out forwards'
               }}
             >
                {/* Shine Sweep Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine" />
             </div>
           </div>
        </div>
      </div>

      {/* Tailwind Custom Keyframes (Tambahkan di globals.css atau lewat style tag) */}
      <style jsx>{`
        @keyframes progress-load {
          from { width: 0%; }
          to { width: ${percentage}%; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
}