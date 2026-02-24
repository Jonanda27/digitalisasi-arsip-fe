import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";

export default function FilterMetadataModal({ open, onClose, onApply }) {
  const [filters, setFilters] = useState({
    tahun: "",
    kerahasiaan: "",
    tipeDokumen: "",
    kategori: ""
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    const emptyFilters = { tahun: "", kerahasiaan: "", tipeDokumen: "", kategori: "" };
    setFilters(emptyFilters);
    onApply(emptyFilters);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/20"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Filter Arsip</h3>
                  <p className="text-xs font-medium text-slate-400">Persempit pencarian dokumen Anda</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <HiX className="text-xl" />
                </button>
              </div>
              
              {/* Form Body */}
              <div className="space-y-6">
                {/* Kategori */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Dokumen</label>
                  <select 
                    name="kategori"
                    value={filters.kategori}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="">Semua Kategori</option>
                    <option value="SOP">Standard Operating Procedure (SOP)</option>
                    <option value="Surat">Surat Menyurat</option>
                    <option value="Laporan">Laporan Kegiatan</option>
                    <option value="Keuangan">Dokumen Keuangan</option>
                  </select>
                </div>

                {/* Tahun & Akses */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tahun</label>
                    <select 
                      name="tahun"
                      value={filters.tahun}
                      onChange={handleChange}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-700"
                    >
                      <option value="">Semua</option>
                      {[2026, 2025, 2024, 2023, 2022].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keamanan</label>
                    <select 
                      name="kerahasiaan"
                      value={filters.kerahasiaan}
                      onChange={handleChange}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-700"
                    >
                      <option value="">Semua</option>
                      <option value="Umum">Umum</option>
                      <option value="Terbatas">Terbatas</option>
                      <option value="Rahasia">Rahasia</option>
                    </select>
                  </div>
                </div>

                {/* Tipe Dokumen (Segmented Control) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Format Media</label>
                  <div className="flex gap-2">
                    {['Digital', 'Analog'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFilters({...filters, tipeDokumen: filters.tipeDokumen === type ? "" : type})}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${
                          filters.tipeDokumen === type 
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30" 
                            : "bg-white border-slate-200 text-slate-500 hover:border-blue-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-10">
                <button 
                  onClick={handleReset} 
                  className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition text-sm"
                >
                  Reset
                </button>
                <button 
                  onClick={() => onApply(filters)}
                  className="flex-[2] py-4 bg-[#1F5EFF] text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition active:scale-95 text-sm uppercase tracking-wider"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}