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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 lg:grid-cols-4 lg:gap-4">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Tipe Dokumen</label>
          <select
            value={tipe}
            onChange={(e) => setTipe(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
          >
            <option value="">Semua</option>
            <option value="Surat">Surat</option>
            <option value="Surat Edaran">Surat Edaran</option>
            <option value="Peraturan">Peraturan</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-500">Akses</label>
          <select
            value={akses}
            onChange={(e) => setAkses(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
          >
            <option value="">Semua</option>
            <option value="umum">Umum</option>
            <option value="terbatas">Terbatas</option>
            <option value="rahasia">Rahasia</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-500">Urutkan</label>
          <select
            value={urutkan}
            onChange={(e) => setUrutkan(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
          >
            <option value="">Default</option>
            <option value="judul_asc">Judul (A-Z)</option>
            <option value="judul_desc">Judul (Z-A)</option>
            <option value="tahun_desc">Tahun (Terbaru)</option>
            <option value="tahun_asc">Tahun (Terlama)</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onApply}
            className="h-10 w-full rounded-lg bg-[#1F5EFF] px-4 text-sm font-medium text-white"
          >
            Terapkan Filter
          </button>
        </div>
      </div>

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
            placeholder="Cari dokumen"
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
