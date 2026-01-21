import LevelBadge from "./LevelBadge";

import docsSvg from "../icons/docs.svg";
import approveSvg from "../icons/checklist.svg";
import rejectSvg from "../icons/reject.svg";

export default function ApprovalsTable({ rows = [], onApprove, onReject }) {
  return (
    <div className="overflow-hidden rounded-xl">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 text-xs font-semibold text-slate-500">
            <th className="px-3 py-3">Tanggal Permintaan</th>
            <th className="px-3 py-3">Nama Pemohon</th>
            <th className="px-3 py-3">Nama File Tujuan</th>
            <th className="px-3 py-3">Tipe Dokumen</th>
            <th className="px-3 py-3">Tingkat Dokumen</th>
            <th className="px-3 py-3">Aksi</th>
          </tr>
        </thead>

        <tbody className="text-sm text-slate-700">
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-200 last:border-b-0">
              <td className="px-3 py-4 whitespace-nowrap">{r.tanggal}</td>
              <td className="px-3 py-4">{r.pemohon}</td>

              <td className="px-3 py-4">
                <div className="flex items-center gap-2">
                  <img src={docsSvg} alt="" className="h-4 w-4 opacity-70" draggable="false" />
                  <span className="truncate">{r.fileTujuan}</span>
                </div>
              </td>

              <td className="px-3 py-4">{r.tipeDokumen}</td>

              <td className="px-3 py-4">
                <LevelBadge level={r.tingkat} />
              </td>

              <td className="px-3 py-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onApprove?.(r.id)}
                    className="h-7 w-7 grid place-items-center rounded-md hover:bg-slate-100"
                    title="Setujui"
                  >
                    <img src={approveSvg} alt="approve" className="h-4 w-4" draggable="false" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onReject?.(r.id)}
                    className="h-7 w-7 grid place-items-center rounded-md hover:bg-slate-100"
                    title="Tolak"
                  >
                    <img src={rejectSvg} alt="reject" className="h-4 w-4" draggable="false" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-400">
                Tidak ada data.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
