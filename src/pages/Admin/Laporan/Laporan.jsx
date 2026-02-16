import { useContext, useEffect, useState } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";
import WelcomeBanner from "./components/WelcomeBanner";
import axios from "axios";
import { API } from "../../../global/api";

// Import Komponen UI
import StatCard from "./components/CardStat";
import RekapBidangTable from "./components/RekapBidangTable";
import ActivityLogTable from "./components/RekapPengguna";

// Import Service Ekspor (Logika PDF dipisah ke sini)
import { exportToPDF } from "../../Admin/Laporan/utils/reportService";

export default function AdminLaporan() {
  const topbarCtx = useContext(TopbarContext);
  
  // States
  const [reportData, setReportData] = useState([]);
  const [ocrStats, setOcrStats] = useState(0);
  const [totalDrafts, setTotalDrafts] = useState(0);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efek untuk mengatur Header Topbar
  useEffect(() => {
    const setTopbar = topbarCtx?.setTopbar;
    if (setTopbar) {
      setTopbar((p) => ({
        ...p,
        title: "Laporan Rekapitulasi Arsip",
        showSearch: false,
      }));
    }
  }, [topbarCtx?.setTopbar]);

  // Efek untuk Fetch Data dari API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportRes, ocrRes, draftRes, userRes] = await Promise.all([
          axios.get(`${API}/files/root-statistics-recursive`),
          axios.get(`${API}/global-stats`),
          axios.get(`${API}/draft/total-drafts`),
          axios.get(`${API}/auth/fetchAcc`)
        ]);

        if (reportRes.data.success) setReportData(reportRes.data.data);
        if (ocrRes.data.success) setOcrStats(ocrRes.data.totalScans);
        if (draftRes.data.success) setTotalDrafts(draftRes.data.totalDrafts);
        
        // Memastikan data user masuk ke state
        if (userRes.data && userRes.data.users) {
          setUserData(userRes.data.users);
        }
        
      } catch (err) {
        console.error("Gagal mengambil data laporan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Menghitung ringkasan total file dari data bidang
  const summaryTotal = reportData.reduce((acc, curr) => 
    acc + (curr.stats?.totalFiles || 0), 0
  );

  // Handler untuk Export PDF (Memanggil utility service)
  const handleExportPDF = () => {
    if (loading) return;
    
    // Kirim data ke service untuk diproses menjadi PDF yang cantik
    exportToPDF(reportData, ocrStats, totalDrafts, userData);
  };

  return (
    <div className="p-6 lg:p-0 bg-slate-50 min-h-screen space-y-8">
      
      {/* 1. Header & Welcome Section */}
      <WelcomeBanner userName="Administrator" />

      {/* 2. Statistik Ringkas (Stats Grid) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Seluruh Arsip" 
          value={loading ? "..." : summaryTotal} 
          subtitle="File Tersistem"
        />
        <StatCard 
          title="Scan Dokumen (Bulan Ini)" 
          value={loading ? "..." : ocrStats} 
          subtitle="Aktivitas OCR"
        />
        <StatCard 
          title="Total Draft Tersimpan" 
          value={loading ? "..." : totalDrafts} 
          subtitle="Belum Dipublish"
        />
        <StatCard 
          title="Status Server" 
          value="Online" 
          subtitle="Sistem Aktif"
          isStatus={true} // Jika StatCard mendukung varian warna status
        />
      </div>

      {/* 3. Area Tabel Laporan Utama */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
        
        {/* Kolom Kiri: Rekapitulasi Bidang (Lebar) */}
        <div className="xl:col-span-2">
          <RekapBidangTable 
            data={reportData} 
            loading={loading} 
            onExport={handleExportPDF} // Fungsi export dipasang di sini
          />
        </div>

        {/* Kolom Kanan: Daftar Pengguna / Log (Sempit) */}
        <div className="xl:col-span-1">
          <ActivityLogTable 
            logs={userData} 
            loading={loading} 
          />
        </div>

      </div>
    </div>
  );
}