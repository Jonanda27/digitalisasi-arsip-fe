import ActionCard from "./ActionCard";

import dashboardSvg from "../icons/dashboard.svg";
import searchSvg from "../icons/search.svg";
import favoritSvg from "../icons/favorit.svg";
import approvalSvg from "../icons/persetujuan.svg"; // <-- pastiin nama file bener
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
        title="Pencarian Dokumen"
        desc="Cari dokumen dengan kata kunci atau metadata."
        icon={searchSvg}
        onClick={() => onNavigate?.("search")}
        className="h-full"
      />

      <ActionCard
        title="Dokumen Favorit"
        desc="Cari dokumen dengan kata kunci atau metadata."
        icon={favoritSvg}
        onClick={() => onNavigate?.("favorite")}
        className="h-full"
      />

      <ActionCard
        title="Persetujuan Akses"
        desc="Berikan atau tolak hak akses kepada pengguna."
        icon={approvalSvg}
        onClick={() => onNavigate?.("approval")}
        className="h-full lg:col-span-2"
      />

      <ActionCard
        title="Log Aktivitas"
        desc="Tinjau histori aktivitas pengguna dalam sistem."
        icon={activitySvg}
        onClick={() => onNavigate?.("activity")}
        className="h-full"
      />
    </div>
  );
}
