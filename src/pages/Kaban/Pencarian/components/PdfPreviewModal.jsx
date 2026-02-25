import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiZoomIn, HiZoomOut } from "react-icons/hi";

// Fix Worker CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function PdfPreviewModal({ open, filePath, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [pageWidth, setPageWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 800) {
        setPageWidth(750); // Ukuran desktop tetap
      } else {
        // Di mobile, paksa lebar layar 100% (dikurangi margin sangat tipis jika perlu)
        setPageWidth(screenWidth); 
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-slate-900/95 backdrop-blur-md p-0 sm:p-4"
      >
        {/* HEADER MOBILE & DESKTOP */}
        <div className="absolute top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sm:hidden">
            <div>
                <h3 className="text-sm font-black text-slate-800 uppercase">Preview</h3>
                <p className="text-[10px] text-blue-600 font-bold">{numPages} Halaman</p>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-xl text-slate-500 active:scale-90">
                <HiX size={20} />
            </button>
        </div>

        {/* MODAL CONTAINER */}
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-[#F1F5F9] w-full sm:rounded-[2.5rem] h-full sm:h-[90vh] max-w-5xl flex flex-col overflow-hidden relative"
        >
          {/* HEADER DESKTOP ONLY */}
          <div className="hidden sm:flex bg-white px-8 py-6 border-b border-slate-100 justify-between items-center shrink-0">
             <div className="flex flex-col">
               <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Preview Dokumen</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{numPages} Halaman Terdeteksi</p>
             </div>
             <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all active:scale-90">
                <HiX size={24} />
             </button>
          </div>

          {/* AREA PDF (FULLSCREEN MOBILE) */}
          <div className="overflow-y-auto flex-1 bg-slate-100 pt-20 sm:pt-10 pb-20 px-0 sm:px-10 scroll-smooth custom-scrollbar">
            <div className="flex flex-col items-center">
              <Document 
                file={filePath} 
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={
                  <div className="flex flex-col items-center py-32">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memproses File...</p>
                  </div>
                }
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div 
                    key={`page_${index + 1}`} 
                    className="mb-4 sm:mb-8 shadow-2xl bg-white w-full sm:w-auto"
                  >
                    <Page 
                      pageNumber={index + 1} 
                      width={pageWidth * scale} 
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      className="mx-auto"
                    />
                  </div>
                ))}
              </Document>
            </div>
          </div>

          {/* FLOATING CONTROLS (ZOOM) UNTUK MOBILE & DESKTOP */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-full p-1.5 shadow-2xl z-[110]">
             <button 
                onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} 
                className="p-3 sm:p-4 text-white hover:bg-white/10 rounded-full transition-colors"
             >
                <HiZoomOut className="text-xl"/>
             </button>
             <div className="px-2 text-[10px] font-black text-white/50 uppercase tracking-tighter w-12 text-center border-x border-white/10">
                {Math.round(scale * 100)}%
             </div>
             <button 
                onClick={() => setScale(s => Math.min(s + 0.2, 2))} 
                className="p-3 sm:p-4 text-white hover:bg-white/10 rounded-full transition-colors"
             >
                <HiZoomIn className="text-xl"/>
             </button>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </AnimatePresence>
  );
}