import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../../auth/auth";
import { API } from "../../../../global/api";

// Helper Formatter Tanggal
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + " | " + date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
};

const levelStyle = {
  Umum: "bg-emerald-600 text-white",
  Terbatas: "bg-amber-500 text-white",
  Rahasia: "bg-red-700 text-white",
};

export default function AccessRequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Ambil data dari API
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await axios.get(`${API}/access-requests/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Ambil 5 data terbaru saja untuk dashboard
      setRequests(res.data.slice(0, 5));
    } catch (err) {
      console.error("Gagal mengambil data tabel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. Fungsi Aksi (Setujui / Tolak)
  const handleAction = async (id, status) => {
    try {
      const token = getToken();
     await axios.patch(
        `${API}/access-requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh data setelah aksi
      fetchRequests();
      // Opsional: Kirim event ke dashboard untuk update angka di card jika perlu
    } catch (err) {
      alert("Gagal memproses aksi");
    }
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">
          Permintaan Akses Terbaru
        </h2>
      </div>

      <div className="px-6 pb-6 overflow-x-auto">
        <table className="min-w-[980px] w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-3 font-medium">Tanggal Permintaan</th>
              <th className="py-3 font-medium">Pemohon</th>
              <th className="py-3 font-medium">Keperluan/Kepentingan</th>
              <th className="py-3 font-medium">Nama File</th>
              <th className="py-3 font-medium">Tingkat Kerahasiaan</th>
              <th className="py-3 font-medium text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400">
                  <div className="flex justify-center items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"></div>
                    Memuat data...
                  </div>
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400">
                  Tidak ada permintaan akses tertunda.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r._id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 whitespace-nowrap">{formatDate(r.tanggalDiajukan)}</td>
                  <td className="py-4">
                    <div className="font-semibold">{r.user?.nama || "User"}</div>
                  </td>
                  <td className="py-4 max-w-[200px] truncate" title={r.keperluan}>
                    {r.keperluan}
                  </td>
                  <td className="py-4 font-medium text-blue-600">
                    {r.file?.namaFile || "File tidak ditemukan"}
                  </td>
                  <td className="py-4">
                    <span
                      className={[
                        "inline-flex rounded-lg px-3 py-1 text-xs font-semibold",
                        levelStyle[r.file?.kerahasiaan] || "bg-slate-200 text-slate-700",
                      ].join(" ")}
                    >
                      {r.file?.kerahasiaan || "Umum"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleAction(r._id, "approved")}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Setujui"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      </button>

                      <button
                        onClick={() => handleAction(r._id, "rejected")}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        title="Tolak"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}