export default function RequestRow({ item }) {
  const getKerahasiaanStyle = (level) => {
    const val = level?.toLowerCase();
    if (val === "rahasia") return "bg-rose-50 text-rose-600 border-rose-100";
    if (val === "terbatas") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  const getStatusStyle = (status) => {
    if (status === "disetujui") return "bg-emerald-500 text-white shadow-emerald-100";
    if (status === "ditolak") return "bg-rose-500 text-white shadow-rose-100";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  return (
    <tr className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
      {/* NAMA DOKUMEN - Beri pl-6 agar sejajar dengan header jika header pakai pl-6 */}
      <td className="py-5 px-4 pl-6">
        <div className="flex flex-col items-start text-left">
          <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
            {item.namaFile}
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            ID: {item.id.slice(-6).toUpperCase()}
          </span>
        </div>
      </td>

      {/* TGL AJUKAN */}
      <td className="py-5 px-4 text-left text-xs font-medium text-slate-500">
        {new Date(item.tanggalAjukan).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>

      {/* KEPERLUAN */}
      <td className="py-5 px-4 text-left max-w-[250px]">
        <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
          "{item.keperluan}"
        </p>
      </td>

      {/* AKSES */}
      <td className="py-5 px-4 text-left">
        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${getKerahasiaanStyle(item.akses)}`}>
          {item.akses}
        </span>
      </td>

      {/* STATUS */}
      <td className="py-5 px-4 text-left">
        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold shadow-sm ${getStatusStyle(item.status)}`}>
          {item.status === "menunggu" && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-2" />}
          {item.status}
        </span>
      </td>

      {/* TGL SETUJU */}
      <td className="py-5 px-4 text-left text-xs text-slate-500 font-medium">
        {item.tanggalSetuju ? new Date(item.tanggalSetuju).toLocaleDateString("id-ID") : "-"}
      </td>

      {/* MASA AKSES */}
      <td className="py-5 px-4 text-left">
        {item.masaAkses ? (
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {item.masaAkses}
          </span>
        ) : (
          <span className="text-slate-300">-</span>
        )}
      </td>
    </tr>
  );
}