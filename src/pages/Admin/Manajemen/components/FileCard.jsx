import { FiMoreVertical, FiFileText } from "react-icons/fi";
import { API } from "../../../../global/api";

export default function FileCard({ file, onPreview }) {
  // Fungsi untuk mendapatkan icon berdasarkan tipe file (opsional)
  const getFileIcon = (mimeType) => {
    if (mimeType?.includes("pdf")) return <span className="bg-red-500 p-1 rounded text-[10px] text-white font-bold">PDF</span>;
    return <FiFileText className="text-blue-500" />;
  };

  return (
    <div className="group relative bg-slate-50 rounded-[2rem] p-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-100 border border-transparent hover:border-slate-100 cursor-pointer">
      
      {/* 1. HEADER KARTU (Icon & Nama & Menu) */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0">
            {getFileIcon(file.mimeType)}
          </div>
          <h4 className="text-sm font-bold text-slate-700 truncate tracking-tight">
            {file.originalName}
          </h4>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1">
          <FiMoreVertical />
        </button>
      </div>

      {/* 2. AREA ISI HALALAN (Thumbnail/Preview Utama) */}
      <div 
        onClick={() => onPreview(file)}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-white border border-slate-100 shadow-inner group-hover:border-blue-100 transition-all"
      >
        {/* Menggunakan iframe untuk menampilkan halaman pertama dokumen secara langsung */}
        <iframe
          src={`${API}/files/${file._id}/preview#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full pointer-events-none scale-110 origin-top"
          title={file.originalName}
          loading="lazy"
        />
        
        {/* Overlay transparan agar iframe tidak bisa di-scroll di dalam kartu */}
        <div className="absolute inset-0 z-10 bg-transparent" />
      </div>

    </div>
  );
}