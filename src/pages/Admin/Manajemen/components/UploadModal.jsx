import React, { useEffect, useRef } from "react";

export default function UploadModal({
  open,
  onClose,
  onPicked,
  onUpload,
  file,
  accept = ".pdf,.png,.jpg,.jpeg",
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const pick = () => inputRef.current?.click();

  const onChange = (e) => {
    const f = e.target.files?.[0];
    if (f) onPicked?.(f);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <div className="relative w-full max-w-[520px] rounded-2xl bg-white shadow-xl">
        <div className="border-b px-6 py-4 font-semibold">
          Upload File
        </div>

        <div className="px-6 py-5 space-y-3">
          <div
            onClick={pick}
            className="cursor-pointer rounded-xl border border-dashed px-5 py-10 text-center hover:bg-slate-50"
          >
            {file ? (
              <p className="text-sm text-slate-700">
                📄 {file.name}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Click untuk memilih file
              </p>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={onChange}
          />
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Batalkan
          </button>

          <button
            onClick={onUpload}
            disabled={!file}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
}
