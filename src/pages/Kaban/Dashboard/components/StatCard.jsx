import folderSvg from "../icons/folder.svg";

const iconMap = {
  folder: folderSvg,
};

export default function StatCard({ title, value, subtitle, icon = "folder" }) {
  const iconSrc = iconMap[icon] || folderSvg;

  return (
    <div className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 relative overflow-hidden">
      {/* Icon: kanan tengah (lebih besar) */}
      <img
        src={iconSrc}
        alt=""
        draggable="false"
        className="absolute right-6 top-1/2 -translate-y-1/2 h-16 w-16 select-none"
      />

      {/* Content (kasih ruang kanan buat icon) */}
      <div className="h-full pr-24 flex flex-col justify-between">
        <div className="text-sm text-slate-400">{title}</div>

        <div className="mt-2 text-5xl font-extrabold leading-none text-slate-900">
          {value}
        </div>

        <div className="mt-3 text-[12px] leading-none text-orange-500 whitespace-nowrap">
          {subtitle}
        </div>
      </div>
    </div>
  );
}
