import folderSvg from "../icons/folder.svg";

const iconMap = {
  folder: folderSvg,
};

export default function StatCard({ title, value, subtitle, icon = "folder" }) {
  const iconSrc = iconMap[icon] || folderSvg;

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ring-1 ring-slate-100">
      
      {/* Dekorasi Latar Belakang: Lingkaran cahaya halus */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      {/* Icon: Diletakkan di kanan dengan efek Glassmorphism Ring */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
          <img
            src={iconSrc}
            alt=""
            draggable="false"
            className="h-12 w-12 select-none drop-shadow-sm transition-all group-hover:drop-shadow-md"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex h-full flex-col justify-between pr-24">
        <div>
          <span className="inline-block rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Statistik
          </span>
          <div className="mt-2 text-sm font-semibold text-slate-500 transition-colors group-hover:text-blue-600">
            {title}
          </div>
        </div>

        <div className="mt-auto">
          <div className="text-5xl font-black leading-none tracking-tighter text-slate-900 tabular-nums">
            {value}
          </div>

          <div className="mt-3 flex items-center gap-1.5 whitespace-nowrap text-[12px] font-medium text-orange-600">
            <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}