import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import FilterBar from "./components/FilterBar";
import LogTable from "./components/LogTable";
import LogBanner from "./components/LogBanner"; // Import banner baru
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import { API } from "../../../global/api";

export default function PegawaiLog() {
  const { setTopbar } = useContext(TopbarContext);
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTopbar({ title: "Log Aktivitas", showSearch: false });
    fetchLogs();
  }, [setTopbar]);

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

  const filteredData = useMemo(() => {
    if (!search) return logs;
    const q = search.toLowerCase();
    return logs.filter((d) =>
      d.kategori.toLowerCase().includes(q) ||
      d.aktivitas.toLowerCase().includes(q)
    );
  }, [search, logs]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-0">
      <div className="mx-auto w-full max-w-[1400px]">
        <LogBanner />

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
          {/* Section Filter */}
          <div className="p-8 border-b border-slate-100 bg-slate-50/30">
            <FilterBar search={search} setSearch={setSearch} />
          </div>

          {/* Section Table */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="py-20 text-center flex flex-col items-center gap-3"
                >
                  <div className="w-10 h-10 border-4 border-slate-800 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Sinkronisasi Audit...</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <LogTable data={filteredData} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}