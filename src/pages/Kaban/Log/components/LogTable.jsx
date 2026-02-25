import { useState, useMemo } from "react";
import StatusBadge from "./StatusBadge";
import LogSearch from "./FilterBar";
import {
  FiCalendar,
  FiUser,
  FiLayers,
  FiActivity,
  FiClock,
} from "react-icons/fi";

export default function LogTable({ data }) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((log) => {
      const term = search.toLowerCase();
      return (
        log.waktu.toLowerCase().includes(term) ||
        log.user.nama.toLowerCase().includes(term) ||
        log.user.detail.toLowerCase().includes(term) ||
        log.kategori.toLowerCase().includes(term) ||
        log.aktivitas.toLowerCase().includes(term) ||
        log.status.toLowerCase().includes(term)
      );
    });
  }, [data, search]);

  return (
    <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden transition-all">
      {/* Header & Search Area */}
      <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
        <div className="flex flex-col gap-1">
            <h2 className="text-slate-800 font-black text-lg uppercase tracking-tight">Aktivitas Terbaru</h2>
            <p className="text-slate-400 text-xs font-medium">Pantau log secara real-time</p>
        </div>
        <LogSearch value={search} onChange={setSearch} />
      </div>

      {/* --- TAMPILAN LAPTOP (TABLE) --- */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-widest">
              <th className="px-6 py-4 text-left w-16">No.</th>
              <th className="px-6 py-4 text-left"><div className="flex items-center gap-2"><FiCalendar /> Waktu</div></th>
              <th className="px-6 py-4 text-left"><div className="flex items-center gap-2"><FiUser /> Pengguna</div></th>
              <th className="px-6 py-4 text-left"><div className="flex items-center gap-2"><FiLayers /> Kategori</div></th>
              <th className="px-6 py-4 text-left"><div className="flex items-center gap-2"><FiActivity /> Aktivitas</div></th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredData.map((log, index) => (
              <tr key={log.id} className="hover:bg-blue-50/40 transition-colors group">
                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{log.waktu}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-[11px]">{log.user.nama}</div>
                  <div className="text-slate-500 text-[10px]">{log.user.detail}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">{log.kategori}</span>
                </td>
                <td className="px-6 py-4 text-slate-600 italic font-medium">"{log.aktivitas}"</td>
                <td className="px-6 py-4 text-center"><StatusBadge status={log.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- TAMPILAN MOBILE & IPAD (CARDS) --- */}
      <div className="lg:hidden p-4 md:p-6 bg-slate-50/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredData.map((log, index) => (
            <div 
              key={log.id} 
              className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col gap-4 hover:border-blue-200 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-300">#{String(index + 1).padStart(2, '0')}</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-wider border border-blue-100">
                    {log.kategori}
                  </span>
                </div>
                <StatusBadge status={log.status} />
              </div>

              <div>
                <h4 className="text-slate-900 font-bold text-sm leading-tight">
                  {log.aktivitas}
                </h4>
                <div className="mt-1 flex items-center gap-1.5 text-slate-400">
                   <FiUser className="text-[10px]" />
                   <span className="text-[10px] font-medium">{log.user.nama}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-50 flex items-center gap-2 text-slate-400">
                <FiClock className="text-xs" />
                <span className="text-[11px] font-medium">{log.waktu}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-slate-50/50 text-center border-t border-slate-100">
        <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-widest">
          Menampilkan {filteredData.length} dari {data.length} aktivitas terdeteksi
        </p>
      </div>
    </div>
  );
}