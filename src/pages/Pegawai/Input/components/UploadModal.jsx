import React, { useEffect, useRef } from "react";

export default function UploadModal({
  open,
  onClose,
  onPicked,
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

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onPicked?.(f);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
        aria-label="Close"
      />

      <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="text-[16px] font-semibold text-slate-900">
            Upload File
          </div>
        </div>

        <div className="px-6 py-5">
          <div
            onClick={pick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className={[
              "cursor-pointer rounded-xl border border-dashed border-slate-200",
              "px-5 py-10 text-center hover:bg-slate-50 transition",
            ].join(" ")}
          >
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
              {/* cloud icon */}
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
              Click or drag file to this area to upload
            </div>
          </div>

          <div className="mt-4 text-[12px] text-slate-400">
            Hanya menerima file dalam format .pdf, .png, .jpg, dan .jpeg
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={onChange}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] rounded-lg border border-slate-200 px-4 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Batalkan
          </button>
          <button
            type="button"
            onClick={pick}
            className="h-[36px] rounded-lg bg-[#1F5EFF] px-4 text-[12px] font-semibold text-white hover:brightness-95 transition"
          >
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
}
