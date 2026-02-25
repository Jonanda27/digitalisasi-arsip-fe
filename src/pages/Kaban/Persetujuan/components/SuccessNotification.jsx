import { useEffect } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";

// Tambahkan prop 'message'
export default function SuccessNotification({ show, onClose, message }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 rounded-[1.5rem] bg-white p-2 pr-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200 shrink-0">
          <FiCheckCircle size={24} />
        </div>
        
        <div className="min-w-[150px]">
          <h4 className="text-sm font-bold text-slate-900 leading-tight">Berhasil!</h4>
          {/* Gunakan prop message di sini, jika kosong tampilkan default */}
          <p className="text-[11px] text-slate-500">
            {message || "Data akun telah diperbarui."}
          </p>
        </div>

        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
          <FiX size={16} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}