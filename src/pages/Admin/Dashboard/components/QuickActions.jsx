import ActionCard from "./ActionCard";

import dashboardSvg from "../icons/dashboard.svg";
import folderSvg from "../icons/folder-dashboard.svg";
import laporanSvg from "../icons/laporan.svg";
import akunSvg from "../icons/akun-pengguna.svg";
import activitySvg from "../icons/log-aktivitas.svg";

export default function QuickActions({ onNavigate, className = "" }) {
  return (
    <div
      className={[
        "h-full",
        "grid grid-cols-1 gap-6",
        "lg:grid-cols-3 lg:grid-rows-2 lg:auto-rows-fr",
        className,
      ].join(" ")}
    >
      <ActionCard
        title="Dashboard"
        desc="Informasi paling update dari semua menu."
        icon={dashboardSvg}
        onClick={() => onNavigate?.("dashboard")}
        className="h-full"
      />

      <ActionCard
        title="Manajemen Arsip"
        desc="Atur struktur folder dokumen arsip digital."
        icon={folderSvg}
        onClick={() => onNavigate?.("manajemenarsip")}
        className="h-full"
      />

      <ActionCard
        title="Laporan"
        desc="Auto generate rekapitulasi sistem dalam pdf."
        icon={laporanSvg}
        onClick={() => onNavigate?.("laporan")}
        className="h-full"
      />

      <ActionCard
        title="Log Aktivitas"
        desc="Tinjau histori aktivitas pengguna dalam sistem."
        icon={activitySvg}
        onClick={() => onNavigate?.("logaktivitas")}
        className="h-full"
      />

      <ActionCard
        title="Akun Pengguna"
        desc="Buat akun dan atur role pengguna."
        icon={akunSvg}
        onClick={() => onNavigate?.("akunpengguna")}
        className="h-full"
      />
    </div>
  );
}
