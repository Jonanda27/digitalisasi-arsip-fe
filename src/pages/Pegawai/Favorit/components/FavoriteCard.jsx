import { motion } from "framer-motion";
import pdfIcon from "../icons/pdf.svg";
import { HiDownload, HiOutlineShieldCheck, HiOutlineLockClosed, HiStar } from "react-icons/hi";

export default function FavoriteCard({ 
  title, nomorSurat, nomorArsip, tahun, akses, 
  hasApprovedAccess, filePath, onToggleFavorite, onPreviewClick, onOpen 
}) {
  
  const getAksesColor = () => {
    const a = (akses || "").toLowerCase();
    if (a === "umum") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (a === "terbatas") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-rose-50 text-rose-600 border-rose-100";
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 rounded-[2.5rem] border border-slate-100 bg-white p-4 md:p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group"
    >
      {/* Header Mobile: Icon & Star Button */}
      <div className="flex items-center justify-between md:hidden mb-1">
        <div 
          onClick={() => hasApprovedAccess && filePath && onPreviewClick()}
          className={`h-14 w-14 shrink-0 flex items-center justify-center rounded-[1.2rem] bg-red-50 border border-red-100 transition-all ${hasApprovedAccess ? 'cursor-pointer active:scale-95' : 'grayscale opacity-50'}`}
        >
          <img src={pdfIcon} alt="PDF" className="h-8 w-8" />
        </div>
        
        <button 
          onClick={onToggleFavorite} 
          className="p-3 rounded-2xl bg-yellow-50 text-yellow-500 border border-yellow-100 active:scale-75 transition-all shadow-sm shadow-yellow-100"
        >
          <HiStar className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Icon (Hidden on Mobile) */}
      <div 
        onClick={() => hasApprovedAccess && filePath && onPreviewClick()}
        className={`hidden md:flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-red-50 border border-red-100 transition-all duration-500 ${hasApprovedAccess ? 'cursor-pointer group-hover:scale-110' : 'grayscale opacity-50'}`}
      >
        <img src={pdfIcon} alt="PDF" className="h-12 w-12" />
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base md:text-lg font-black text-slate-800 leading-tight mb-1 break-words">
              {title}
            </h3>
            <span className={`inline-flex items-center text-[9px] px-3 py-1 rounded-full border font-black uppercase tracking-wider ${getAksesColor()}`}>
              {akses}
            </span>
          </div>
          
          {/* Desktop Favorite (Hidden on Mobile) */}
          <button 
            onClick={onToggleFavorite} 
            className="hidden md:block shrink-0 p-3 rounded-2xl bg-yellow-50 text-yellow-500 border border-yellow-100 active:scale-75 transition-all hover:bg-yellow-400 hover:text-white"
          >
            <HiStar className="h-5 w-5" />
          </button>
        </div>

        {/* Metadata Section - Dirapikan untuk Mobile */}
        <div className="mt-4 p-3 md:p-0 md:bg-transparent bg-slate-50/50 rounded-2xl md:border-t md:border-slate-50 md:pt-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-x-5 text-[10px] md:text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            <div className="flex items-center justify-between md:justify-start md:gap-2 border-b border-slate-100 md:border-0 pb-1 md:pb-0">
              <span className="opacity-60">No. Arsip</span>
              <span className="text-slate-700 font-black">{nomorArsip || "-"}</span>
            </div>
            <div className="flex items-center justify-between md:justify-start md:gap-2 border-b border-slate-100 md:border-0 pb-1 md:pb-0">
              <span className="opacity-60">Tahun</span>
              <span className="text-slate-700 font-black">{tahun}</span>
            </div>
            <div className="flex items-center justify-between md:justify-start md:gap-2">
              <span className="opacity-60">No. Surat</span>
              <span className="text-slate-700 font-black truncate max-w-[150px] md:max-w-none">{nomorSurat || "-"}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch md:items-center gap-2 md:gap-3">
          {!hasApprovedAccess ? (
            <button 
              onClick={onOpen} 
              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 md:py-3 text-[10px] font-black uppercase text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
            >
              <HiOutlineLockClosed className="text-base" /> Minta Akses
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 md:py-2.5 text-[10px] font-black uppercase text-emerald-600 border border-emerald-100">
              <HiOutlineShieldCheck className="text-base" /> Terbuka
            </div>
          )}
          
          <button 
            disabled={!hasApprovedAccess} 
            className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 md:py-3 text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
              hasApprovedAccess 
                ? "bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200" 
                : "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200"
            }`}
          >
            <HiDownload className="text-base" /> Unduh PDF
          </button>
        </div>
      </div>
    </motion.div>
  );
}