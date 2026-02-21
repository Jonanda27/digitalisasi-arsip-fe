import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import { API } from "../../../global/api";

// Components
import WelcomeCard from "./components/WelcomeCard";
import StatCard from "./components/StatCard";
import StorageCard from "./components/StorageCard";
import QuickActions from "./components/QuickActions";
import ActivityTable from "./components/ActivityTable";
import AccessRequestTable from "./components/AccessRequestTable";
import ApprovalCard from "./components/ApprovalCard";
import ApprovalModal from "./components/ApprovalModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const { setTopbar } = useContext(TopbarContext);

  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [totalPending, setTotalPending] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0); // State untuk jumlah file
  const [loadingStats, setLoadingStats] = useState(true);

  // --- 1. FETCH PROFILE ---
  const fetchProfile = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (Array.isArray(res.data)) {
        setTotalPending(res.data.length);
      }
    } catch (err) {
      console.error("Gagal mengambil jumlah permintaan:", err);
    }
  }, []);

  // --- 3. FETCH STATISTICS (HIT API) ---
  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStats(true);
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`${API}/files/root-statistics-recursive`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Logika kalkulasi total file dari seluruh bidang
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

  // --- INITIAL LOAD ---
  useEffect(() => {
    setTopbar(topbarConfig);
    fetchProfile();
    fetchTotalRequests();
    fetchStatistics();
  }, [setTopbar, topbarConfig, fetchProfile, fetchTotalRequests, fetchStatistics]);

  // --- NAVIGATION HANDLER ---
  const onNavigate = useCallback(
    (key) => {
      const map = {
        dashboard: "/kaban/dashboard",
        search: "/kaban/search",
        favorite: "/kaban/favorite",
        approval: "/kaban/approval",
        activity: "/kaban/activity",
      };
      const to = map[key];
      if (to) navigate(to);
    },
    [navigate]
  );

  return (
    <div className="space-y-6">
      {/* SECTION 1: Welcome & Stats */}
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

      {/* SECTION 2: Approval Card & Quick Actions */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-4 h-full">
          <ApprovalCard 
            total={totalPending} 
            onClick={() => setIsModalOpen(true)} 
          />
        </div>

        <div className="lg:col-span-8 h-full">
          <QuickActions className="h-full" onNavigate={onNavigate} />
        </div>
      </section>

      {/* SECTION 3: Tables */}
      <section className="space-y-6">
        <ActivityTable />
        <AccessRequestTable />
      </section>

      {/* --- MODAL LAYER --- */}
      <ApprovalModal 
        open={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchTotalRequests(); // Refresh angka pending setelah approve/reject
        }} 
      />
    </div>
  );
}