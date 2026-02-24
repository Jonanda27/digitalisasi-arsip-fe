export default function FilterBar({ search, setSearch }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">Aktivitas Terbaru</h3>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">Pantau log secara real-time</p>
      </div>

      <div className="relative w-full md:w-[350px] group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2.5" />
            <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari aktivitas atau kategori..."
          className="w-full h-12 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}