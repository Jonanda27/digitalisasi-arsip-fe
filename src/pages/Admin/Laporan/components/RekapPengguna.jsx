const logs = [
  {
    email: "naufal@bapenda.go.id",
    waktu: "04/12/2025, 22:36 WIT",
    nama: "Naufal Fadil Aziz",
    nip: "198706152014010003",
    role: "Pegawai",
  },
  {
    email: "fahrizal@bapenda.go.id",
    waktu: "05/12/2025, 12:30 WIT",
    nama: "Fahrizal Mudzqi Maulana",
    nip: "199203222019032005",
    role: "Admin",
  },
];

export default function ActivityLogTable() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 text-[14px] font-semibold text-slate-900">
        Rekap Akun Pengguna
      </div>

      <table className="w-full text-[12px]">
        <thead className="border-b text-[#94A3B8] font-semibold">
          <tr>
            <th className="py-2 text-left">Email</th>
            <th className="py-2 text-left">Tanggal Dibuat</th>
            <th className="py-2 text-left">Nama</th>
            <th className="py-2 text-left">NIP</th>
            <th className="py-2 text-left">Role</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr
              key={log.email}
              className="border-b last:border-0 "
            >
              <td className="py-3">{log.email}</td>
              <td className="py-3">{log.waktu}</td>
              <td className="py-3">{log.nama}</td>
              <td className="py-3">{log.nip}</td>
              <td className="py-3 text-slate-900">
                {log.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
