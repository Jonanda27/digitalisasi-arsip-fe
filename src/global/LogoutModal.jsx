import React, { useEffect } from "react";

export default function LogoutModal({ open, onClose, onConfirm }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Modal */}
      <div className="relative w-full max-w-[520px] rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <h2 className="text-[18px] font-semibold text-slate-900 leading-none">
              Logout
            </h2>
            <p className="mt-2 text-[14px] text-slate-500">
              Apakah anda yakin ingin keluar dari aplikasi E-Arsip?
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 transition"
            style={{ marginTop: 0 }} // optional, biar ga ketarik turun
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-5 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="h-[40px] rounded-[8px] border border-slate-200 px-5 text-[14px] font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Batalkan
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-[40px] rounded-[8px] bg-[#1F5EFF] px-6 text-[14px] font-semibold text-white hover:brightness-95 transition"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}
