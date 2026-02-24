import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import FilterBar from "./components/FilterBar";
import LogTable from "./components/LogTable";
import LogBanner from "./components/LogBanner";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import { API } from "../../../global/api";

export default function PegawaiLog() {
  const { setTopbar } = useContext(TopbarContext);
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sinkronisasi Judul Topbar
  useEffect(() => {
    setTopbar({ title: "Log Aktivitas", showSearch: false });
  }, [setTopbar]);

  // Fungsi Fetch Data
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(`${API}/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Gagal mengambil logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Logika Pencarian (Client-side)
  const filteredData = useMemo(() => {
    if (!search) return logs;
    const q = search.toLowerCase();
    return logs.filter((d) =>
      d.kategori?.toLowerCase().includes(q) ||
      d.aktivitas?.toLowerCase().includes(q)
    );
  }, [search, logs]);

  // Hitung jumlah log hari ini untuk statistik tambahan di footer
  const logsHariIni = useMemo(() => {
    const today = new Date().toDateString();
    return logs.filter(log => new Date(log.waktu).toDateString() === today).length;
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 md:pb-20">
      {/* 1. Banner Section */}
      <div className="px-4 md:px-8 pt-6 md:pt-10">
        <div className="mx-auto w-full max-w-[1400px]">
          <LogBanner />
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8 mt-6">
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* Section: Header & Search */}
          <div className="p-6 md:p-10 border-b border-slate-100 bg-slate-50/30">
            <FilterBar search={search} setSearch={setSearch} />
          </div>

          {/* Section: List Area */}
          <div className="relative flex-1 bg-white">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="py-40 text-center flex flex-col items-center gap-4"
                >
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-slate-100 rounded-full" />
                    <div className="absolute top-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.25em]">Sinkronisasi Audit...</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="content"
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 md:p-8 lg:p-10"
                >
                  {/* KONTAINER KHUSUS MOBILE: Menampilkan sekitar 4 data sebelum scroll */}
                  <div className="max-h-[580px] md:max-h-[700px] lg:max-h-none overflow-y-auto lg:overflow-visible custom-scrollbar pr-1">
                    <LogTable data={filteredData} />
                  </div>

                  {/* Efek Fade Out di bagian bawah (Hanya Mobile/Tablet) */}
                  <div className="pointer-events-none absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white via-white/80 to-transparent lg:hidden z-10" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section: Footer Info - DIUBAH MENJADI STATISTIK LOG */}
          <div className="p-6 md:px-10 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center shrink-0">
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktivitas Hari Ini</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${logsHariIni > 0 ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-[11px] font-bold text-slate-600">
                  {logsHariIni} Log Baru
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Keseluruhan</p>
              <div className="flex items-center justify-end gap-2">
                 <span className="text-sm font-black text-slate-800">{filteredData.length}</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Log</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}