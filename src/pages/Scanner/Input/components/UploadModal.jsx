import React, { useEffect, useRef, useState } from "react";

export default function UploadModal({
  open,
  onClose,
  onPicked,
  accept = ".pdf,.png,.jpg,.jpeg",
  multiple = false,
  isBundle = false,
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
  // HANDLE PICK
  // =====================
  const onChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (isBundle) {
      setFolderFiles(files);
    } else {
      if (files.length > 0) onPicked?.(files[0]);
    }
  };

  // =====================
  // SELECT FILE
  // =====================
  const toggleFile = (file) => {
    setSelectedFiles((prev) => {
      if (prev.includes(file)) {
        return prev.filter((f) => f !== file);
      }
      return [...prev, file];
    });
  };

  const confirmBundle = () => {
    if (selectedFiles.length === 0) return;
    onPicked?.(selectedFiles);
    onClose?.();
  };

  // =====================
  // DRAG DROP
  // =====================
  const onDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    if (isBundle) {
      setFolderFiles(files);
    } else {
      onPicked?.(files[0]);
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      {/* overlay */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      {/* modal */}
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-xl">

        {/* HEADER */}
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="text-[16px] font-semibold text-slate-900">
            {isBundle ? "Pilih Folder Dokumen" : "Upload File"}
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-5">

          {/* DROPZONE */}
          <div
            onClick={pick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="cursor-pointer rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center hover:bg-slate-50 transition"
          >
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
              {/* ICON */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 17l4-4 4 4"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 13v7"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M20 16.5a4.5 4.5 0 0 0-1.8-8.6A5.5 5.5 0 0 0 7 9.2"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M6 16.5a3.5 3.5 0 1 1 .6-6.95"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="text-[13px] text-slate-600">
              {isBundle
                ? "Click atau drag folder / files ke area ini"
                : "Click atau drag file ke area ini"}
            </div>
          </div>

          {/* INFO */}
          <div className="mt-4 text-[12px] text-slate-400">
            Hanya menerima file dalam format .pdf, .png, .jpg, dan .jpeg
          </div>

          {/* LIST FILE BUNDLE */}
          {isBundle && folderFiles.length > 0 && (
            <div className="mt-4 max-h-[240px] overflow-y-auto space-y-2 border rounded-lg p-3">

              {folderFiles.map((file, idx) => {
                const selected = selectedFiles.includes(file);

                return (
                  <div
                    key={idx}
                    onClick={() => toggleFile(file)}
                    className={[
                      "cursor-pointer rounded-lg border px-3 py-2 text-[12px] flex justify-between items-center",
                      selected
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span>{file.name}</span>
                    <span className="text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* HIDDEN INPUT */}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            multiple={isBundle || multiple}
            webkitdirectory={isBundle ? "true" : undefined}
            directory={isBundle ? "true" : undefined}
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
            Batalkan
          </button>

          {isBundle && selectedFiles.length > 0 && (
            <button
              type="button"
              onClick={confirmBundle}
              className="h-[36px] rounded-lg bg-[#1F5EFF] px-4 text-[12px] font-semibold text-white hover:brightness-95 transition"
            >
              Upload Dokumen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
