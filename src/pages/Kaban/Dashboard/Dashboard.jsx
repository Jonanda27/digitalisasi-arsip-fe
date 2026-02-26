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
  const [totalFiles, setTotalFiles] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // --- FETCH LOGIC ---
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

  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStats(true);
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`${API}/files/root-statistics-recursive`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
    <div className="p-4 md:p-6 lg:p-6 max-w-[1600px] bg-gradient-to-r  from-blue-100 via-blue-50/30 to-white 
                    md:from-transparent md:via-transparent md:to-transparent mx-auto space-y-6 overflow-x-hidden bg-slate-50/30 min-h-screen">
      
      {/* SECTION 1: Welcome & Top Cards */}
      <section className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4 lg:auto-rows-[180px]">
        
        {/* Welcome Card */}
        <div className="md:col-span-12 lg:col-span-6 h-full animate-mobile-slide-down">
          <WelcomeCard name={user?.nama || "User"} />
        </div>

        {/* WRAPPER SCROLL: Stat & Storage Cards */}
        <div className="flex md:contents gap-4 overflow-x-auto pb-4 md:pb-0 scroll-smooth snap-x snap-mandatory hide-scrollbar md:col-span-12 lg:col-span-6">
          <div className="min-w-[85%] md:hidden h-full snap-center animate-mobile-pop-in [animation-delay:100ms]">
            <ApprovalCard
              total={totalPending}
              onClick={() => setIsModalOpen(true)}
            />
          </div>

          <div className="min-w-[85%] md:min-w-0 md:col-span-6 lg:col-span-3 h-full snap-center animate-mobile-pop-in [animation-delay:200ms]">
            <StatCard
              title="Total Arsip Digital"
              value={loadingStats ? "..." : totalFiles.toLocaleString("id-ID")}
              subtitle="Total dokumen dari seluruh bidang"
              icon="folder"
            />
          </div>

          <div className="min-w-[85%] md:min-w-0 md:col-span-6 lg:col-span-3 h-full snap-center animate-mobile-pop-in [animation-delay:300ms]">
            <StorageCard />
          </div>
        </div>
      </section>

      {/* SECTION 2: Quick Actions & Approval (Tablet/Desktop) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="hidden md:block lg:col-span-4 animate-mobile-slide-up">
          <ApprovalCard 
            total={totalPending} 
            onClick={() => setIsModalOpen(true)} 
          />
        </div>

        <div className="lg:col-span-8 animate-mobile-fade-in [animation-delay:400ms]">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1 lg:hidden">
            Navigasi Cepat
          </h3>
          <QuickActions className="h-full" onNavigate={onNavigate} />
        </div>
      </section>

      {/* SECTION 3: Tables - SWIPEABLE ON MOBILE, STACKED ON TABLET/DESKTOP */}
      <section className="mt-15 pb-10">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1 md:hidden">
          Ringkasan Data (Geser untuk lainnya)
        </h3>

        <div className="
          /* Mobile Styles */
          flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-1
          /* iPad & Desktop Styles (768px+) */
          md:flex-col md:overflow-visible md:snap-none md:gap-8 md:px-0
        ">
          
          {/* Box 1: Activity Table */}
          <div className="min-w-[92%] sm:min-w-[85%] md:min-w-full snap-center">
            <div className="animate-mobile-fade-in [animation-delay:500ms]">
              <ActivityTable />
            </div>
            {/* Dots Indicator Mobile Only */}
            <div className="flex justify-center gap-1.5 mt-4 md:hidden">
              <div className="h-1.5 w-6 rounded-full bg-blue-600 transition-all duration-300"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300 transition-all duration-300"></div>
            </div>
          </div>

          {/* Box 2: Access Request Table */}
          <div className="min-w-[92%] sm:min-w-[85%] md:min-w-full snap-center">
            <div className="animate-mobile-fade-in [animation-delay:600ms]">
              <AccessRequestTable />
            </div>
            {/* Dots Indicator Mobile Only */}
            <div className="flex justify-center gap-1.5 mt-4 md:hidden">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300 transition-all duration-300"></div>
              <div className="h-1.5 w-6 rounded-full bg-blue-600 transition-all duration-300"></div>
            </div>
          </div>

        </div>
      </section>

      {/* --- MODAL LAYER --- */}
      <ApprovalModal 
        open={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchTotalRequests();
        }} 
      />

      {/* STYLES FOR ANIMATION & MOBILE SCROLL */}
      <style jsx>{`
        /* Sembunyikan Scrollbar tapi tetap fungsional */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @media (max-width: 767px) {
          .animate-mobile-slide-down { animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
          .animate-mobile-pop-in { animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
          .animate-mobile-fade-in { animation: fadeIn 1s ease both; }
          .animate-mobile-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        }

        @keyframes slideDown { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.9); } 70% { transform: scale(1.02); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}