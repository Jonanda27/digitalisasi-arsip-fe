import { useState } from "react";
import pdfIcon from "../icons/pdf.svg";
import axios from "axios"; 
import { getToken } from "../../../../auth/auth"; 
import { API } from "../../../../global/api";
import SuccessNotification from "./SuccessNotification";

export default function DocumentCard({
  title,
  nomorSurat,
  nomorArsip,
  tahun,
  akses,
  isFavorite,
  onPreview,
  filePath,
  onToggleFavorite,
}) {
  const aksesLower = (akses || "").toLowerCase();
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Komponen Internal: StarIcon
   */
  function StarIcon({ active }) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 transition-all duration-200"
        fill={active ? "#FACC15" : "none"}
        stroke={active ? "#FACC15" : "#94A3B8"}
        strokeWidth="2"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
      </svg>
    );
  }

  /**
   * Handler: Unduh Dokumen
   */
  const handleDownload = async (e) => {
    e.stopPropagation();

    if (!filePath) {
      alert("Path file tidak ditemukan.");
      return;
    }

    try {
      const response = await fetch(filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const fileName = title ? `${title}.pdf` : "dokumen.pdf";
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Log Aktivitas
      const token = getToken();
      if (token) {
        await axios.post(
          `${API}/logs`,
          {
            kategori: "Unduh",
            aktivitas: `User mengunduh dokumen: ${title} (${nomorSurat || 'Tanpa No'})`,
            status: "sukses",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setShowSuccess(true);
    } catch (error) {
      console.error("Download error:", error);
      alert("Gagal mengunduh file.");
    }
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all duration-200 min-h-[160px]">
        
        {/* BAGIAN ATAS: Informasi & Icon */}
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate" title={title}>
              {title}
            </h4>
            
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">No. Surat</span>
                <span className="text-xs text-slate-600 font-medium truncate">{nomorSurat || "-"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Tahun / No. Arsip</span>
                <span className="text-xs text-slate-600 font-medium">{tahun || "-"} | {nomorArsip || "-"}</span>
              </div>
            </div>
          </div>

          {/* Icon PDF: Buka Preview saat diklik */}
          <div 
            onClick={onPreview} 
            className="shrink-0 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl cursor-pointer bg-red-50 hover:bg-red-100 transition-colors group"
          >
            <img src={pdfIcon} alt="PDF" className="h-7 w-7 md:h-8 md:w-8 transition-transform group-hover:scale-110" />
          </div>
        </div>

        {/* BAGIAN BAWAH: Action Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-50 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Tombol Utama: Buka Dokumen */}
            <button
              type="button"
              onClick={onPreview}
              className="rounded-lg bg-[#1F5EFF] px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap"
            >
              Buka Dokumen
            </button>

            {/* Badge Status Kerahasiaan */}
            <span
              className={`rounded-lg px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-tight whitespace-nowrap ${
                aksesLower === "umum"
                  ? "bg-emerald-100 text-emerald-700"
                  : aksesLower === "terbatas"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700"
              }`}
            >
              {aksesLower || "Umum"}
            </span>

            {/* Tombol Unduh */}
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg bg-slate-800 px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold text-white shadow-sm hover:bg-slate-900 transition-all active:scale-95 whitespace-nowrap"
            >
              Unduh
            </button>
          </div>

          {/* Tombol Favorit */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 transition-all hover:bg-white hover:shadow-md active:scale-90 shrink-0"
          >
            <StarIcon active={isFavorite} />
          </button>
        </div>
      </div>

      {showSuccess && (
        <SuccessNotification 
          message="Dokumen berhasil diunduh" 
          onClose={() => setShowSuccess(false)} 
        />
      )}
    </>
  );
}