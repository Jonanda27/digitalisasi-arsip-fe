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
  const [totalPending, setTotalPending] = useState(0);
  const [user, setUser] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
     const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data); // Asumsi API mengembalikan { name: "...", ... }
    } catch (err) {
      console.error("Gagal mengambil profil:", err);
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

  useEffect(() => {
    setTopbar(topbarConfig);
  }, [setTopbar, topbarConfig]);

  // --- FETCH TOTAL PENDING (Optional agar Card Dinamis) ---
  const fetchTotalRequests = async () => {
    try {
      const token = getToken();
      if (!token) return;
     const res = await axios.get(`${API}/access-requests/pending`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setTotalPending(res.data.length);
    } catch (err) {
      console.error("Gagal mengambil jumlah permintaan:", err);
    }
  };

  useEffect(() => {
    fetchTotalRequests();
    fetchProfile();
  }, [fetchProfile]);

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
              value="12,282"
              subtitle="+487 Dokumen ditambahkan hari ini"
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
          {/* ✅ Mengirimkan total dari API dan fungsi buka modal */}
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
      {/* ✅ Muncul ketika isModalOpen = true */}
      <ApprovalModal 
        open={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchTotalRequests(); // Refresh jumlah angka di card setelah modal ditutup
        }} 
      />
    </div>
  );
}