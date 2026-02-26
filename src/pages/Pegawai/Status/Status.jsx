import { useEffect, useContext, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import StatusBanner from "./components/StatusBanner";
import FilterBar from "./components/FilterBar";
import RequestTable from "./components/RequestTable";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import { API } from "../../../global/api";

export default function Status() {
  const { setTopbar } = useContext(TopbarContext);
  const [dataRaw, setDataRaw] = useState([]);
  const [loading, setLoading] = useState(false);

  // State Utama (untuk sinkronisasi UI)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [aksesFilter, setAksesFilter] = useState("");

  useEffect(() => {
    setTopbar({ title: "Status Permintaan", showSearch: false });
  }, [setTopbar]);

  /**
   * Fungsi Fetch Data yang Diperbaiki
   * Menerima argumen opsional agar filter instan (tanpa delay state)
   */
  const fetchStatus = useCallback(async (fSearch = search, fStatus = statusFilter, fAkses = aksesFilter) => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;

      const params = new URLSearchParams();
      // Gunakan nilai dari argumen fungsi, bukan dari state langsung
      if (fSearch) params.append("q", fSearch);
      if (fStatus) params.append("status", fStatus);
      if (fAkses) params.append("akses", fAkses);

      const res = await axios.get(`${API}/access-requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped = res.data.map((r) => ({
        id: r._id,
        namaFile: r.file?.namaFile || "File Tidak Ditemukan",
        tanggalAjukan: r.createdAt,
        keperluan: r.keperluan || "Tanpa keperluan khusus.",
        akses: r.file?.kerahasiaan || "Umum",
        status: r.status === "pending" ? "menunggu" : r.status === "approved" ? "disetujui" : "ditolak",
        tanggalSetuju: r.approvedAt || null,
        masaAkses: r.status === "approved" ? `${r.lamaAkses} Hari` : null,
      }));

      setDataRaw(mapped);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setLoading(false); 
    }
  }, [search, statusFilter, aksesFilter]);

  // Load awal
  useEffect(() => {
    fetchStatus();
  }, []); 

  return (
    <div className="min-h-screen bg-[#F6F8FC] bg-gradient-to-r  from-blue-100 via-blue-50/30 to-white 
                    md:from-transparent md:via-transparent md:to-transparent p-4 md:p-8 lg:p-10">
      <div className="max-w-[1400px] mx-auto space-y-4 md:space-y-8">
        
        <StatusBanner />

        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-5 md:p-10 border-b border-slate-100 bg-slate-50/30 shrink-0">
            <FilterBar 
              search={search} setSearch={setSearch}
              status={statusFilter} setStatus={setStatusFilter}
              akses={aksesFilter} setAkses={setAksesFilter}
              onApply={fetchStatus} 
            />
          </div>

          <div className="overflow-y-auto custom-scrollbar h-[550px] bg-white relative">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-40 text-center flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memproses Data...</p>
                </motion.div>
              ) : dataRaw.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-32 text-center px-10 flex flex-col items-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                      <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                   </div>
                   <h3 className="text-slate-800 font-bold text-lg">Tidak Ada Riwayat</h3>
                   <p className="text-slate-400 text-xs">Coba ubah filter atau cari kata kunci lain.</p>
                </motion.div>
              ) : (
                <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <RequestTable data={dataRaw} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="py-4 px-8 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center shrink-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total: {dataRaw.length} Permintaan</p>
            <div className="flex gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-200" /><div className="w-4 h-1.5 rounded-full bg-blue-500" /><div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}