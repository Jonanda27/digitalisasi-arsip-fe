import { useState } from "react";
import DocumentCard from "./DocumentCard";
import RequestAccessModal from "./RequestAccessModal";
import PdfPreviewModal from "./PdfPreviewModal";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

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
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          {/* Teks hanya muncul jika sedang loading atau jika ada kata kunci pencarian */}
          {(loading || query.trim() !== "") && (
            <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              {loading 
                ? "Sinkronisasi Data..." 
                : `${results.length} Hasil Pencarian`
              }
            </p>
          )}
          
        </div>
        
        {/* Tombol Filter hanya muncul di Desktop */}
        <button
          type="button"
          onClick={onOpenMetadata}
          className="hidden lg:flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-100 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95"
        >
          <HiOutlineAdjustmentsHorizontal className="text-lg" />
          Filter Metadata
        </button>
      </div>

      {/* LIST DOKUMEN */}
      <div className="space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
               <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Memuat Arsip...</p>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4 border border-slate-100">
               <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <p className="text-sm font-black text-slate-800">Tidak Ada Dokumen</p>
            <p className="text-xs mt-1 text-slate-400 font-medium text-center px-6">
              {query.trim() !== "" 
                ? "Tidak ada hasil yang cocok dengan kata kunci Anda" 
                : "Belum ada dokumen yang tersedia di kategori ini"}
            </p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 gap-4">
            {results.map((doc) => (
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
        )}
      </div>

      <RequestAccessModal open={openModal} file={selectedFile} onClose={() => setOpenModal(false)} />
      <PdfPreviewModal open={!!previewFile} filePath={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
}