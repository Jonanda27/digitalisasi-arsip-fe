import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../../auth/auth";
import { API } from "../../../../global/api";

const getInitials = (name) => {
  if (!name) return "?";
  return name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
};

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

        const latestThree = res.data.slice(0, 5);
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
    <div className="mt-15 rounded-2xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 overflow-hidden">
      
      {/* Header: Responsive padding & text size */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-5 sm:px-6 sm:py-6 border-b border-slate-50 gap-4">
        <div>
           <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">Aktivitas Terbaru</h2>
           <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Memantau penggunaan sistem secara realtime</p>
        </div>
        <button className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg text-left w-fit transition-colors">
          Lihat Semua
        </button>
      </div>

      <div className="relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            {/* Table: Minimum width set for mobile to ensure readability, while ipad/laptop use full width */}
            <table className="w-full text-sm text-left border-collapse min-w-[700px] md:min-w-full">
              <thead className="bg-slate-50/80 text-[10px] sm:text-xs uppercase text-slate-500 font-bold sticky top-0">
                <tr>
                  <th className="px-4 py-3 sm:px-6 sm:py-4">User</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4">Aktivitas</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 hidden lg:table-cell">Kategori</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4">Waktu</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.dbId} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* User Column */}
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] sm:text-xs font-bold ${getAvatarColor(log.user)} shadow-sm`}>
                          {getInitials(log.user)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate text-xs sm:text-sm">{log.user}</div>
                          <div className="text-[10px] sm:text-xs text-slate-400 truncate hidden sm:block">{log.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Activity Column */}
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="text-slate-600 font-medium text-xs sm:text-sm line-clamp-2 sm:line-clamp-1">
                        {log.activity}
                      </div>
                      {/* Mobile-only category badge */}
                      <span className="lg:hidden mt-1 inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                        {log.category}
                      </span>
                    </td>

                    {/* Category (Hidden on mobile/tablet, shown on laptop) */}
                    <td className="px-4 py-3 sm:px-6 sm:py-4 hidden lg:table-cell">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/10">
                        {log.category}
                      </span>
                    </td>

                    {/* Time Column */}
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                       <div className="text-slate-700 font-bold text-[10px] sm:text-xs tracking-tight">{log.date}</div>
                       <div className="text-[9px] sm:text-[11px] text-slate-400 font-medium">{log.time}</div>
                    </td>

                    {/* Status Column */}
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 sm:px-2.5 text-[10px] sm:text-xs font-bold ring-1 ring-inset ${
                          log.status.toLowerCase() === "sukses"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                            : "bg-red-50 text-red-700 ring-red-600/20"
                        }`}
                      >
                        <span className={`mr-1 h-1 w-1 rounded-full ${log.status.toLowerCase() === "sukses" ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {!loading && logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 italic text-xs sm:text-sm">
                      Belum ada riwayat aktivitas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Swipe Indicator for Mobile */}
        <div className="md:hidden flex justify-center py-2 bg-slate-50/50 border-t border-slate-100">
           <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Geser untuk detail</p>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
           </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}