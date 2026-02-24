import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiZoomIn, HiZoomOut, HiArrowUp } from "react-icons/hi";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function PdfPreviewModal({ open, filePath, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      if (width < 640) setContainerWidth(width * 0.95);
      else if (width < 1024) setContainerWidth(width * 0.85);
      else setContainerWidth(800);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Memantau scroll untuk memunculkan tombol tutup tambahan
  const handleScroll = (e) => {
    if (e.target.scrollTop > 200) setShowBackToTop(true);
    else setShowBackToTop(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-slate-900/95 backdrop-blur-md p-0 sm:p-4"
      >
        {/* TOMBOL TUTUP FLOATING (Sangat Penting untuk Mobile) */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={onClose}
          className="fixed top-4 right-4 z-[10000] p-3 bg-red-500 text-white rounded-full shadow-2xl active:scale-90 sm:hidden flex items-center justify-center border-2 border-white/20"
        >
          <HiX className="text-2xl" />
        </motion.button>

        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-[#F1F5F9] w-full sm:rounded-[2.5rem] h-[100vh] sm:h-[90vh] max-w-5xl flex flex-col overflow-hidden relative"
        >
          {/* HEADER DENGAN SAFE AREA UNTUK MOBILE */}
          <div className="bg-white/90 backdrop-blur-xl px-6 pt-12 pb-5 sm:pt-6 sm:pb-6 border-b border-slate-200 flex justify-between items-center shrink-0 z-50">
            <div className="flex flex-col">
              <h3 className="text-base font-black text-slate-800 tracking-tight">Dokumen Preview</h3>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.15em]">
                {numPages ? `${numPages} Halaman Terdeteksi` : "Memproses File..."}
              </p>
            </div>

            {/* CONTROLS DESKTOP & IPAD */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-slate-100 rounded-2xl p-1">
                <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2 hover:bg-white rounded-xl text-slate-600"><HiZoomOut /></button>
                <span className="px-3 text-xs font-black text-slate-500">{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(s => Math.min(s + 0.2, 2))} className="p-2 hover:bg-white rounded-xl text-slate-600"><HiZoomIn /></button>
              </div>
              
              <button 
                onClick={onClose} 
                className="hidden sm:flex p-3 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all font-bold text-sm items-center gap-2"
              >
                <HiX className="text-lg" />
                Tutup
              </button>
            </div>
          </div>

          {/* AREA PDF DENGAN DETEKSI SCROLL */}
          <div 
            onScroll={handleScroll}
            className="overflow-y-auto flex-1 p-4 sm:p-10 custom-scrollbar scroll-smooth"
          >
            <div className="flex flex-col items-center">
              <Document 
                file={filePath} 
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={
                  <div className="flex flex-col items-center py-32">
                    <div className="w-12 h-12 border-[5px] border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Membuka Dokumen...</p>
                  </div>
                }
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div 
                    key={`page_${index + 1}`} 
                    className="mb-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden bg-white"
                  >
                    <Page 
                      pageNumber={index + 1} 
                      width={containerWidth * scale} 
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  </div>
                ))}
              </Document>
            </div>
          </div>

          {/* TOMBOL ZOOM FLOATING UNTUK MOBILE */}
          <div className="sm:hidden absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-full p-2 shadow-2xl z-50">
             <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-4 text-white"><HiZoomOut className="text-xl"/></button>
             <div className="h-4 w-[1px] bg-white/20 mx-2" />
             <button onClick={() => setScale(s => Math.min(s + 0.2, 1.5))} className="p-4 text-white"><HiZoomIn className="text-xl"/></button>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </AnimatePresence>
  );
}