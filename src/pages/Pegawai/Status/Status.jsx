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

  // Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [aksesFilter, setAksesFilter] = useState("");

  useEffect(() => {
    setTopbar({ title: "Status Permintaan", showSearch: false });
  }, [setTopbar]);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;

      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (statusFilter) params.append("status", statusFilter);
      if (aksesFilter) params.append("akses", aksesFilter);

      const res = await axios.get(`${API}/access-requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped = res.data.map((r) => ({
        id: r._id,
        namaFile: r.file?.namaFile || "-",
        tanggalAjukan: r.createdAt,
        keperluan: r.keperluan,
        akses: r.file?.kerahasiaan || "-",
        status: r.status === "pending" ? "menunggu" : r.status === "approved" ? "disetujui" : "ditolak",
        tanggalSetuju: r.approvedAt || null,
        masaAkses: r.status === "approved" ? `${r.lamaAkses} Hari` : null,
      }));

      setDataRaw(mapped);
    } catch (err) {
      console.error("Gagal ambil status:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, aksesFilter]);

  useEffect(() => { fetchStatus(); }, []);

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-6 lg:p-0">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
      <StatusBanner />

        {/* Filter & Table Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/30">
            <FilterBar 
              search={search} setSearch={setSearch}
              status={statusFilter} setStatus={setStatusFilter}
              akses={aksesFilter} setAkses={setAksesFilter}
              onApply={fetchStatus} 
            />
          </div>

          <div className="p-4 sm:p-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="py-20 text-center flex flex-col items-center gap-3"
                >
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Memuat Data...</p>
                </motion.div>
              ) : dataRaw.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="py-20 text-center text-slate-400 italic"
                >
                  Tidak ada riwayat permintaan ditemukan.
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <RequestTable data={dataRaw} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}