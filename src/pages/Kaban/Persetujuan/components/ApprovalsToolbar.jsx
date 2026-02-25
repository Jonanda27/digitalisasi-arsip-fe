export default function ApprovalsToolbar({ value, onChange, onClear }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="relative w-full sm:max-w-[300px]">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2.5" />
            <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </span>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari pemohon atau dokumen..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 shadow-sm outline-none
          focus:border-[#1F5EFF] focus:ring-4 focus:ring-blue-500/5 transition-all"
        />
      </div>

      {value?.trim() && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-bold text-[#1F5EFF] hover:opacity-80 px-2"
        >
          Reset Pencarian
        </button>
      )}
    </div>
  );
}