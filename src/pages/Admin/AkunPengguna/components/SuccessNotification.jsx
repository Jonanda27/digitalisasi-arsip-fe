import { useEffect } from "react";

export default function SuccessNotification({ show, onClose }) {
  // Logika untuk menutup otomatis setelah 3 detik
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    // Mengubah justify-center & items-center menjadi items-start untuk posisi atas
    <div className="fixed inset-0 z-[100] flex justify-center items-start pt-20 pointer-events-none">
      
      {/* Container Notifikasi - Menambahkan pointer-events-auto agar tombol close bisa diklik */}
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl ring-1 ring-slate-200 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
        
        {/* Tombol X (Close) */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Ikon Centang Hijau */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Teks Pesan */}
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Akun Berhasil Ditambahkan!
          </h2>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed px-4">
            Akun baru berhasil ditambahkan. Silakan gunakan kredensial untuk masuk ke sistem.
          </p>
        </div>
      </div>
    </div>
  );
}