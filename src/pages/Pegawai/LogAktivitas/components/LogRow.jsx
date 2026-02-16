import LogStatusBadge from "./LogStatusBadge";

export default function LogRow({ item, index }) {
  const displayId = String(index + 1).padStart(2, "0");

  const formatWaktu = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date).replace(/\./g, ":");
  };

  return (
    <tr className="group border-b border-slate-50 last:border-none hover:bg-slate-50/80 transition-all duration-200">
      <td className="py-5 pl-4 text-slate-400 font-bold text-xs">{displayId}</td>
      <td className="py-5">
        <div className="text-[13px] font-semibold text-slate-700">{formatWaktu(item.waktu).split(' pukul ')[0]}</div>
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