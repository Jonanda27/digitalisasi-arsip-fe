import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import { API } from "../../../global/api";

import WelcomeCard from "./components/WelcomeCard";
import StatCard from "./components/StatCard";
import StorageCard from "./components/StorageCard";
import QuickActions from "./components/QuickActions";
import ActivityTable from "./components/ActivityTable";
import ApprovalCard from "./components/ApprovalCard";
import ApprovalModal from "./components/ApprovalModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const { setTopbar } = useContext(TopbarContext);

  // --- STATE ---
  const [openApproval, setOpenApproval] = useState(false);
  const [user, setUser] = useState(null);
  const [totalPending, setTotalPending] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // --- 1. FETCH PROFILE ---
  const fetchProfile = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Gagal mengambil profil:", err);
    }
  }, []);

  // --- 2. FETCH TOTAL PENDING REQUESTS ---
  const fetchTotalRequests = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`${API}/access-requests/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setTotalPending(res.data.length);
      }
    } catch (err) {
      console.error("Gagal mengambil jumlah permintaan:", err);
    }
  }, []);

  // --- 3. FETCH RECURSIVE STATISTICS (FIXED PATH) ---
  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStats(true);
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`${API}/files/root-statistics-recursive`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Perbaikan: Akses res.data.data karena struktur API membungkusnya dalam objek success & data
      // Lalu akses curr.stats.totalFiles
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const total = res.data.data.reduce((acc, curr) => {
          return acc + (curr.stats?.totalFiles || 0);
        }, 0);
        setTotalFiles(total);
      }
    } catch (err) {
      console.error("Gagal mengambil statistik arsip:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // --- TOPBAR CONFIG ---
  const handleSearch = useCallback((q) => {
    console.log("search:", q);
  }, []);

  const topbarConfig = useMemo(
    () => ({
      title: "Dashboard",
      showSearch: false,
      searchPlaceholder: "Cari dokumen",
      onSearch: handleSearch,
    }),
    [handleSearch]
  );

  // --- 4. INITIAL LOAD ---
  useEffect(() => {
    setTopbar(topbarConfig);
    fetchProfile();
    fetchTotalRequests();
    fetchStatistics();
  }, [setTopbar, topbarConfig, fetchProfile, fetchTotalRequests, fetchStatistics]);

  const onNavigate = useCallback(
    (key) => {
      const map = {
        dashboard: "/admin/dashboard",
        manajemenarsip: "/admin/manajemenarsip",
        laporan: "/admin/laporan",
        logaktivitas: "/admin/logaktivitas",
        akunpengguna: "/admin/akunpengguna",
      };
      const to = map[key];
      if (to) navigate(to);
    },
    [navigate]
  );

  return (
    <div className="p-1">
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-12 grid grid-cols-1 gap-4 lg:grid-cols-12 auto-rows-[180px]">
          <div className="lg:col-span-6 h-full">
            <WelcomeCard name={user?.nama || "User"} />
          </div>

          <div className="lg:col-span-3 h-full">
            <StatCard
              title="Total Arsip Digital"
              value={loadingStats ? "..." : totalFiles.toLocaleString("id-ID")}
              subtitle="Total dokumen dari seluruh bidang"
              icon="folder"
            />
          </div>

          <div className="lg:col-span-3 h-full">
            <StorageCard />
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-4 h-full">
          <ApprovalCard
            total={totalPending}
            onClick={() => setOpenApproval(true)}
          />
        </div>
        <div className="lg:col-span-8 h-full">
          <QuickActions className="h-full" onNavigate={onNavigate} />
        </div>
      </section>

      <section className="mt-6 space-y-6">
        <ActivityTable />
      </section>

      <ApprovalModal
        open={openApproval}
        onClose={() => {
          setOpenApproval(false);
          fetchTotalRequests();
        }}
      />
    </div>
  );
}