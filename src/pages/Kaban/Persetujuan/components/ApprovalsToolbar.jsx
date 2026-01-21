export default function ApprovalsToolbar({ value, onChange, onClear }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-full max-w-[240px]">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {/* icon search */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M16.5 16.5 21 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none
          focus:border-[#1F5EFF] focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {value?.trim() ? (
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-[#1F5EFF] hover:opacity-80"
        >
          Cancel
        </button>
      ) : (
        <span className="text-sm text-transparent select-none">Cancel</span>
      )}
    </div>
  );
}
