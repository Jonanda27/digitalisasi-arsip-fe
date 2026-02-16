import LevelBadge from "./LevelBadge";
import { HiCheck, HiX, HiOutlineDocumentText } from "react-icons/hi";

export default function ApprovalsTable({ rows = [], onApprove, onReject }) {
  return (
    <div className="overflow-x-auto">
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
                  <button
                    onClick={() => onApprove(r.id, "approved")}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                    title="Setujui"
                  >
                    <HiCheck className="text-lg" />
                  </button>
                  <button
                    onClick={() => onReject(r.id, "rejected")}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90"
                    title="Tolak"
                  >
                    <HiX className="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="py-20 text-center text-slate-400 font-medium italic">Tidak ada permintaan tertunda</div>
      )}
    </div>
  );
}