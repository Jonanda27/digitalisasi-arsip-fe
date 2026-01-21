export default function SearchHeader({ query, setQuery }) {
  return (
    <div className="mb-5">
      {/* judul udah dari Topbar, jadi di sini gak perlu */}

      <div className="mt-3 flex w-full max-w-[520px] items-center gap-2">
        <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari dokumen"
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
