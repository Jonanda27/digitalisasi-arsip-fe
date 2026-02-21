import React from 'react';
import bgImage from '../../../../assets/image10.png'; 

export default function ApprovalCard({ total = 5, onClick }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-slate-800 p-6 text-white shadow-lg transition-all duration-300 hover:shadow-blue-500/20">
      
      {/* --- BACKGROUND SECTION START --- */}

      {/* 1. The Background Image */}
      {/* object-cover ensures the image fills the space without stretching */}
      <img 
        src={bgImage}
        alt="Background pattern"
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-110"
      />

      {/* 2. Dark Blue Overlay */}
      {/* Crucial for text readability over an image. Creates a blue tint. */}
      <div className="absolute inset-0 bg-blue-900/70 mix-blend-multiply transition-all duration-500 group-hover:bg-blue-950/80"></div>
      
      {/* --- BACKGROUND SECTION END --- */}


      {/* Content (z-10 keeps it above the image and overlay) */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Header Section */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-bold tracking-tight text-white drop-shadow-sm">
              Persetujuan Akses
            </h3>
            {/* Notification Badge */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-bold animate-pulse shadow-lg shadow-green-500/40 border-[1.5px] border-white/20">
              {total}
            </div>
          </div>

          <p className="mt-4 text-[13.5px] leading-relaxed text-blue-100/90 font-medium drop-shadow-sm">
            Terdapat <span className="font-bold text-white underline decoration-blue-400 underline-offset-4">{total} permintaan</span> akses yang menunggu konfirmasi Anda. Tinjau dokumen untuk memberikan izin.
          </p>
        </div>

        {/* Action Button Section */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onClick}
            className="group/btn flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25 hover:border-white/50 active:scale-95 shadow-lg"
          >
            <span>Buka Persetujuan</span>
            <svg 
              className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}