import { HiOutlineAdjustments, HiOutlineSearch } from "react-icons/hi";

export default function FilterBar({ search, setSearch, status, setStatus, akses, setAkses, onApply }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Filter Selects */}
        {[
          { label: "Status", value: status, setter: setStatus, options: [{v:"pending", l:"Menunggu"}, {v:"approved", l:"Disetujui"}, {v:"rejected", l:"Ditolak"}] },
          { label: "Kerahasiaan", value: akses, setter: setAkses, options: [{v:"Umum", l:"Umum"}, {v:"Terbatas", l:"Terbatas"}, {v:"Rahasia", l:"Rahasia"}] }
        ].map((f, i) => (
          <div key={i} className="relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">
              {f.label}
            </label>
            <select
              value={f.value}
              onChange={(e) => f.setter(e.target.value)}
              className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none shadow-sm"
            >
              <option value="">Semua {f.label}</option>
              {f.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </div>
        ))}

        <div className="flex items-end">
          <button
            onClick={onApply}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <HiOutlineAdjustments className="text-lg" />
            Terapkan
          </button>
        </div>
      </div>

      <div className="w-full lg:w-80">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Pencarian</label>
        <div className="relative group">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onApply()}
            placeholder="Cari file..."
            className="w-full h-11 bg-white border border-slate-200 rounded-xl pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}