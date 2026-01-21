import iconSearch from "../icons/search.svg";

export default function LogSearch({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-[260px]">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search"
          className="
            h-[38px] w-full rounded-[10px]
            border border-slate-200 bg-white
            pl-10 pr-4 text-[12px] text-slate-700
            shadow-md
            outline-none
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            transition-shadow
          "
        />

        <img
          src={iconSearch}
          alt=""
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 opacity-50"
        />
      </div>

      {value && (
        <button
          onClick={() => onChange("")}
          className="text-[12px] font-medium text-blue-600 hover:underline"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
