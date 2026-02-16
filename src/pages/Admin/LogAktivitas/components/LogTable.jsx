import { useState, useMemo } from "react";
import StatusBadge from "./StatusBadge";
import LogSearch from "./LogSearch";
import {
  FiCalendar,
  FiUser,
  FiLayers,
  FiActivity,
  FiSearch,
} from "react-icons/fi";

export default function LogTable({ data }) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((log) => {
      const term = search.toLowerCase();
      return (
        // Kita hapus pencarian berdasarkan ID agar sinkron dengan tampilan
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
    <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden transition-all">
      {/* Header & Search Area */}
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
        <LogSearch value={search} onChange={setSearch} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-widest">
              <th className="px-6 py-4 text-left w-16">No.</th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-2">
                  <FiCalendar /> Waktu
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-2">
                  <FiUser /> Pengguna
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-2">
                  <FiLayers /> Kategori
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-2">
                  <FiActivity /> Aktivitas
                </div>
              </th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredData.map((log, index) => (
              <tr
                key={log.id}
                className="hover:bg-blue-50/40 transition-colors group"
              >
                <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">
                  {log.waktu}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-[11px]">
                    {log.user.nama}
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    {log.user.detail}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block whitespace-nowrap px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wide">
                    {log.kategori}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 italic font-medium">
                  "{log.aktivitas}"
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={log.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-slate-50/50 text-center">
        <p className="text-xs text-slate-400">
          Menampilkan {filteredData.length} dari {data.length} aktivitas
          terdeteksi
        </p>
      </div>
    </div>
  );
}
