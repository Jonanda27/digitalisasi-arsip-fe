import { useState } from "react"; // Tambahkan useState
import pdfIcon from "../icons/pdf.svg";
import axios from "axios"; 
import { getToken } from "../../../../auth/auth"; 
import { API } from "../../../../global/api"; // Pastikan API di-import
import SuccessNotification from "./SuccessNotification"; // Sesuaikan path import

export default function DocumentCard({
  title,
  nomorSurat,
  nomorArsip,
  tahun,
  akses,
  isFavorite,
  hasApprovedAccess,
  onPreview,
  filePath,
  onToggleFavorite,
  onOpen,
}) {
  const aksesLower = (akses || "").toLowerCase();
  
  // State untuk mengontrol notifikasi
  const [showSuccess, setShowSuccess] = useState(false);

  // ... fungsi StarIcon tetap sama ...
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

  const handleDownload = async () => {
    if (!hasApprovedAccess) {
      alert("Anda belum memiliki akses untuk mengunduh file ini.");
      return;
    }

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

      const token = getToken();
      if (token) {
        await axios.post(
          `${API}/logs`,
          {
            kategori: "Sistem",
            aktivitas: `Mengunduh dokumen: ${title}`,
            status: "sukses",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      // --- TRIGGER NOTIFIKASI DISINI ---
      setShowSuccess(true);
      
    } catch (error) {
      console.error("Download error:", error);
      alert("Gagal mengunduh file.");
    }
  };

  return (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all duration-200">
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900 truncate">{title}</h4>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
          <span>No. Surat: {nomorSurat}</span>
          <span className="hidden sm:inline">|</span>
          <span>Tahun: {tahun}</span>
        </div>
      </div>
      <div onClick={hasApprovedAccess ? onPreview : null} className="shrink-0 cursor-pointer">
        <img src={pdfIcon} alt="PDF" className="h-9 w-9 md:h-10 md:w-10" />
      </div>
    </div>

    {/* Actions Area: Flex-wrap agar tidak pecah di mobile */}
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-50">
      <div className="flex flex-wrap items-center gap-2">
        {!hasApprovedAccess ? (
          <button onClick={onOpen} className="rounded-lg bg-[#1F5EFF] px-3 py-1.5 text-[10px] md:text-xs font-bold text-white whitespace-nowrap">
            Minta Akses
          </button>
        ) : (
          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] md:text-xs font-bold text-blue-600 border border-blue-100 whitespace-nowrap">
            Akses Terbuka
          </span>
        )}

        <span className={`rounded-lg px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-tight ${
          aksesLower === "umum" ? "bg-emerald-100 text-emerald-700" : 
          aksesLower === "terbatas" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
        }`}>
          {aksesLower}
        </span>

        <button
          onClick={handleDownload}
          disabled={!hasApprovedAccess}
          className={`rounded-lg px-3 py-1.5 text-[10px] md:text-xs font-bold text-white transition ${
            hasApprovedAccess ? "bg-slate-800 hover:bg-black" : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          Unduh
        </button>
      </div>

      <button onClick={onToggleFavorite} className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-90 shrink-0">
        <StarIcon active={isFavorite} />
      </button>
    </div>
  </div>
);
}