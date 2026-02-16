import { useState } from "react";
import DocumentCard from "./DocumentCard";
import RequestAccessModal from "./RequestAccessModal";
import PdfPreviewModal from "./PdfPreviewModal";

export default function SearchResults({
  results = [],
  onToggleFavorite,
  onOpenMetadata,
  loading,
  query,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  function onRequestAccess(doc) {
    setSelectedFile(doc);
    setOpenModal(true);
  }

  function handlePreview(doc) {
    if (!doc.hasApprovedAccess) {
      alert("Anda belum memiliki akses untuk melihat file ini");
      return;
    }
    if (doc.filePath) {
      setPreviewFile(doc.filePath);
    } else {
      alert("File tidak tersedia untuk preview");
    }
  }

  return (
    <div className="w-full h-full">
      {/* HEADER INTERNAL */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-sm font-medium text-slate-500">
          {loading 
            ? "Mencari dokumen..." 
            : query.trim() !== "" 
              ? `${results.length} Dokumen ditemukan` // Jika ada query
              : `${results.length} Dokumen tersedia`  // Jika query kosong (awal)
          }
        </p>
        
       {/* Tombol ini sekarang akan membuka modal */}
        <button
          type="button"
          onClick={onOpenMetadata} // Memanggil setIsFilterModalOpen(true) di parent
          className="rounded-lg bg-[#1F5EFF] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-600 transition shadow-sm active:scale-95"
        >
          Cari Metadata
        </button>
      </div>

      {/* LIST DOKUMEN (Tanpa scrollbar sendiri) */}
      <div className="space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-9 h-9 border-4 border-slate-100 border-t-[#1F5EFF] rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400 font-medium">Memuat data...</p>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">Tidak ditemukan dokumen.</p>
          </div>
        )}

        {!loading && results.map((doc) => (
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
    </div>
  );
}