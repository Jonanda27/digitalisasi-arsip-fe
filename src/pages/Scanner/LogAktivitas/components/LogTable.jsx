import { useState, useMemo } from "react";
import StatusBadge from "./StatusBadge";
import LogSearch from "./LogSearch";

export default function LogTable({ data }) {
  const [keyword, setKeyword] = useState("");

  // Filter data sesuai keyword
  const filteredData = useMemo(() => {
    if (!keyword) return data;

    return data.filter((log) => {
      // Cari di semua field: id, waktu, kategori, aktivitas, status
      return (
        log.id.toString().includes(keyword) ||
        log.waktu.toLowerCase().includes(keyword.toLowerCase()) ||
        log.kategori.toLowerCase().includes(keyword.toLowerCase()) ||
        log.aktivitas.toLowerCase().includes(keyword.toLowerCase()) ||
        log.status.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  }, [data, keyword]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      {/* Panggil LogSearch */}
      <div className="mb-4">
        <LogSearch value={keyword} onChange={setKeyword} />
      </div>

      <table className="w-full text-[12px]">
        <thead className="border-b text-[#94A3B8] font-medium">
          <tr>
            <th className="py-2 text-left">Log ID</th>
            <th className="py-2 text-left">Tanggal dan Waktu ↓</th>
            <th className="py-2 text-left">Kategori</th>
            <th className="py-2 text-left">Aktivitas</th>
            <th className="py-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((log) => (
            <tr key={log.id} className="border-b last:border-0">
              <td className="py-3 text-left">{log.id}</td>
              <td className="py-3 text-left">{log.waktu}</td>
              <td className="py-3 text-left">{log.kategori}</td>
              <td className="py-3 text-left">{log.aktivitas}</td>
              <td className="py-3 text-left">
                <StatusBadge status={log.status} />
              </td>
            </tr>
          ))}

          {filteredData.length === 0 && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-slate-400">
                Data tidak ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
