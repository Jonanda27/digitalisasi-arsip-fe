import { useState } from "react";
import { motion } from "framer-motion";

export default function FilterMetadataModal({ open, onClose, onApply }) {
  const [filters, setFilters] = useState({
    tahun: "",
    kerahasiaan: "",
    tipeDokumen: "",
    kategori: "" // Tambahkan state kategori
  });
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <h3 className="text-xl font-black text-slate-800 mb-6">Filter Metadata</h3>
          
          <div className="space-y-4">
            {/* Filter Kategori Dokumen */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori Dokumen</label>
              <select 
                name="kategori"
                value={filters.kategori}
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Kategori</option>
                <option value="SOP">SOP</option>
                <option value="Surat">Surat</option>
                <option value="Laporan">Laporan</option>
                <option value="Keuangan">Keuangan</option>
              </select>
            </div>

            {/* Filter Tahun */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tahun Dokumen</label>
              <select 
                name="tahun"
                value={filters.tahun}
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Tahun</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>

            {/* Filter Kerahasiaan */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tingkat Keamanan</label>
              <select 
                name="kerahasiaan"
                value={filters.kerahasiaan}
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
              >
                <option value="">Semua Akses</option>
                <option value="Umum">Umum</option>
                <option value="Terbatas">Terbatas</option>
                <option value="Rahasia">Rahasia</option>
              </select>
            </div>

            {/* Filter Tipe Dokumen */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipe Dokumen</label>
              <select 
                name="tipeDokumen"
                value={filters.tipeDokumen}
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
              >
                <option value="">Semua Tipe</option>
                <option value="Digital">Digital</option>
                <option value="Analog">Analog</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition">
              Batal
            </button>
            <button 
              onClick={() => onApply(filters)}
              className="flex-1 py-3 bg-[#1F5EFF] text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition active:scale-95"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
