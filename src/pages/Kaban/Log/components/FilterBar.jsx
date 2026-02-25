import { FiSearch, FiX } from "react-icons/fi";

export default function LogSearch({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <div className="relative group w-full">
        {/* Ikon Pencarian */}
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
        
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari aktivitas atau user..."
          // Penjelasan Perubahan:
          // w-full: Agar input mengambil ruang penuh pada mobile
          // md:w-[320px]: Memberikan lebar tetap saat di layar medium (tablet/laptop) ke atas
          // h-12: Sedikit lebih tinggi agar lebih mudah di-tap di mobile (touch-friendly)
          className="h-12 w-full md:w-[320px] rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
        />

        {/* Tombol Clear (X) */}
        {value && (
          <button 
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-full transition-colors z-10"
          >
            <FiX className="text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
}