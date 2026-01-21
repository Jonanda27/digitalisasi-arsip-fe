import React from "react";

// icons
import scanIcon from "../icons/mulai-scan.svg";
import fileIcon from "../icons/file.svg";

export default function EmptyState({ icon, onScan, onPickFile }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center">
      {/* Icon dokumen */}
      <img
        src={icon}
        alt=""
        className="h-14 w-14 opacity-80"
        draggable="false"
      />

      <div className="mt-5 text-[18px] font-semibold text-slate-900">
        Belum Ada Dokumen
      </div>

      <div className="mt-2 max-w-[460px] text-center text-[13px] leading-6 text-slate-400">
        Pastikan scanner sudah menyala dan dokumen sudah diletakkan pada mesin scanner.
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-4">
        {/* Mulai Scanning */}
        <button
          type="button"
          onClick={onScan}
          className="
            flex items-center gap-2
            h-[40px] rounded-xl
            bg-[#2563EB] px-5
            text-[13px] font-semibold text-white
            shadow-sm hover:brightness-95 transition
          "
        >
          <img
            src={scanIcon}
            alt=""
            className="h-4 w-4"
            draggable="false"
          />
          Mulai Scanning
        </button>

        {/* Pilih File Lokal */}
        <button
          type="button"
          onClick={onPickFile}
          className="
            flex items-center gap-2
            h-[40px] rounded-xl
            bg-[#F59E0B] px-5
            text-[13px] font-semibold text-white
            shadow-sm hover:brightness-95 transition
          "
        >
          <img
            src={fileIcon}
            alt=""
            className="h-4 w-4"
            draggable="false"
          />
          Pilih File Lokal
        </button>
      </div>
    </div>
  );
}
