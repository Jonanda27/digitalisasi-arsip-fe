import { useCallback, useContext, useEffect, useState } from "react";
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

  const [openApproval, setOpenApproval] = useState(false);
  const [user, setUser] = useState(null);
  const [totalPending, setTotalPending] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // --- API LOGIC (TETAP SAMA) ---
  const fetchProfile = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchTotalRequests = useCallback(async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API}/access-requests/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) setTotalPending(res.data.length);
    } catch (err) { console.error(err); }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStats(true);
      const token = getToken();
      const res = await axios.get(`${API}/files/root-statistics-recursive`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        const total = res.data.data.reduce((acc, curr) => acc + (curr.stats?.totalFiles || 0), 0);
        setTotalFiles(total);
      }
    } finally { setLoadingStats(false); }
  }, []);

  useEffect(() => {
    setTopbar({ title: "Dashboard", showSearch: false });
    fetchProfile();
    fetchTotalRequests();
    fetchStatistics();
  }, [setTopbar, fetchProfile, fetchTotalRequests, fetchStatistics]);

  return (
    <div className="p-4 md:p-6 lg:p-6 max-w-[1600px] bg-gradient-to-r  from-blue-100 via-blue-50/30 to-white 
                    md:from-transparent md:via-transparent md:to-transparent mx-auto space-y-6 overflow-x-hidden">
      
      {/* SECTION 1: Welcome & Top Cards */}
      <section className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4 lg:auto-rows-[180px]">
        
        {/* Welcome Card */}
        <div className="md:col-span-12 lg:col-span-6 h-full animate-mobile-slide-down">
          <WelcomeCard name={user?.nama || "geocitra"} />
        </div>

        {/* WRAPPER SCROLL: URUTAN DIUBAH (Approval Pertama) */}
        <div className="flex md:contents gap-4 overflow-x-auto pb-4 md:pb-0 scroll-smooth snap-x snap-mandatory hide-scrollbar md:col-span-12 lg:col-span-6">
          
          {/* 1. Approval Card (KHUSUS MOBILE - MUNCUL PERTAMA) */}
          <div className="min-w-[85%] md:hidden h-full snap-center animate-mobile-pop-in [animation-delay:100ms]">
            <ApprovalCard
              total={totalPending}
              onClick={() => setOpenApproval(true)}
            />
          </div>

          {/* 2. Stat Card */}
          <div className="min-w-[85%] md:min-w-0 md:col-span-6 lg:col-span-3 h-full snap-center animate-mobile-pop-in [animation-delay:200ms]">
            <StatCard
              title="Total Arsip Digital"
              value={loadingStats ? "..." : totalFiles}
              subtitle="Total dokumen dari seluruh bidang"
              icon="folder"
            />
          </div>

          {/* 3. Storage Card */}
          <div className="min-w-[85%] md:min-w-0 md:col-span-6 lg:col-span-3 h-full snap-center animate-mobile-pop-in [animation-delay:300ms]">
            <StorageCard />
          </div>
        </div>
      </section>

      {/* SECTION 2: Quick Actions & Approval (Posisi Laptop) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Approval Card (Hanya muncul di Laptop/iPad di posisi bawah/samping) */}
        <div className="hidden md:block lg:col-span-4 animate-mobile-slide-up">
          <ApprovalCard
            total={totalPending}
            onClick={() => setOpenApproval(true)}
          />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-8 animate-mobile-fade-in [animation-delay:400ms]">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1 lg:hidden">
            Navigasi Cepat
          </h3>
          <QuickActions onNavigate={(key) => navigate(`/admin/${key}`)} />
        </div>
      </section>

      {/* SECTION 3: Activity Table */}
      <section className="pb-10 animate-mobile-fade-in [animation-delay:600ms]">
        <ActivityTable />
      </section>

      {/* CSS ENGINE (TETAP SAMA) */}
      <style jsx>{`
        @media (max-width: 767px) {
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          
          .animate-mobile-slide-down { animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
          .animate-mobile-pop-in { animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
          .animate-mobile-fade-in { animation: fadeIn 1s ease both; }
        }

        @keyframes slideDown { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.9); } 70% { transform: scale(1.02); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>

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