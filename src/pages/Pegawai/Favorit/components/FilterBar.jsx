import { HiOutlineSearch, HiOutlineAdjustments } from "react-icons/hi";

export default function FilterBar({ tipe, setTipe, akses, setAkses, urutkan, setUrutkan, search, setSearch, onApply }) {
  const handleKeyDown = (e) => { if (e.key === "Enter") onApply(); };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 flex-1">
        {/* Dropdowns */}
        {[
          { label: "Tipe", val: tipe, set: setTipe, opt: ["Analog", "Digital"] },
          { label: "Akses", val: akses, set: setAkses, opt: ["Umum", "Terbatas", "Rahasia"] },
          { label: "Urutan", val: urutkan, set: setUrutkan, opt: [
            {v: "judul_asc", l: "A-Z"}, {v: "judul_desc", l: "Z-A"}, {v: "tahun_desc", l: "Terbaru"}
          ]}
        ].map((f, i) => (
          <div key={i}>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              {f.label}
            </label>
            <select
              value={f.val}
              onChange={(e) => f.set(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none shadow-sm"
            >
              <option value="">Semua {f.label}</option>
              {f.opt.map(o => (
                <option key={typeof o === 'string' ? o : o.v} value={typeof o === 'string' ? o : o.v}>
                  {typeof o === 'string' ? o : o.l}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="flex items-end">
          <button
            onClick={onApply}
            className="h-11 w-full rounded-xl bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <HiOutlineAdjustments className="text-lg" />
            Terapkan
          </button>
        </div>
      </div>

      <div className="w-full lg:w-[350px]">
        <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pencarian Cepat</label>
        <div className="relative group">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari nama dokumen..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}