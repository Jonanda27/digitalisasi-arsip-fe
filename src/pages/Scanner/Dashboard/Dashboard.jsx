import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopbarContext } from "../../../layouts/AppLayout";

import ProcessCard from "./components/ProcessCard";
import StatCard from "./components/StatCard";
import StorageCard from "./components/StorageCard";
import ProgressCard from "./components/ProgressCard";
import ShortcutCard from "./components/ShortcutCard";
import RecentActivity from "./components/RecentActivity";

// icons
import dashboardIcon from "./icons/dashboard.svg";
import inputDokumenIcon from "./icons/input-dokumen.svg";
import laporanIcon from "./icons/laporan.svg";
import logAktivitasIcon from "./icons/log-aktivitas.svg";

export default function DashboardScanner() {
  const navigate = useNavigate();
  const { setTopbar } = useContext(TopbarContext);

  /* ================= TOPBAR ================= */
  useEffect(() => {
    setTopbar({
      title: "Dashboard",
      showSearch: false,
      onSearch: null,
    });
  }, [setTopbar]);

  /* ================= ROUTING (KUNCI) ================= */
  const onNavigate = useCallback(
    (key) => {
      const map = {
        dashboard: "/scanner/dashboard",
        input: "/scanner/input-dokumen",
        laporan: "/scanner/laporan",
        log: "/scanner/log-aktivitas",
      };

      const to = map[key];
      if (to) navigate(to);
    },
    [navigate]
  );

  return (
    <div className="w-full">
      {/* ================= ROW 1 ================= */}
      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <ProcessCard
            scannedToday={32}
            draftCount={12}
            onScan={() => onNavigate("input")}
            onDraft={() => onNavigate("input")}
            onUpload={() => onNavigate("input")}
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Total Arsip Digital"
            value="12,282"
            note="+487 Dokumen ditambahkan hari ini"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-2">
          <StorageCard
            title="Penyimpanan Server"
            percent={25}
            leftText="25% Terpakai"
            rightText="1TB"
            note="Penyimpanan server tersisa 750 GB lagi"
          />
        </div>
      </div>

      {/* ================= ROW 2 ================= */}
      <div className="mt-6 grid grid-cols-12 gap-6">
        {/* shortcuts */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ShortcutCard
            title="Dashboard"
            desc="Informasi paling update dari semua menu."
            icon={dashboardIcon}
            onClick={() => onNavigate("dashboard")}
          />
          <ShortcutCard
            title="Input Dokumen"
            desc="Scan dokumen fisik dan upload dokumen digital."
            icon={inputDokumenIcon}
            onClick={() => onNavigate("input")}
          />
          <ShortcutCard
            title="Laporan"
            desc="Auto generate rekapitulasi sistem dalam PDF."
            icon={laporanIcon}
            onClick={() => onNavigate("laporan")}
          />
          <ShortcutCard
            title="Log Aktivitas"
            desc="Tinjau histori aktivitas pengguna dalam sistem."
            icon={logAktivitasIcon}
            onClick={() => onNavigate("log")}
          />
        </div>

        {/* right cards */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <StatCard
            title="Target Bulan Ini"
            value="1000"
            note="1000 Dokumen harus discan bulan ini"
            variant="target"
          />
          <ProgressCard
            title="Progress Digitalisasi Arsip"
            percent={25}
            leftText="25% Sudah Digital"
            rightText="250/1000 Dokumen"
            note="Tersisa 750 dokumen lagi agar mencapai target"
          />
        </div>
      </div>

      {/* ================= ROW 3 ================= */}
      <div className="mt-8">
        <RecentActivity
          onViewAll={() => onNavigate("log")}
          rows={[
            {
              id: "001",
              time: "04/12/2026, 22:36 WIT",
              user: "Bidang PBB",
              email: "pbb.staf@bapenda.go.id",
              category: "Persetujuan Akses",
              activity: "Meminta akses folder",
              status: "Sukses",
            },
            {
              id: "002",
              time: "05/12/2025, 12:30 WIT",
              user: "Admin",
              email: "admin.staf@bapenda.go.id",
              category: "Manajemen Akun",
              activity: "Membuat akun baru",
              status: "Sukses",
            },
            {
              id: "003",
              time: "07/01/2026, 12:30 WIT",
              user: "Sistem",
              email: "Sistem Lokal",
              category: "Sistem",
              activity: "Proses OCR",
              status: "Sukses",
            },
          ]}
        />
      </div>
    </div>
  );
}
