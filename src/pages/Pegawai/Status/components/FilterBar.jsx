import { useState } from "react";
import { HiMagnifyingGlass, HiOutlineAdjustmentsHorizontal, HiXMark } from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";

export default function FilterBar({ status, setStatus, akses, setAkses, search, setSearch, onApply }) {
  const [isOpen, setIsOpen] = useState(false);

  // Local State agar user bisa memilih dulu tanpa langsung memicu API
  const [localSearch, setLocalSearch] = useState(search);
  const [localStatus, setLocalStatus] = useState(status);
  const [localAkses, setLocalAkses] = useState(akses);

  const handleApply = () => {
    // 1. Update Global State (untuk tampilan UI)
    setSearch(localSearch);
    setStatus(localStatus);
    setAkses(localAkses);
    
    // 2. Jalankan onApply dengan data lokal terbaru (menghindari delay state)
    onApply(localSearch, localStatus, localAkses); 
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleApply();
  };

  // Pastikan value (v) di sini persis sama dengan yang disimpan di database
  const filterOptions = [
    { 
      label: "Status", 
      val: localStatus, 
      set: setLocalStatus, 
      opt: [
        { v: "pending", l: "Menunggu" }, 
        { v: "approved", l: "Disetujui" }, 
        { v: "rejected", l: "Ditolak" }
      ] 
    },
    { 
      label: "Kerahasiaan", 
      val: localAkses, 
      set: setLocalAkses, 
      opt: [
        { v: "Umum", l: "Umum" }, 
        { v: "Terbatas", l: "Terbatas" }, 
        { v: "Rahasia", l: "Rahasia" }
      ] 
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1 group">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors text-xl" />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari dokumen..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
          />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden h-12 w-12 flex items-center justify-center rounded-2xl border transition-all active:scale-90 ${
            isOpen ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-slate-200 text-slate-600 shadow-sm"
          }`}
        >
          <HiOutlineAdjustmentsHorizontal className="text-2xl" />
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-3 gap-4 items-end">
        {filterOptions.map((f, i) => (
          <div key={i} className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{f.label}</label>
            <div className="relative">
              <select
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-all appearance-none shadow-sm cursor-pointer"
              >
                <option value="">Semua {f.label}</option>
                {f.opt.map((o) => (<option key={o.v} value={o.v}>{o.l}</option>))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-300">▼</div>
            </div>
          </div>
        ))}
        <button
          onClick={handleApply}
          className="h-11 w-full rounded-xl bg-blue-600 text-[11px] font-black uppercase tracking-widest text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <HiOutlineAdjustmentsHorizontal className="text-lg" /> Terapkan
        </button>
      </div>

      {/* Mobile View Popover */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden">
            <div className="fixed inset-0 z-[160] bg-slate-900/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} className="absolute left-0 right-0 mx-auto top-20 z-[170] w-[90%] max-w-[320px] rounded-[2.5rem] border border-slate-100 bg-white p-7 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter</h4>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400"><HiXMark size={18} /></button>
              </div>
              <div className="space-y-5">
                {filterOptions.map((f, i) => (
                  <div key={i}>
                    <label className="mb-1.5 block text-[9px] font-black uppercase text-slate-500 ml-1">{f.label}</label>
                    <div className="relative">
                      <select value={f.val} onChange={(e) => f.set(e.target.value)} className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 outline-none appearance-none">
                        <option value="">Semua</option>
                        {f.opt.map((o) => (<option key={o.v} value={o.v}>{o.l}</option>))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-300">▼</div>
                    </div>
                  </div>
                ))}
                <button onClick={handleApply} className="w-full mt-2 py-4 rounded-2xl bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all shadow-lg shadow-blue-100">
                  Terapkan Filter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}