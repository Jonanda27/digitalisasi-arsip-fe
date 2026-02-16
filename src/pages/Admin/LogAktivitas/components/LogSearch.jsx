import { FiSearch, FiX } from "react-icons/fi";

export default function LogSearch({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative group">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari aktivitas atau user..."
          className="h-11 w-[300px] rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
        />
        {value && (
          <button 
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <FiX className="text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
}