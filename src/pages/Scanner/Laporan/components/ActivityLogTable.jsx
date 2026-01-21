const logs = [
  {
    id: "001",
    waktu: "04/12/2026, 22:36 WIT",
    kategori: "Scan Dokumen",
    aktivitas: "Scan dokumen arsip fisik",
    status: "Sukses",
  },
  {
    id: "002",
    waktu: "05/12/2026, 12:30 WIT",
    kategori: "Upload File",
    aktivitas: "Upload file dokumen digital",
    status: "Sukses",
  },
  {
    id: "003",
    waktu: "07/01/2026, 12:30 WIT",
    kategori: "Sistem",
    aktivitas: "Login ke dalam aplikasi",
    status: "Sukses",
  },
];

export default function ActivityLogTable() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 text-[14px] font-semibold text-slate-900">
        Log Aktivitas
      </div>

      <table className="w-full text-[12px]">
        <thead className="border-b text-[#94A3B8] font-semibold">
          <tr>
            <th className="py-2 text-left">Log ID</th>
            <th className="py-2 text-left">Tanggal & Waktu</th>
            <th className="py-2 text-left">Kategori</th>
            <th className="py-2 text-left">Aktivitas</th>
            <th className="py-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-b last:border-0 "
            >
              <td className="py-3 text-left">{log.id}</td>
              <td className="py-3 text-left">{log.waktu}</td>
              <td className="py-3 text-left">{log.kategori}</td>
              <td className="py-3 text-left">{log.aktivitas}</td>
              <td className="py-3 text-left">
                <span className="inline-flex items-center rounded-[5px] bg-[#1F6F43] px-4 py-1 text-[11px] font-regular text-white">
                  {log.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
