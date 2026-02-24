export default function RequestRow({ item }) {
  // Fungsi styling untuk tingkat kerahasiaan
  const getKerahasiaanStyle = (level) => {
    const val = level?.toLowerCase();
    if (val === "rahasia") return "bg-rose-50 text-rose-600 border-rose-100";
    if (val === "terbatas") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  // Fungsi styling untuk status pengerjaan
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "disetujui") return "bg-emerald-500 text-white shadow-sm";
    if (s === "ditolak") return "bg-rose-500 text-white shadow-sm";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  return (
    <>
      {/* --- TAMPILAN MOBILE (CARD MODE) --- */}
      <div className="md:hidden p-5 mx-4 my-3 rounded-[2rem] border border-slate-100 bg-white shadow-sm active:scale-[0.98] transition-all duration-200">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter border ${getKerahasiaanStyle(item.akses)}`}>
            {item.akses}
          </span>
          <span className={`flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${getStatusStyle(item.status)}`}>
             {item.status}
          </span>
        </div>

        <h4 className="font-black text-slate-800 text-sm mb-1 leading-tight tracking-tight">
          {item.namaFile}
        </h4>
        <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-widest">
          ID: {item.id.slice(-6).toUpperCase()}
        </p>
        
        <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100/50">
          <p className="text-[11px] text-slate-500 italic leading-relaxed line-clamp-2">
            "{item.keperluan}"
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Tgl Ajukan</p>
            <p className="text-[11px] text-slate-700 font-bold">
              {new Date(item.tanggalAjukan).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Masa Akses</p>
            <p className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
              {item.masaAkses || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* --- TAMPILAN DESKTOP & IPAD (TABLE MODE) --- */}
      <tr className="hidden md:table-row group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
        <td className="py-5 px-6">
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors leading-none mb-1">
              {item.namaFile}
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              ID: {item.id.slice(-6).toUpperCase()}
            </span>
          </div>
        </td>
        <td className="py-5 px-4 text-xs font-bold text-slate-500">
          {new Date(item.tanggalAjukan).toLocaleDateString("id-ID")}
        </td>
        <td className="py-5 px-4 max-w-[200px]">
          <p className="text-xs text-slate-500 italic line-clamp-1">"{item.keperluan}"</p>
        </td>
        <td className="py-5 px-4 text-center">
          <span className={`inline-flex px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${getKerahasiaanStyle(item.akses)}`}>
            {item.akses}
          </span>
        </td>
        <td className="py-5 px-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase ${getStatusStyle(item.status)}`}>
            {item.status === "menunggu" && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-2" />}
            {item.status}
          </span>
        </td>
        <td className="py-5 px-4 text-xs text-slate-400 font-medium">
          {item.tanggalSetuju ? new Date(item.tanggalSetuju).toLocaleDateString("id-ID") : "-"}
        </td>
        <td className="py-5 px-6 text-right">
          {item.masaAkses ? (
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
              {item.masaAkses}
            </span>
          ) : (
            <span className="text-slate-300">-</span>
          )}
        </td>
      </tr>
    </>
  );
}