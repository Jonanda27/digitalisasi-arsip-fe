function StatusPill({ value }) {
  const ok = (value || "").toLowerCase() === "sukses";
  return (
    <span className={`inline-flex items-center rounded-md px-3 py-1 text-[11px] font-semibold ${
      ok ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-700"
    }`}>
      {value}
    </span>
  );
}

export default function RecentActivity({ rows = [], onViewAll }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div className="text-[20px] font-semibold text-slate-900">Aktivitas Terbaru</div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[12px] font-medium text-slate-400 hover:text-slate-600"
        >
          Lihat Selengkapnya
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[860px] border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-[12px] text-slate-400">
              <th className="py-3 pr-4 font-medium">Log ID</th>
              <th className="py-3 pr-4 font-medium">Tanggal dan Waktu</th>
              <th className="py-3 pr-4 font-medium">User</th>
              <th className="py-3 pr-4 font-medium">Kategori</th>
              <th className="py-3 pr-4 font-medium">Aktivitas</th>
              <th className="py-3 pr-0 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="text-[13px] text-slate-700">
                <td className="border-t border-slate-100 py-4 pr-4">{r.id}</td>
                <td className="border-t border-slate-100 py-4 pr-4">
                  <span className="text-slate-700">{r.time}</span>
                </td>
                <td className="border-t border-slate-100 py-4 pr-4">
                  <div className="text-blue-700 font-semibold">{r.user}</div>
                  <div className="text-slate-500">{r.email}</div>
                </td>
                <td className="border-t border-slate-100 py-4 pr-4">{r.category}</td>
                <td className="border-t border-slate-100 py-4 pr-4">{r.activity}</td>
                <td className="border-t border-slate-100 py-4 pr-0">
                  <StatusPill value={r.status} />
                </td>
              </tr>
            ))}

            {!rows.length ? (
              <tr>
                <td colSpan={6} className="border-t border-slate-100 py-8 text-center text-[13px] text-slate-400">
                  Belum ada aktivitas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
