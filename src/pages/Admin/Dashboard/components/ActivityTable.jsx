import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../../auth/auth";
import { API } from "../../../../global/api";

export default function ActivityTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentLogs = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        // Memanggil API backend
        const res = await axios.get(`${API}/logs/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ambil 3 data teratas (Terbaru)
        const latestThree = res.data.slice(0, 3);

        // Format data agar sesuai dengan kebutuhan tampilan tabel
        const formattedData = latestThree.map((log) => ({
          dbId: log._id, // Tetap simpan ID asli untuk 'key' React
          time: new Date(log.waktu).toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB",
          user: log.userId?.nama || "Sistem",
          category: log.kategori,
          activity: log.aktivitas,
          status: log.status,
        }));

        setLogs(formattedData);
      } catch (err) {
        console.error("Gagal mengambil aktivitas terbaru:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentLogs();
  }, []);

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      {/* Header Tabel */}
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">Aktivitas Terbaru</h2>
      </div>

      {/* Area Tabel */}
      <div className="px-6 pb-6 overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-sm text-slate-500">Memuat data...</p>
          </div>
        ) : (
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="py-3 font-medium w-16">No.</th>
                <th className="py-3 font-medium">Tanggal dan Waktu</th>
                <th className="py-3 font-medium">User</th>
                <th className="py-3 font-medium">Kategori</th>
                <th className="py-3 font-medium">Aktivitas</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {logs.map((log, index) => (
                <tr key={log.dbId} className="text-slate-700  transition-colors">
                  {/* Kolom Nomor Urut 1, 2, 3 */}
                  <td className="py-4 font-medium text-slate-400">
                    {index + 1}
                  </td>
                  
                  <td className="py-4 text-slate-600">
                    {log.time}
                  </td>
                  
                  <td className="py-4">
                    <div className="font-semibold ">{log.user}</div>
                    <div className="text-slate-500 text-xs">{log.email}</div>
                  </td>
                  
                  <td className="py-4 text-slate-600">
                    {log.category}
                  </td>
                  
                  <td className="py-4 text-slate-600">
                    {log.activity}
                  </td>
                  
                  <td className="py-4">
                    <span className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold text-white ${
                      log.status.toLowerCase() === 'sukses' 
                        ? 'bg-emerald-600' 
                        : 'bg-red-500'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}

              {/* State jika data kosong */}
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Belum ada riwayat aktivitas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}