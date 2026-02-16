import { useContext, useEffect, useState } from "react";
import WelcomeBanner from "../Log/components/LogBanner";
import axios from "axios";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth"; // Pastikan path import benar
import LogTable from "./components/LogTable";
import { API } from "../../../global/api";

export default function KabanLog() {
  const topbarCtx = useContext(TopbarContext);
  const [logs, setLogs] = useState([]); // State untuk menampung data dari API
  const [loading, setLoading] = useState(true);

  // 1. Sinkronisasi Topbar
  useEffect(() => {
    const setTopbar = topbarCtx?.setTopbar;
    if (!setTopbar) return;

    setTopbar((p) => ({
      ...p,
      title: "Log Aktivitas",
      showSearch: false,
    }));
  }, [topbarCtx?.setTopbar]);

  // 2. Fetch Data dari API Backend
  useEffect(() => {
    const fetchAllLogs = async () => {
      try {
        setLoading(true);
        const token = getToken();
        // Memanggil endpoint /all yang kita buat tadi
       const res = await axios.get(`${API}/logs/all`, {
  headers: { Authorization: `Bearer ${token}` },
});

        // Map data dari MongoDB ke format yang diharapkan tabel FE
        const formattedData = res.data.map((log) => ({
          id: log._id, // MongoDB menggunakan _id
          waktu: new Date(log.waktu).toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB",
          user: {
            nama: log.userId?.nama || "Sistem", // Mengambil hasil populate userId
            detail: log.userId?.email || "Sistem Lokal",
          },
          kategori: log.kategori,
          aktivitas: log.aktivitas,
          status: log.status,
        }));

        setLogs(formattedData);
      } catch (err) {
        console.error("Gagal mengambil log:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-0">
      {/* Banner Identitas Halaman */}
      <WelcomeBanner userName="Log Auditor" />

      {loading ? (
        <div className="flex h-64 items-center justify-center bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <span className="mt-4 font-medium text-slate-500">Sinkronisasi data aktivitas...</span>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
           <LogTable data={logs} />
        </div>
      )}
    </div>
  );
}