import { motion } from "framer-motion"; // <-- Tambahkan ini
import pdfIcon from "../icons/pdf.svg";
import { HiDownload, HiOutlineShieldCheck, HiOutlineLockClosed } from "react-icons/hi";

export default function FavoriteCard({ 
  title, 
  nomorSurat, 
  nomorArsip, 
  tahun, 
  akses, 
  isFavorite, 
  hasApprovedAccess, 
  filePath, 
  onToggleFavorite,
  onPreviewClick, 
  onOpen 
  
}) {
  
  const getAksesColor = () => {
    const a = (akses || "").toLowerCase();
    if (a === "umum") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (a === "terbatas") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-rose-50 text-rose-600 border-rose-100";
  };

  const handleDownload = async () => {
    if (!hasApprovedAccess || !filePath) return;
    try {
      const response = await fetch(filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title || "dokumen"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Gagal mengunduh:", error);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group"
    >
     <div 
        onClick={() => {
          if (hasApprovedAccess && filePath) {
            onPreviewClick(); // <--- PANGGIL DISINI
          }
        }}
        className={`h-16 w-16 shrink-0 flex items-center justify-center rounded-2xl bg-red-50 border border-red-100 group-hover:scale-110 transition-transform ${hasApprovedAccess ? 'cursor-pointer' : 'grayscale opacity-50'}`}
      >
        <img src={pdfIcon} alt="PDF" className="h-10 w-10" draggable="false" />
      </div>

      {/* Info Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-base font-bold text-slate-800 truncate">{title}</h3>
          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-tighter ${getAksesColor()}`}>
            {akses}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-400 font-medium">
          <p>No. Surat: <span className="text-slate-600">{nomorSurat || "-"}</span></p>
          <p>No. Arsip: <span className="text-slate-600">{nomorArsip || "-"}</span></p>
          <p>Tahun: <span className="text-slate-600">{tahun}</span></p>
        </div>

        <div className="mt-5 flex items-center gap-3">
          {!hasApprovedAccess ? (
            <button 
              onClick={onOpen} 
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
            >
              <HiOutlineLockClosed className="text-sm" /> Minta Akses
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 border border-emerald-100">
              <HiOutlineShieldCheck className="text-sm" /> Akses Terbuka
            </div>
          )}

          <button
            onClick={handleDownload}
            disabled={!hasApprovedAccess}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
              hasApprovedAccess 
                ? "bg-slate-800 text-white hover:bg-black shadow-md" 
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            <HiDownload className="text-sm" /> Unduh
          </button>
        </div>
      </div>

      {/* Star Button */}
      <button 
        onClick={onToggleFavorite}
        className="p-3 rounded-2xl bg-slate-50 text-yellow-400 hover:bg-yellow-50 transition-all border border-transparent hover:border-yellow-100 active:scale-90"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
        </svg>
      </button>
    </motion.div>
  );
}