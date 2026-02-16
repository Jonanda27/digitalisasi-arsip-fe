import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

// FIX 1: Use a CDN link that dynamically matches the version of your installed pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Optional: Add standard CSS for react-pdf to prevent styling glitches
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function PdfPreviewModal({ open, filePath, onClose }) {
  const [numPages, setNumPages] = useState(null);

  if (!open) return null;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-[90%] max-w-4xl h-[90vh] flex flex-col p-4">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h3 className="text-lg font-semibold">Preview PDF</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-auto flex-1 flex flex-col items-center bg-gray-100 rounded-lg p-4">
          {filePath ? (
            <Document 
              file={filePath} 
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<p>Loading PDF...</p>}
            >
              {/* FIX 2: Added a unique key and wrapped in a div for better spacing */}
              {Array.from(new Array(numPages), (el, index) => (
                <div key={`page_container_${index + 1}`} className="mb-4 shadow-lg">
                  <Page 
                    pageNumber={index + 1} 
                    width={window.innerWidth > 800 ? 750 : window.innerWidth * 0.8} 
                    renderAnnotationLayer={false} // Disable if not needed to avoid extra errors
                    renderTextLayer={false}       // Disable if you only want an image preview
                  />
                </div>
              ))}
            </Document>
          ) : (
            <p>File tidak tersedia</p>
          )}
        </div>
      </div>
    </div>
  );
}