import StatusBadge from "./StatusBadge";

export default function LogTable({ rows = [] }) {
  return (
    <div className="overflow-hidden rounded-xl">
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs font-semibold text-slate-500">
            <th className="px-3 py-3">Log ID</th>
            <th className="px-3 py-3">
              <div className="flex items-center gap-2">
                <span>Tanggal dan Waktu</span>
                <span className="text-slate-400">↓</span>
              </div>
            </th>
            <th className="px-3 py-3">Kategori</th>
            <th className="px-3 py-3">Aktivitas</th>
            <th className="px-3 py-3">Status</th>
          </tr>
        </thead>

        <tbody className="text-sm text-slate-700">
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-slate-200">
              <td className="px-3 py-4">{r.id}</td>
              <td className="px-3 py-4">{r.datetime}</td>
              <td className="px-3 py-4">{r.kategori}</td>
              <td className="px-3 py-4">{r.aktivitas}</td>
              <td className="px-3 py-4">
                <StatusBadge status={r.status} />
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-3 py-10 text-center text-sm text-slate-400">
                Tidak ada data.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
