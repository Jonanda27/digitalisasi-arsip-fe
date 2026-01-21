const rows = [
  {
    id: "001",
    time: "04/12/2026, 22:36 WIT",
    user: "Bidang PBB",
    email: "pbb.staf@bapenda.go.id",
    category: "Persetujuan Akses",
    activity: "Meminta akses folder",
    status: "Sukses",
  },
  {
    id: "002",
    time: "05/12/2025, 12:30 WIT",
    user: "Admin",
    email: "admin.staf@bapenda.go.id",
    category: "Manajemen Akun",
    activity: "Membuat akun baru",
    status: "Sukses",
  },
  {
    id: "003",
    time: "07/01/2026, 12:30 WIT",
    user: "Sistem",
    email: "Sistem Lokal",
    category: "Sistem",
    activity: "Proses OCR",
    status: "Sukses",
  },
];

export default function ActivityTable() {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">Aktivitas Terbaru</h2>
        <button className="text-sm text-slate-400 hover:text-slate-600 transition">
          Lihat Selengkapnya
        </button>
      </div>

      <div className="px-6 pb-6 overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="py-3 font-medium">Log ID</th>
              <th className="py-3 font-medium">Tanggal dan Waktu</th>
              <th className="py-3 font-medium">User</th>
              <th className="py-3 font-medium">Kategori</th>
              <th className="py-3 font-medium">Aktivitas</th>
              <th className="py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="text-slate-700">
                <td className="py-4">{r.id}</td>
                <td className="py-4">{r.time}</td>
                <td className="py-4">
                  <div className="font-semibold text-[#1D4ED8]">{r.user}</div>
                  <div className="text-slate-500 text-xs">{r.email}</div>
                </td>
                <td className="py-4">{r.category}</td>
                <td className="py-4">{r.activity}</td>
                <td className="py-4">
                  <span className="inline-flex rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
