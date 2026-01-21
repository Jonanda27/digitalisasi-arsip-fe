import { useCallback, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TopbarContext } from "../../../layouts/AppLayout";

import WelcomeCard from "./components/WelcomeCard";
import StatCard from "./components/StatCard";
import StorageCard from "./components/StorageCard";
import QuickActions from "./components/QuickActions";
import ActivityTable from "./components/ActivityTable";
import ApprovalCard from "./components/ApprovalCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { setTopbar } = useContext(TopbarContext);

  // Topbar config (biar gak infinite loop)
  const handleSearch = useCallback((q) => {
    console.log("search:", q);
  }, []);

  const topbarConfig = useMemo(
    () => ({
      title: "Dashboard",
      showSearch: true,
      searchPlaceholder: "Cari dokumen",
      onSearch: handleSearch,
    }),
    [handleSearch]
  );

  useEffect(() => {
    setTopbar(topbarConfig);
  }, [setTopbar, topbarConfig]);

  // ✅ INI ROUTING UNTUK SHORTCUT
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
    <>
      {/* TOP cards */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-12 grid grid-cols-1 gap-4 lg:grid-cols-12 auto-rows-[180px]">
          <div className="lg:col-span-6 h-full">
            <WelcomeCard />
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

      {/* approval + shortcuts */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-4 h-full">
          <ApprovalCard total={5} />
        </div>

        <div className="lg:col-span-8 h-full">
          {/* ✅ kirim onNavigate */}
          <QuickActions className="h-full" onNavigate={onNavigate} />
        </div>
      </section>

      {/* tables */}
      <section className="mt-6 space-y-6">
        <ActivityTable />
      </section>
    </>
  );
}
