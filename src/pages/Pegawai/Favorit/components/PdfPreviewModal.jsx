import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";

// FIX 1: CDN link worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function PdfPreviewModal({ open, filePath, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(window.innerWidth);

  // Efek untuk memantau ukuran layar agar PDF tidak gepeng
  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      // Logika: 
      // Jika desktop (> 800px) pakai 750px
      // Jika mobile, pakai lebar layar minus padding (sekitar 90% dari lebar layar)
      if (screenWidth > 800) {
        setPageWidth(750);
      } else {
        setPageWidth(screenWidth * 0.85); // Mengurangi sedikit agar ada ruang di pinggir
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (!open) return null;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-2 md:p-4">
      <div className="bg-white rounded-[2rem] md:rounded-3xl w-full max-w-4xl h-[95vh] md:h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 md:px-8 md:py-6 border-b border-slate-100 shrink-0 bg-white">
          <div>
            <h3 className="text-sm md:text-lg font-black text-slate-800 uppercase tracking-widest">Preview Dokumen</h3>
            {numPages && (
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Total {numPages} Halaman</p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all active:scale-90"
          >
            <HiXMark size={24} />
          </button>
        </div>

        {/* Scrollable Container PDF */}
        <div className="overflow-y-auto flex-1 bg-slate-100/50 p-4 md:p-8 flex flex-col items-center">
          {filePath ? (
            <Document 
              file={filePath} 
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex flex-col items-center gap-4 mt-20">
                  <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menyiapkan Preview...</p>
                </div>
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div 
                  key={`page_container_${index + 1}`} 
                  className="mb-6 shadow-2xl shadow-slate-300/50 rounded-lg overflow-hidden border border-slate-200"
                >
                  <Page 
                    pageNumber={index + 1} 
                    width={pageWidth} // Menggunakan state pageWidth yang adaptif
                    renderAnnotationLayer={false} 
                    renderTextLayer={false} 
                  />
                </div>
              ))}
            </Document>
          ) : (
            <div className="mt-20 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">File tidak dapat dimuat</p>
            </div>
          )}
        </div>

        {/* Footer info (Mobile Only) */}
        <div className="md:hidden p-4 bg-white border-t border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase italic">Gunakan dua jari untuk zoom pada layar</p>
        </div>
      </div>
    </div>
  );
}