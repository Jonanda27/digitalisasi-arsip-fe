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
      mobileGradient: "from-blue-500/20 to-transparent", // Khusus mobile
      borderColor: "border-blue-100",
    },
    {
      title: "Laporan",
      shortTitle: "Laporan",
      desc: "Auto generate rekapitulasi sistem dalam pdf.",
      icon: laporanSvg,
      key: "laporan",
      color: "group-hover:bg-emerald-500/10",
      iconBg: "bg-emerald-50",
      mobileGradient: "from-emerald-500/20 to-transparent",
      borderColor: "border-emerald-100",
    },
    {
      title: "Log Aktivitas",
      shortTitle: "Log Aktif",
      desc: "Tinjau histori aktivitas pengguna dalam sistem.",
      icon: activitySvg,
      key: "logaktivitas",
      color: "group-hover:bg-amber-500/10",
      iconBg: "bg-amber-50",
      mobileGradient: "from-amber-500/20 to-transparent",
      borderColor: "border-amber-100",
    },
    {
      title: "Akun Pengguna",
      shortTitle: "Akun",
      desc: "Buat akun dan atur role pengguna.",
      icon: akunSvg,
      key: "akunpengguna",
      color: "group-hover:bg-purple-500/10",
      iconBg: "bg-purple-50",
      mobileGradient: "from-purple-500/20 to-transparent",
      borderColor: "border-purple-100",
    },
  ];

  return (
    <div
      className={[
        "grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 lg:grid-rows-2",
        className,
      ].join(" ")}
    >
      {actions.map((action, index) => (
        <div
          key={action.key}
          onClick={() => onNavigate?.(action.key)}
          style={{ "--delay": `${index * 100}ms` }} // Untuk staggered animation
          className={`
            group relative flex flex-col sm:flex-row cursor-pointer items-center sm:items-center gap-2 sm:gap-4 
            overflow-hidden rounded-2xl border bg-white p-3 sm:p-5 shadow-sm transition-all duration-300 
            hover:-translate-y-1 hover:shadow-xl active:scale-95 animate-mobile-slide-up
            ${action.borderColor} sm:border-gray-100
          `}
        >
          {/* Efek Warna Background Mobile (Sangat Halus) */}
          <div className={`absolute inset-0 bg-gradient-to-br ${action.mobileGradient} opacity-40 sm:hidden`} />

          {/* Efek Hover Background Layer (Laptop) */}
          <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${action.color} group-hover:opacity-100 hidden sm:block`} />

          {/* Icon Container */}
          <div className={`
            relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl 
            ${action.iconBg} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
            shadow-inner-white
          `}>
            <img 
              src={action.icon} 
              alt="" 
              className="h-6 w-6 sm:h-7 sm:w-7 transition-all duration-300 group-hover:drop-shadow-md" 
            />
          </div>

          {/* Text Content */}
          <div className="relative z-10 flex flex-col text-center sm:text-left min-w-0 w-full">
            <h4 className="text-[12px] sm:text-[16px] font-extrabold sm:font-bold text-gray-800 transition-colors group-hover:text-gray-900 truncate tracking-tight">
              <span className="hidden sm:inline">{action.title}</span>
              <span className="sm:hidden">{action.shortTitle}</span>
            </h4>
            
            <p className="hidden sm:block mt-1 text-[12px] leading-relaxed text-gray-500 group-hover:text-gray-600 line-clamp-2">
              {action.desc}
            </p>
          </div>

          {/* Decorative Arrow (Laptop) */}
          <div className="hidden sm:block absolute right-4 opacity-0 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}

      {/* --- MOBILE ANIMATION & STYLES --- */}
      <style jsx>{`
        @media (max-width: 767px) {
          .animate-mobile-slide-up {
            animation: mobileSlideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
            animation-delay: var(--delay);
          }
          
          .shadow-inner-white {
            box-shadow: inset 0 2px 4px 0 rgba(255, 255, 255, 0.5);
          }
        }

        @keyframes mobileSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}