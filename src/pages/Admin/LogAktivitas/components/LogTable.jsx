import { useState, useMemo } from "react";
import StatusBadge from "./StatusBadge";
import LogSearch from "./LogSearch";

export default function LogTable({ data }) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((log) => {
      const term = search.toLowerCase();
      return (
        log.id.toString().includes(term) ||
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
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      {/* Pencarian */}
      <div className="mb-4">
        <LogSearch value={search} onChange={setSearch} />
      </div>

      {/* Tabel */}
      <table className="w-full text-[12px]">
        <thead className="border-b text-[#94A3B8] font-medium">
          <tr>
            <th className="py-2 text-left">Log ID</th>
            <th className="py-2 text-left">Tanggal dan Waktu ↓</th>
            <th className="py-2 text-left">User</th>
            <th className="py-2 text-left">Kategori</th>
            <th className="py-2 text-left">Aktivitas</th>
            <th className="py-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((log) => (
            <tr
              key={log.id}
              className="border-b last:border-0 "
            >
              <td className="py-3">{log.id}</td>
              <td className="py-3">{log.waktu}</td>

              <td className="py-3">
                <div className="font-medium text-blue-600">{log.user.nama}</div>
                <div className="text-slate-500 text-xs">{log.user.detail}</div>
              </td>

              <td className="py-3">{log.kategori}</td>
              <td className="py-3">{log.aktivitas}</td>
              <td className="py-3">
                <StatusBadge status={log.status} />
              </td>
            </tr>
          ))}

          {filteredData.length === 0 && (
            <tr>
              <td colSpan={6} className="py-10 text-center text-slate-400">
                Data tidak ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
