import React, { useEffect, useRef, useState } from "react";

export default function UploadModal({
  open,
  onClose,
  onPicked,
  accept = ".pdf,.png,.jpg,.jpeg",
  multiple = false,
  isBundle = false, // Jika true, hanya bisa pilih FOLDER
}) {
  const inputRef = useRef(null);

  const [folderFiles, setFolderFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // esc close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // reset ketika dibuka
  useEffect(() => {
    if (open) {
      setFolderFiles([]);
      setSelectedFiles([]);
    }
  }, [open]);

  if (!open) return null;

  const pick = () => inputRef.current?.click();

  // =====================
  // FILTER VALID FILES
  // =====================
  const filterValidFiles = (files) => {
    const validExtensions = accept.split(",").map((ext) => ext.trim().toLowerCase());
    return files.filter((file) => {
      const ext = "." + file.name.split(".").pop().toLowerCase();
      return validExtensions.includes(ext);
    });
  };

  // =====================
  // HANDLE PICK
  // =====================
  const onChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (isBundle) {
      // Saring file dari folder agar hanya PDF/Gambar saja
      const validOnes = filterValidFiles(files);
      setFolderFiles(validOnes);
      // Otomatis pilih semua file dalam folder sebagai default
      setSelectedFiles(validOnes); 
    } else {
      if (files.length > 0) {
        onPicked?.(files[0]);
        onClose?.();
      }
    }
  };

  const toggleFile = (file) => {
    setSelectedFiles((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    );
  };

  const confirmBundle = () => {
    if (selectedFiles.length === 0) return;
    onPicked?.(selectedFiles);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* HEADER */}
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="text-[16px] font-semibold text-slate-900">
            {isBundle ? "Pilih Folder Bundle" : "Upload File"}
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-5">
          {/* DROPZONE */}
          <div
            onClick={pick}
            className="cursor-pointer rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center hover:bg-slate-50 transition"
          >
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F5EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isBundle ? (
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                ) : (
                  <>
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </>
                )}
              </svg>
            </div>

            <div className="text-[13px] font-medium text-slate-700">
              {isBundle ? "Klik untuk memilih Folder" : "Klik untuk memilih File"}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isBundle ? "Sistem akan mengambil semua file dokumen di dalam folder" : "Format: PDF, PNG, JPG"}
            </p>
          </div>

          {/* LIST FILE DALAM FOLDER */}
          {isBundle && folderFiles.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>File ditemukan ({folderFiles.length})</span>
                <span>{selectedFiles.length} terpilih</span>
              </div>
              <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-lg p-2 bg-slate-50">
                {folderFiles.map((file, idx) => {
                  const selected = selectedFiles.includes(file);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleFile(file)}
                      className={`cursor-pointer rounded-md border p-2 text-[12px] flex justify-between items-center transition ${
                        selected ? "border-blue-500 bg-white shadow-sm" : "border-transparent text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={selected} readOnly className="rounded" />
                        <span className="truncate max-w-[200px]">{file.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HIDDEN INPUT */}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            // ATRIBUT KUNCI
            webkitdirectory={isBundle ? "" : undefined}
            directory={isBundle ? "" : undefined}
            multiple={isBundle} 
            onChange={onChange}
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] rounded-lg border border-slate-200 px-4 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </button>

          {isBundle && (
            <button
              type="button"
              disabled={selectedFiles.length === 0}
              onClick={confirmBundle}
              className="h-[36px] rounded-lg bg-[#1F5EFF] px-4 text-[12px] font-semibold text-white hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Konfirmasi {selectedFiles.length} File
            </button>
          )}
        </div>
      </div>
    </div>
  );
}