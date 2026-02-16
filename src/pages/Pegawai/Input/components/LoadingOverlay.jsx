import React from "react";

export default function LoadingOverlay({
  show,
  text = "Mengupload dokumen...",
}) {
  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 rounded-[1.5rem] bg-white p-2 pr-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100">
        
        {/* Spinner Container */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm shrink-0">
          <div className="w-6 h-6 border-[3px] border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
        </div>
        
        {/* Text Content */}
        <div className="min-w-[150px]">
          <h4 className="text-sm font-bold text-slate-900 leading-tight">
            Memproses...
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {text}
          </p>
        </div>

      </div>
    </div>
  );
}