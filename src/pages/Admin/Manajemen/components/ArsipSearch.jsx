import { Search, X } from "lucide-react";
import bgsearchsvg from "../icons/bgsearch.svg";
import filtersvg from "../icons/filter.svg";

export default function ArsipSearch({
  value,
  onChange,
  onSubmit,
  onClear,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-[420px] h-12 rounded-full bg-white shadow-sm overflow-hidden">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit?.();
          }}
          placeholder="Cari dokumen"
          className="w-full h-full pl-5 pr-32 text-sm text-gray-700 placeholder-gray-400 focus:outline-none relative z-10"
        />

        <img
          src={bgsearchsvg}
          alt=""
          className="absolute top-[-6px] right-[-16px] h-[140%] w-[150px] object-cover pointer-events-none z-0"
        />

        {/* SEARCH */}
        <button
          type="button"
          onClick={onSubmit}
          className="absolute right-10 top-1/2 -translate-y-1/2 text-white z-20"
        >
          <Search size={18} />
        </button>

        {/* CLEAR */}
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white z-20"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
        <img src={filtersvg} alt="Filter" className="w-12 h-10" />
      </button>
    </div>
  );
}
