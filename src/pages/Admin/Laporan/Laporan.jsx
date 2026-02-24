import { useContext, useEffect, useState } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";
import WelcomeBanner from "./components/WelcomeBanner";
import axios from "axios";
import { API } from "../../../global/api";
import { motion } from "framer-motion";

// Komponen UI
import StatCard from "./components/CardStat";
import RekapBidangTable from "./components/RekapBidangTable";
import ActivityLogTable from "./components/RekapPengguna";

// Service Ekspor
import { exportToPDF } from "../../Admin/Laporan/utils/reportService";

export default function AdminLaporan() {
  const topbarCtx = useContext(TopbarContext);

  const [reportData, setReportData] = useState([]);
  const [ocrStats, setOcrStats] = useState(0);
  const [totalDrafts, setTotalDrafts] = useState(0);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Slider Mobile
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    topbarCtx?.setTopbar((p) => ({
      ...p,
      title: "Laporan Rekapitulasi",
      showSearch: false,
    }));
  }, [topbarCtx?.setTopbar]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportRes, ocrRes, draftRes, userRes] = await Promise.all([
          axios.get(`${API}/files/root-statistics-recursive`),
          axios.get(`${API}/global-stats`),
          axios.get(`${API}/draft/total-drafts`),
          axios.get(`${API}/auth/fetchAcc`),
        ]);

        if (reportRes.data.success) setReportData(reportRes.data.data);
        if (ocrRes.data.success) setOcrStats(ocrRes.data.totalScans);
        if (draftRes.data.success) setTotalDrafts(draftRes.data.totalDrafts);
        if (userRes.data?.users) setUserData(userRes.data.users);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const summaryTotal = reportData.reduce(
    (acc, curr) => acc + (curr.stats?.totalFiles || 0),
    0,
  );

  return (
    <div className="p-4 md:p-6 lg:p-0 bg-[#F8FAFC] min-h-screen space-y-6 md:space-y-8 pb-20">
      {/* 1. Header */}
      <WelcomeBanner />

      {/* 2. Stats Grid (2 kolom di mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard title="Total Seluruh Arsip" value={loading ? "..." : summaryTotal} subtitle="File" delay={0.1} />
        <StatCard title="Scan Dokumen" value={loading ? "..." : ocrStats} subtitle="OCR" delay={0.2} />
        <StatCard title="Total Draft" value={loading ? "..." : totalDrafts} subtitle="Draft" delay={0.3} />
        <StatCard title="Status Server" value="Online" subtitle="Active" isStatus={true} delay={0.4} />
      </div>

      {/* --- TAMPILAN DESKTOP (XL) --- */}
      <div className="hidden xl:grid grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <RekapBidangTable 
            data={reportData} 
            loading={loading} 
            onExport={() => exportToPDF(reportData, ocrStats, totalDrafts, userData)} 
          />
        </div>
        <div className="xl:col-span-1">
          <ActivityLogTable logs={userData} loading={loading} />
        </div>
      </div>

      {/* --- TAMPILAN MOBILE & IPAD (Slider) --- */}
      <div className="xl:hidden space-y-4">
        {/* Pagination & Hint di Atas */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-center items-center gap-2">
            {[0, 1].map((dot) => (
              <button
                key={dot}
                onClick={() => setActiveTab(dot)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  activeTab === dot ? "w-6 bg-blue-600" : "w-1.5 bg-slate-300"
                }`}
              />
            ))}
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            {activeTab === 0 ? "Geser ke Manajemen Akun →" : "← Geser ke Rekap Bidang"}
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
              const swipe = offset.x;
              if (swipe < -50 && activeTab === 0) setActiveTab(1);
              else if (swipe > 50 && activeTab === 1) setActiveTab(0);
            }}
            animate={{ x: activeTab === 0 ? "0%" : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex w-full"
          >
            {/* Slide 1 */}
            <div className="w-full shrink-0 pr-1">
              <RekapBidangTable 
                data={reportData} 
                loading={loading} 
                onExport={() => exportToPDF(reportData, ocrStats, totalDrafts, userData)} 
              />
            </div>
            {/* Slide 2 */}
            <div className="w-full shrink-0 pl-1">
              <ActivityLogTable logs={userData} loading={loading} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}