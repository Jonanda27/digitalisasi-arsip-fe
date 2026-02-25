import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../../auth/auth";
import { API } from "../../../../global/api";

// Helper function untuk membuat inisial
const getInitials = (name) => {
  if (!name) return "?";
  return name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
};

// Helper warna random untuk avatar
const getAvatarColor = (name) => {
  const colors = ['bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-purple-100 text-purple-600', 'bg-amber-100 text-amber-600'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function ActivityTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentLogs = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const res = await axios.get(`${API}/logs/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const latestThree = res.data.slice(0, 3); // Tampilkan 5 agar tabel lebih berisi

        const formattedData = latestThree.map((log) => ({
          dbId: log._id,
          date: new Date(log.waktu).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric'}),
          time: new Date(log.waktu).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit'}),
          user: log.userId?.nama || "Sistem",
          email: log.userId?.email || "-",
          category: log.kategori,
          activity: log.aktivitas,
          status: log.status,
        }));

        setLogs(formattedData);
      } catch (err) {
        console.error("Fetch logs error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentLogs();
  }, []);

 return (
    <div className="group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all duration-300">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 md:px-8 md:py-6 bg-gradient-to-r from-white to-slate-50/50 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-8 md:h-10 w-1.5 rounded-full bg-blue-600"></div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
              Aktivitas Terbaru
            </h2>
            <p className="hidden md:block text-xs text-slate-400 font-medium">Memantau penggunaan sistem secara realtime</p>
          </div>
        </div>
        <button className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          Lihat Semua
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* TAMPILAN DESKTOP & IPAD (Table Mode) */}
            <table className="hidden sm:table w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Aktivitas</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.dbId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(log.user)}`}>
                          {getInitials(log.user)}
                        </div>
                        <div className="truncate max-w-[150px]">
                          <div className="font-semibold text-slate-900 truncate">{log.user}</div>
                          <div className="text-xs text-slate-400 truncate">{log.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{log.activity}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 whitespace-nowrap">
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-slate-600">{log.date}</div>
                       <div className="text-xs text-slate-400">{log.time}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        log.status.toLowerCase() === "sukses" ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" : "bg-red-50 text-red-700 ring-red-600/20"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TAMPILAN MOBILE (Card Mode) */}
            <div className="sm:hidden flex flex-col divide-y divide-slate-100">
              {logs.map((log) => (
                <div key={log.dbId} className="p-5 flex flex-col gap-4 active:bg-slate-50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${getAvatarColor(log.user)}`}>
                        {getInitials(log.user)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{log.user}</div>
                        <div className="text-[11px] text-slate-400">{log.time} • {log.date}</div>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ring-inset ${
                      log.status.toLowerCase() === "sukses" ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" : "bg-red-50 text-red-700 ring-red-600/20"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{log.category}</div>
                    <div className="text-sm text-slate-700 font-medium">{log.activity}</div>
                  </div>
                </div>
              ))}
            </div>

            {!loading && logs.length === 0 && (
              <div className="py-12 text-center text-slate-400 italic">Belum ada riwayat aktivitas.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}