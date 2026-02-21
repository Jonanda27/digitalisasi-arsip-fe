import searchSvg from "../icons/search.svg";
import favoritSvg from "../icons/favorit.svg";
import approvalSvg from "../icons/persetujuan.svg";
import activitySvg from "../icons/log-aktivitas.svg";

export default function QuickActions({ onNavigate, className = "" }) {
  const actions = [
    {
      title: "Pencarian Dokumen",
      desc: "Cari dokumen dengan kata kunci atau metadata.",
      icon: searchSvg,
      key: "search",
      color: "group-hover:bg-blue-500/10",
      iconBg: "bg-blue-50",
    },
    {
      title: "Dokumen Favorit",
      desc: "Akses cepat dokumen yang sering Anda gunakan.",
      icon: favoritSvg,
      key: "favorite",
      color: "group-hover:bg-rose-500/10",
      iconBg: "bg-rose-50",
    },
    {
      title: "Persetujuan Akses",
      desc: "Berikan atau tolak hak akses kepada pengguna.",
      icon: approvalSvg,
      key: "approval",
      color: "group-hover:bg-amber-500/10",
      iconBg: "bg-amber-50",
    },
    {
      title: "Log Aktivitas",
      desc: "Tinjau histori aktivitas pengguna dalam sistem.",
      icon: activitySvg,
      key: "activity",
      color: "group-hover:bg-indigo-500/10",
      iconBg: "bg-indigo-50",
    },
  ];

  return (
    <div
      className={[
        "h-full grid grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-2",
        className,
      ].join(" ")}
    >
      {actions.map((action) => (
        <div
          key={action.key}
          onClick={() => onNavigate?.(action.key)}
          className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-gray-200/50 active:scale-95"
        >
          {/* Efek Hover Background Layer */}
          <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${action.color} group-hover:opacity-100`} />

          {/* Icon Container */}
          <div className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${action.iconBg} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
            <img src={action.icon} alt={action.title} className="h-7 w-7 transition-all duration-300 group-hover:drop-shadow-md" />
          </div>

          {/* Text Content */}
          <div className="relative z-10 flex flex-col">
            <h4 className="text-[16px] font-bold text-gray-800 transition-colors group-hover:text-gray-900">
              {action.title}
            </h4>
            <p className="mt-1 text-[12px] leading-relaxed text-gray-500 group-hover:text-gray-600">
              {action.desc}
            </p>
          </div>

          {/* Decorative Arrow (muncul saat hover) */}
          <div className="absolute right-4 opacity-0 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}