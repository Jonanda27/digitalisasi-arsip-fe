import { FiDownload, FiLayers, FiShield, FiFileText } from "react-icons/fi";

export default function RekapBidangTable({ data, loading, onExport }) {
  if (loading) return (
    <div className="h-64 flex items-center justify-center bg-white rounded-[2rem] border animate-pulse text-slate-400 font-bold uppercase text-xs tracking-widest">
      Loading Report...
    </div>
  );

  return (
    <div className="rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* HEADER SECTION */}
      <div className="px-5 py-4 md:px-6 md:py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
        <div>
          <h3 className="text-base md:text-lg font-bold text-slate-900">Rekap Bidang</h3>
          <p className="text-[10px] md:text-xs text-slate-500 font-medium">Data distribusi klasifikasi keamanan dokumen</p>
        </div>
        <button 
          onClick={onExport}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 md:py-2.5 text-[10px] md:text-xs font-black uppercase text-white hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
        >
          <FiDownload /> Export PDF
        </button>
      </div>

      {/* MOBILE VIEW: Card Stack (Tampil di < 768px) */}
      <div className="grid grid-cols-1 divide-y divide-slate-100 md:hidden">
        {data.map((row) => (
          <div key={row._id} className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FiLayers size={16} />
                </div>
                <span className="font-bold text-slate-800 text-sm uppercase tracking-tight">{row.name}</span>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total File</p>
                <p className="text-lg font-black text-blue-600">{row.stats.totalFiles}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-50 p-2 rounded-xl text-center border border-emerald-100">
                <p className="text-[8px] font-black text-emerald-600 uppercase mb-1">Umum</p>
                <p className="text-xs font-bold text-emerald-700">{row.stats.byKerahasiaan.umum}</p>
              </div>
              <div className="bg-amber-50 p-2 rounded-xl text-center border border-amber-100">
                <p className="text-[8px] font-black text-amber-600 uppercase mb-1">Terbatas</p>
                <p className="text-xs font-bold text-amber-700">{row.stats.byKerahasiaan.terbatas}</p>
              </div>
              <div className="bg-rose-50 p-2 rounded-xl text-center border border-rose-100">
                <p className="text-[8px] font-black text-rose-600 uppercase mb-1">Rahasia</p>
                <p className="text-xs font-bold text-rose-700">{row.stats.byKerahasiaan.rahasia}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE VIEW: Desktop & Tablet (Tampil di >= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm md:min-w-full">
          <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-4 text-left">Nama Bidang</th>
              <th className="px-6 py-4 text-center">Total File</th>
              <th className="px-6 py-4 text-center text-emerald-600">Umum</th>
              <th className="px-6 py-4 text-center text-amber-600">Terbatas</th>
              <th className="px-6 py-4 text-center text-rose-600">Rahasia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row) => (
              <tr key={row._id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-700 group-hover:text-blue-600 uppercase text-xs">{row.name}</td>
                <td className="px-6 py-4 text-center font-black text-slate-900">{row.stats.totalFiles}</td>
                <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold">{row.stats.byKerahasiaan.umum}</span></td>
                <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold">{row.stats.byKerahasiaan.terbatas}</span></td>
                <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-[10px] font-bold">{row.stats.byKerahasiaan.rahasia}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}