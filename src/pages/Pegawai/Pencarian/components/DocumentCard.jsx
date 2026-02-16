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
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex min-h-[150px] flex-col justify-between">
        {/* ... (Konten Atas Sama Seperti Sebelumnya) ... */}
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-slate-900">{title}</h4>
            <p className="mt-1 text-xs text-slate-500">
              Nomor Surat: {nomorSurat} &nbsp; Nomor Arsip: {nomorArsip}
            </p>
            <p className="mt-1 text-xs text-slate-500">Tahun Dokumen: {tahun}</p>
          </div>

          <div onClick={hasApprovedAccess ? onPreview : null} className="cursor-pointer">
            <img src={pdfIcon} alt="PDF" className="h-10 w-10" />
          </div>
        </div>

        {/* BOTTOM ACTION */}
        <div className="mt-4 flex items-center">
          <div className="flex flex-1 min-w-0 flex-wrap items-center gap-2">
            {!hasApprovedAccess ? (
              <button onClick={onOpen} className="rounded-lg bg-[#1F5EFF] px-3 py-1.5 text-xs font-medium text-white">
                Minta Akses
              </button>
            ) : (
              <span className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700">
                Memiliki Akses 
              </span>
            )}

            <span className={["rounded-lg px-3 py-1.5 text-xs font-medium", 
                aksesLower === "umum" ? "bg-emerald-500 text-white" : 
                aksesLower === "terbatas" ? "bg-amber-500 text-white" : "bg-rose-600 text-white"
              ].join(" ")}>
              {aksesLower === "umum" ? "Umum" : aksesLower === "terbatas" ? "Terbatas" : "Rahasia"}
            </span>

            <button
              onClick={handleDownload}
              disabled={!hasApprovedAccess}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition ${
                hasApprovedAccess ? "bg-slate-700 hover:bg-slate-800" : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              Unduh Dokumen
            </button>
          </div>

          <button onClick={onToggleFavorite} className="ml-3 active:scale-90">
            <StarIcon active={isFavorite} />
          </button>
        </div>
      </div>

      {/* RENDER NOTIFIKASI */}
      <SuccessNotification 
        show={showSuccess} 
        onClose={() => setShowSuccess(false)} 
        // Anda bisa menambahkan prop teks kustom jika ingin mengubah pesan
        message="Dokumen berhasil diunduh ke perangkat Anda." 
      />
    </>
  );
}