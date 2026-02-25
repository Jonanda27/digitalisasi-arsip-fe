import { motion } from "framer-motion";
import pdfIcon from "../icons/pdf.svg";
import { HiDownload, HiOutlineEye, HiStar } from "react-icons/hi";

export default function FavoriteCard({ 
  title, 
  nomorSurat, 
  nomorArsip, 
  tahun, 
  akses, 
  filePath, 
  onToggleFavorite, 
  onPreviewClick // Menggunakan onPreviewClick agar sinkron dengan AdminFavorit
}) {
  
  const getAksesColor = () => {
    const a = (akses || "").toLowerCase();
    if (a === "umum") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (a === "terbatas") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-rose-50 text-rose-600 border-rose-100";
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!filePath) return alert("File tidak tersedia");

    try {
      // 1. Ambil nama file yang bersih
      const fileName = `${title || "dokumen"}.pdf`.replace(/[/\\?%*:|"<>]/g, '-');

      // 2. Cek apakah ini browser mobile (opsional tapi membantu)
      // Kita gunakan metode 'link' langsung untuk mobile agar ditangani native browser
      const response = await fetch(filePath);
      const blob = await response.blob();
      
      // 3. Buat Object URL dari Blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      // 4. Perbaikan khusus Mobile: Tambahkan target _blank dan append ke body
      link.target = "_blank"; 
      document.body.appendChild(link);
      
      link.click();

      // 5. Cleanup dengan sedikit delay agar browser sempat memproses download
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 200);

    } catch (error) {
      console.error("Gagal mengunduh:", error);
      // Fallback: Jika fetch gagal (karena CORS), coba buka di tab baru
      window.open(filePath, '_blank');
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 bg-white p-4 md:p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group"
    >
      {/* --- HEADER MOBILE: ICON & STAR --- */}
      <div className="flex items-center justify-between md:hidden mb-1">
        <div 
          onClick={onPreviewClick}
          className="h-14 w-14 shrink-0 flex items-center justify-center rounded-[1.2rem] bg-red-50 border border-red-100 active:scale-95 transition-all cursor-pointer"
        >
          <img src={pdfIcon} alt="PDF" className="h-8 w-8" draggable="false" />
        </div>
        
        <button 
          onClick={onToggleFavorite} 
          className="p-3 rounded-2xl bg-yellow-50 text-yellow-500 border border-yellow-100 active:scale-75 transition-all shadow-sm shadow-yellow-100"
          title="Hapus dari Favorit"
        >
          <HiStar className="h-6 w-6" />
        </button>
      </div>

      {/* --- DESKTOP ICON (Hidden on Mobile) --- */}
      <div 
        onClick={onPreviewClick}
        className="hidden md:flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-red-50 border border-red-100 cursor-pointer group-hover:scale-110 transition-all duration-500"
      >
        <img src={pdfIcon} alt="PDF" className="h-12 w-12" draggable="false" />
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 
              onClick={onPreviewClick}
              className="text-base md:text-lg font-black text-slate-800 leading-tight mb-1 break-words cursor-pointer hover:text-blue-600 transition-colors"
            >
              {title}
            </h3>
            <span className={`inline-flex items-center text-[9px] px-3 py-1 rounded-full border font-black uppercase tracking-wider ${getAksesColor()}`}>
              {akses}
            </span>
          </div>
          
          {/* Desktop Star (Hidden on Mobile) */}
          <button 
            onClick={onToggleFavorite} 
            className="hidden md:block shrink-0 p-3 rounded-2xl bg-yellow-50 text-yellow-500 border border-yellow-100 active:scale-75 transition-all hover:bg-yellow-400 hover:text-white"
            title="Hapus dari Favorit"
          >
            <HiStar className="h-5 w-5" />
          </button>
        </div>

        {/* --- METADATA SECTION (Dirapikan untuk Mobile/iPad) --- */}
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

        {/* --- ACTION BUTTONS (Selalu Aktif untuk Admin) --- */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch md:items-center gap-2 md:gap-3">
          <button 
            onClick={onPreviewClick} 
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 md:py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
          >
            <HiOutlineEye className="text-base" /> Buka Dokumen
          </button>
          
          <button 
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 md:py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
          >
            <HiDownload className="text-base" /> Unduh PDF
          </button>
        </div>
      </div>
    </motion.div>
  );
}