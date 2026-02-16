export default function RekapBidangTable({ data, loading, onExport }) {
  if (loading) return <div className="h-64 flex items-center justify-center bg-white rounded-xl border animate-pulse text-slate-400">Memuat data rekap...</div>;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Rekap Arsip Per Bidang</h3>
          <p className="text-xs text-slate-500">Distribusi dokumen berdasarkan klasifikasi keamanan</p>
        </div>
        <button 
          onClick={onExport}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Export PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Bidang</th>
              <th className="px-6 py-4 text-center">Total</th>
              <th className="px-6 py-4 text-center text-emerald-600">Umum</th>
              <th className="px-6 py-4 text-center text-amber-600">Terbatas</th>
              <th className="px-6 py-4 text-center text-rose-600">Rahasia</th>
              <th className="px-6 py-4 text-center">Akses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr key={row._id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-700">{row.name}</td>
                <td className="px-6 py-4 text-center font-bold">{row.stats.totalFiles}</td>
                <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[11px]">{row.stats.byKerahasiaan.umum}</span></td>
                <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-[11px]">{row.stats.byKerahasiaan.terbatas}</span></td>
                <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-rose-50 text-rose-700 rounded-md text-[11px]">{row.stats.byKerahasiaan.rahasia}</span></td>
                <td className="px-6 py-4 text-center text-slate-500">{row.stats.totalAccessRequests} <span className="text-[10px]">Req</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}