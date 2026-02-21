import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../../auth/auth";
import { API } from "../../../../global/api";

// Helper Formatter Tanggal yang lebih bersih
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-slate-700">
        {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
      </span>
      <span className="text-[11px] text-slate-400 font-mono italic">
        {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false })} WIB
      </span>
    </div>
  );
};

// Style kerahasiaan dengan efek Pill yang lebih modern
const levelStyle = {
  Umum: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Terbatas: "bg-amber-50 text-amber-700 border-amber-100",
  Rahasia: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function AccessRequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await axios.get(`${API}/access-requests/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const handleAction = async (id, status) => {
    try {
      const token = getToken();
      await axios.patch(
        `${API}/access-requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      alert("Gagal memproses aksi");
    }
  };

  return (
    <div className="group overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all duration-300">
      {/* HEADER */}
      <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-white to-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1.5 rounded-full bg-blue-600"></div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Permintaan Akses Terbaru
            </h2>
            <p className="text-xs text-slate-400 font-medium">Memerlukan konfirmasi segera</p>
          </div>
        </div>
        <button 
          onClick={fetchRequests}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-all"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <div className="px-8 pb-8 overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
              <th className="pb-4 font-bold">Waktu Pengajuan</th>
              <th className="pb-4 font-bold">Pemohon</th>
              <th className="pb-4 font-bold">File & Kerahasiaan</th>
              <th className="pb-4 font-bold">Keperluan</th>
              <th className="pb-4 font-bold text-center">Tindakan</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="5" className="py-6"><div className="h-10 bg-slate-100 rounded-xl"></div></td>
                </tr>
              ))
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                    </div>
                    <p className="text-slate-400 font-medium">Kotak masuk permintaan kosong.</p>
                  </div>
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r._id} className="group/row transition-all hover:bg-blue-50/30">
                  <td className="py-5 pr-4">{formatDate(r.tanggalDiajukan)}</td>
                  
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-[13px] font-bold text-white shadow-md">
                        {r.user?.nama?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{r.user?.nama || "User"}</span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-wide">ID: {r._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-blue-600 hover:underline cursor-pointer truncate max-w-[180px]">
                        {r.file?.namaFile || "File tidak ditemukan"}
                      </span>
                      <span className={`w-fit rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter ${levelStyle[r.file?.kerahasiaan] || "bg-slate-100"}`}>
                        {r.file?.kerahasiaan || "Umum"}
                      </span>
                    </div>
                  </td>

                  <td className="py-5">
                    <p className="max-w-[200px] text-xs leading-relaxed text-slate-500 italic line-clamp-2" title={r.keperluan}>
                      "{r.keperluan}"
                    </p>
                  </td>

                  <td className="py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleAction(r._id, "approved")}
                        className="group/btn flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-emerald-200 active:scale-90"
                        title="Setujui"
                      >
                        <svg className="w-5 h-5 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      </button>

                      <button
                        onClick={() => handleAction(r._id, "rejected")}
                        className="group/btn flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-rose-200 active:scale-90"
                        title="Tolak"
                      >
                        <svg className="w-5 h-5 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
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