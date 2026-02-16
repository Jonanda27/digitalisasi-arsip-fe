import { useState } from "react";
import DocumentCard from "./DocumentCard";
import RequestAccessModal from "./RequestAccessModal";
import PdfPreviewModal from "./PdfPreviewModal";

export default function SearchResults({
  results = [],
  onToggleFavorite,
  onOpenMetadata,
  loading,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // Fungsi Request Access
  function onRequestAccess(doc) {
    setSelectedFile(doc);
    setOpenModal(true);
  }

  // Fungsi Preview
  // Ubah fungsi handlePreview di dalam SearchResults.jsx menjadi seperti ini:
function handlePreview(doc) {
  // Pengecekan hasApprovedAccess dihapus agar langsung terbuka
  if (doc.filePath) {
    setPreviewFile(doc.filePath);
  } else {
    alert("File tidak tersedia untuk preview");
  }
}

  return (
    <div className="flex h-[80vh] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:h-[85vh]">
      {/* PENTING: 
          - h-[80vh] memberikan tinggi maksimal berdasarkan tinggi layar.
          - flex-col digunakan agar kita bisa membagi area Header dan Body.
      */}

      {/* HEADER: flex-shrink-0 memastikan header tidak ikut mengecil atau ter-scroll */}
      <div className="flex shrink-0 items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Hasil Pencarian
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Sedang mencari..."
              : `${results.length} Dokumen ditemukan`}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenMetadata}
          className="rounded-lg bg-[#1F5EFF] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition shadow-sm active:scale-95"
        >
          Cari Metadata
        </button>
      </div>

      {/* BODY: flex-1 dan overflow-y-auto membuat area ini bisa di-scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-3 pb-4">
          
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-9 h-9 border-4 border-slate-100 border-t-[#1F5EFF] rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400 font-medium">Menghubungkan ke server...</p>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">Tidak ada dokumen yang cocok dengan kata kunci.</p>
            </div>
          )}

          {!loading &&
            results.map((doc) => (
              <DocumentCard
                key={doc._id}
                title={doc.namaFile || doc.name}
                nomorSurat={doc.noDokumenPreview || doc.nomorSurat}
                nomorArsip={doc.noArsipPreview}
                tahun={doc.tahun}
                akses={doc.kerahasiaan}
                isFavorite={doc.isFavorite}
                hasApprovedAccess={doc.hasApprovedAccess}
                onToggleFavorite={() => onToggleFavorite(doc._id)}
                onOpen={() => onRequestAccess(doc)}
                onDownload={() => {}} 
                onPreview={() => handlePreview(doc)}
                filePath={doc.filePath}
              />
            ))}
        </div>
      </div>

      {/* MODALS: Di luar alur scroll */}
      <RequestAccessModal
        open={openModal}
        file={selectedFile}
        onClose={() => setOpenModal(false)}
      />
      
      <PdfPreviewModal
        open={!!previewFile}
        filePath={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {/* STYLE KHUSUS: Untuk scrollbar yang lebih modern (opsional) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}