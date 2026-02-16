export default function FilterBar({
  tipe,
  setTipe,
  akses,
  setAkses,
  urutkan,
  setUrutkan,
  search,
  setSearch,
  onApply,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      {/* kiri: filters */}
      

      {/* kanan: search input */}
      <div className="w-full lg:w-[420px]">
        <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
          >
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

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder=""
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
