import LevelBadge from "./LevelBadge";
import { HiCheck, HiX, HiOutlineDocumentText, HiOutlineCalendar, HiOutlineUser } from "react-icons/hi";

export default function ApprovalsTable({ rows = [], onApprove, onReject }) {
  return (
    <div className="w-full">
      {/* --- TAMPILAN LAPTOP (TABLE) --- */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-4 py-4 text-left">Tanggal</th>
              <th className="px-4 py-4 text-left">Pemohon</th>
              <th className="px-4 py-4 text-left">Dokumen</th>
              <th className="px-4 py-4 text-left">Keperluan</th>
              <th className="px-4 py-4 text-left">Tingkat</th>
              <th className="px-4 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((r) => (
              <tr key={r.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-4 py-5 text-xs font-bold text-slate-500">{r.tanggal}</td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-white shadow-sm">
                      {r.pemohon.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{r.pemohon}</span>
                  </div>
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-2 max-w-[200px]">
                    <HiOutlineDocumentText className="text-blue-500 shrink-0 text-lg" />
                    <span className="text-sm font-medium text-slate-600 truncate italic">"{r.fileTujuan}"</span>
                  </div>
                </td>
                <td className="px-4 py-5 text-sm text-slate-500 font-medium">{r.tipeDokumen}</td>
                <td className="px-4 py-5"><LevelBadge level={r.tingkat} /></td>
                <td className="px-4 py-5">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onApprove(r.id, "approved")} className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90" title="Setujui"><HiCheck className="text-lg" /></button>
                    <button onClick={() => onReject(r.id, "rejected")} className="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90" title="Tolak"><HiX className="text-lg" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- TAMPILAN MOBILE & IPAD (CARDS) --- */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 uppercase">
                  {r.pemohon.substring(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-none mb-1">{r.pemohon}</p>
                  <div className="flex items-center gap-1 text-slate-400">
                    <HiOutlineCalendar className="text-xs" />
                    <span className="text-[10px] font-bold">{r.tanggal}</span>
                  </div>
                </div>
              </div>
              <LevelBadge level={r.tingkat} />
            </div>

            <div className="space-y-3 mb-5">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div className="flex gap-2 items-start">
                  <HiOutlineDocumentText className="text-blue-500 text-lg shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Dokumen</p>
                    <p className="text-xs font-bold text-slate-700 italic">"{r.fileTujuan}"</p>
                  </div>
                </div>
              </div>
              <div className="px-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Keperluan</p>
                <p className="text-xs font-medium text-slate-600">{r.tipeDokumen}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onApprove(r.id, "approved")}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-100 active:scale-95 transition-all"
              >
                <HiCheck className="text-lg" /> Setujui
              </button>
              <button
                onClick={() => onReject(r.id, "rejected")}
                className="flex items-center justify-center gap-2 py-3 bg-white border border-rose-100 text-rose-500 rounded-2xl text-xs font-bold active:scale-95 transition-all"
              >
                <HiX className="text-lg" /> Tolak
              </button>
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="py-20 text-center text-slate-400 font-medium italic">Tidak ada permintaan tertunda</div>
      )}
    </div>
  );
}