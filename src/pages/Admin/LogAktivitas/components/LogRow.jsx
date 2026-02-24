import LogStatusBadge from "./LogStatusBadge";

export default function LogRow({ item, index, variant = "table" }) {
  const displayId = String(index + 1).padStart(2, "0");

  const formatWaktu = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (variant === "card") {
    return (
      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-300">#{displayId}</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-wider border border-blue-100">
              {item.kategori}
            </span>
          </div>
          <LogStatusBadge status={item.status} />
        </div>
        
        <p className="text-[13px] text-slate-700 font-bold leading-relaxed mb-4">
          {item.aktivitas}
        </p>

        <div className="flex items-center gap-2 text-slate-400">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[11px] font-medium">{formatWaktu(item.waktu)}</span>
        </div>
      </div>
    );
  }

  // Original Table View
  return (
    <tr className="group border-b border-slate-50 last:border-none hover:bg-slate-50/80 transition-all duration-200">
      <td className="py-5 pl-4 text-slate-400 font-bold text-xs">{displayId}</td>
      <td className="py-5">
        <div className="text-[13px] font-semibold text-slate-700">{formatWaktu(item.waktu)}</div>
      </td>
      <td className="py-5">
        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200 uppercase">
          {item.kategori}
        </span>
      </td>
      <td className="py-5">
        <p className="text-[13px] text-slate-600 font-medium max-w-xs lg:max-w-md leading-relaxed">
          {item.aktivitas}
        </p>
      </td>
      <td className="py-5 pr-4 text-right">
        <LogStatusBadge status={item.status} />
      </td>
    </tr>
  );
}