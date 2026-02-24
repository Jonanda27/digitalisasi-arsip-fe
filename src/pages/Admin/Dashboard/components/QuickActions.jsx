import folderSvg from "../icons/folder-dashboard.svg";
import laporanSvg from "../icons/laporan.svg";
import akunSvg from "../icons/akun-pengguna.svg";
import activitySvg from "../icons/log-aktivitas.svg";

export default function QuickActions({ onNavigate, className = "" }) {
  const actions = [
    {
      title: "Manajemen Arsip",
      shortTitle: "Arsip",
      desc: "Atur struktur folder dokumen arsip digital.",
      icon: folderSvg,
      key: "manajemenarsip",
      color: "group-hover:bg-blue-500/10",
      iconBg: "bg-blue-50",
    },
    {
      title: "Laporan",
      shortTitle: "Laporan",
      desc: "Auto generate rekapitulasi sistem dalam pdf.",
      icon: laporanSvg,
      key: "laporan",
      color: "group-hover:bg-emerald-500/10",
      iconBg: "bg-emerald-50",
    },
    {
      title: "Log Aktivitas",
      shortTitle: "Log Aktif",
      desc: "Tinjau histori aktivitas pengguna dalam sistem.",
      icon: activitySvg,
      key: "logaktivitas",
      color: "group-hover:bg-amber-500/10",
      iconBg: "bg-amber-50",
    },
    {
      title: "Akun Pengguna",
      shortTitle: "Akun",
      desc: "Buat akun dan atur role pengguna.",
      icon: akunSvg,
      key: "akunpengguna",
      color: "group-hover:bg-purple-500/10",
      iconBg: "bg-purple-50",
    },
  ];

  return (
    <div
      className={[
        // Grid tetap 2 kolom di mobile maupun laptop (sesuai kode awal Anda)
        // gap-2 di mobile agar lebih rapat, sm:gap-4 untuk laptop
        "grid grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-4 lg:grid-rows-2",
        className,
      ].join(" ")}
    >
      {actions.map((action) => (
        <div
          key={action.key}
          onClick={() => onNavigate?.(action.key)}
          className="group relative flex flex-col sm:flex-row cursor-pointer items-center sm:items-center gap-2 sm:gap-4 overflow-hidden rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-3 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-gray-200/50 active:scale-95"
        >
          {/* Efek Hover Background Layer */}
          <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${action.color} group-hover:opacity-100`} />

          {/* Icon Container - h-10 di mobile, sm:h-14 di laptop */}
          <div className={`relative z-10 flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-lg sm:rounded-xl ${action.iconBg} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
            <img 
              src={action.icon} 
              alt="" 
              className="h-5 w-5 sm:h-7 sm:w-7 transition-all duration-300 group-hover:drop-shadow-md" 
            />
          </div>

          {/* Text Content */}
          <div className="relative z-10 flex flex-col text-center sm:text-left min-w-0 w-full">
            {/* Ukuran teks lebih kecil di mobile (text-[11px]), sm:text-[16px] di laptop */}
            <h4 className="text-[11px] sm:text-[16px] font-bold text-gray-800 transition-colors group-hover:text-gray-900 truncate">
              <span className="hidden sm:inline">{action.title}</span>
              <span className="sm:hidden">{action.shortTitle}</span>
            </h4>
            
            {/* Deskripsi: Hilang di mobile (hidden), muncul di laptop (sm:block) */}
            <p className="hidden sm:block mt-1 text-[12px] leading-relaxed text-gray-500 group-hover:text-gray-600 line-clamp-2">
              {action.desc}
            </p>
          </div>

          {/* Decorative Arrow: Hilang di mobile, muncul di laptop */}
          <div className="hidden sm:block absolute right-4 opacity-0 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}