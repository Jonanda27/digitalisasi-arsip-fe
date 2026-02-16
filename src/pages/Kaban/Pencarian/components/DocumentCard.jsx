import pdfIcon from "../icons/pdf.svg";
import axios from "axios"; 
import { getToken } from "../../../../auth/auth"; 
import { API } from "../../../../global/api";

export default function DocumentCard({
  title,
  nomorSurat,
  nomorArsip,
  tahun,
  akses,
  isFavorite,
  filePath,
  onToggleFavorite,
  onPreview, // Fungsi untuk membuka PdfPreviewModal
}) {
  const aksesLower = (akses || "").toLowerCase();

  /**
   * Komponen Internal: StarIcon
   * Digunakan untuk indikator favorit
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
   * Mendownload file dan mengirimkan log ke server
   */
  const handleDownload = async (e) => {
    e.stopPropagation(); // Mencegah bubbling ke event parent jika ada

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

      // Kirim log aktivitas download ke server
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
    } catch (error) {
      console.error("Download error:", error);
      alert("Gagal mengunduh file.");
    }
  };

  /**
   * Handler: Buka Preview
   */
  const handlePreviewClick = () => {
    if (filePath) {
      onPreview();
    } else {
      alert("File tidak tersedia untuk preview");
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex min-h-[150px] flex-col justify-between hover:border-blue-300 transition-all duration-200">
      
      {/* BAGIAN ATAS: Informasi Dokumen & Icon PDF */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 truncate" title={title}>
            {title}
          </h4>
          <div className="mt-2 space-y-1">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Detail Dokumen</p>
            <p className="text-xs text-slate-600">
              No. Surat: <span className="font-medium">{nomorSurat || "-"}</span>
            </p>
            <p className="text-xs text-slate-600">
              No. Arsip: <span className="font-medium">{nomorArsip || "-"}</span>
            </p>
            <p className="text-xs text-slate-600">
              Tahun: <span className="font-medium">{tahun || "-"}</span>
            </p>
          </div>
        </div>

        {/* Icon PDF - Klik untuk Preview */}
        <div 
          onClick={handlePreviewClick} 
          className="cursor-pointer group flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 transition-colors hover:bg-red-100"
        >
          <img src={pdfIcon} alt="PDF" className="h-8 w-8 transition-transform group-hover:scale-110" />
        </div>
      </div>

      {/* BAGIAN BAWAH: Action Buttons */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2">
          
          {/* Tombol Buka Dokumen (Modal Preview) */}
          <button
            type="button"
            onClick={handlePreviewClick}
            className="rounded-lg bg-[#1F5EFF] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            Buka Dokumen
          </button>

          {/* Badge Tingkat Kerahasiaan */}
          <span
            className={[
              "rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-tight",
              aksesLower === "umum"
                ? "bg-emerald-100 text-emerald-700"
                : aksesLower === "terbatas"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-rose-100 text-rose-700",
            ].join(" ")}
          >
            {aksesLower || "Umum"}
          </span>

          {/* Tombol Unduh Langsung */}
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-900 active:scale-95 transition-all"
          >
            Unduh Dokumen
          </button>
        </div>

        {/* Tombol Favorit (Bintang) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 transition-all hover:bg-white hover:shadow-md active:scale-90"
          title={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
          <StarIcon active={isFavorite} />
        </button>
      </div>
    </div>
  );
}