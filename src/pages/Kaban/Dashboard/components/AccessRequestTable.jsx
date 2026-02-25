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
      setRequests(res.data.slice(0, 3));
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
    <div className="group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all duration-300">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 md:px-8 md:py-6 bg-gradient-to-r from-white to-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-8 md:h-10 w-1.5 rounded-full bg-blue-600"></div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
              Permintaan Akses
            </h2>
            <p className="hidden md:block text-xs text-slate-400 font-medium">Memerlukan konfirmasi segera</p>
          </div>
        </div>
        <button onClick={fetchRequests} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-all">
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <div className="px-0 md:px-8 md:pb-8">
        {/* TAMPILAN DESKTOP & IPAD (Table Mode) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-[800px] lg:min-w-[900px] w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                <th className="pb-4 font-bold px-2">Waktu Pengajuan</th>
                <th className="pb-4 font-bold px-2">Pemohon</th>
                <th className="pb-4 font-bold px-2">File & Kerahasiaan</th>
                <th className="pb-4 font-bold px-2">Keperluan</th>
                <th className="pb-4 font-bold text-center px-2">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="py-6"><div className="h-10 bg-slate-100 rounded-xl mx-2"></div></td>
                  </tr>
                ))
              ) : requests.map((r) => (
                <tr key={r._id} className="group/row transition-all hover:bg-blue-50/30">
                  <td className="py-5 pr-4 px-2">{formatDate(r.tanggalDiajukan)}</td>
                  <td className="py-5 px-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-[13px] font-bold text-white shadow-md shrink-0">
                        {r.user?.nama?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col truncate max-w-[120px]">
                        <span className="font-bold text-slate-700 truncate">{r.user?.nama || "User"}</span>
                        <span className="text-[10px] text-slate-400 font-medium">ID: {r._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-2">
                    <div className="flex flex-col gap-1.5 truncate max-w-[150px]">
                      <span className="font-bold text-blue-600 hover:underline cursor-pointer truncate">
                        {r.file?.namaFile || "File tidak ditemukan"}
                      </span>
                      <span className={`w-fit rounded-md border px-2 py-0.5 text-[10px] font-black uppercase ${levelStyle[r.file?.kerahasiaan] || "bg-slate-100"}`}>
                        {r.file?.kerahasiaan || "Umum"}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-2">
                    <p className="max-w-[180px] text-xs leading-relaxed text-slate-500 italic line-clamp-2" title={r.keperluan}>
                      "{r.keperluan}"
                    </p>
                  </td>
                  <td className="py-5 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleAction(r._id, "approved")} className="group/btn flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg></button>
                      <button onClick={() => handleAction(r._id, "rejected")} className="group/btn flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TAMPILAN MOBILE (Card Mode) */}
        <div className="sm:hidden flex flex-col divide-y divide-slate-100">
          {!loading && requests.length === 0 ? (
            <div className="py-10 text-center text-slate-400 italic">Kotak masuk kosong.</div>
          ) : requests.map((r) => (
            <div key={r._id} className="p-5 flex flex-col gap-4 active:bg-blue-50/30">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-sm font-bold text-white shadow-md">
                    {r.user?.nama?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{r.user?.nama}</div>
                    <div className="text-[10px] text-slate-400">ID: {r._id.slice(-6).toUpperCase()}</div>
                  </div>
                </div>
                <span className={`rounded-md border px-2 py-0.5 text-[9px] font-black uppercase ${levelStyle[r.file?.kerahasiaan] || "bg-slate-100"}`}>
                  {r.file?.kerahasiaan}
                </span>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                <div className="text-blue-600 font-bold text-xs truncate">{r.file?.namaFile}</div>
                <div className="text-[11px] text-slate-500 italic leading-snug line-clamp-2">"{r.keperluan}"</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[10px] text-slate-400 font-medium">
                  {new Date(r.tanggalDiajukan).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })} • {new Date(r.tanggalDiajukan).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(r._id, "rejected")} className="px-4 py-2 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold active:bg-rose-600 active:text-white transition-all">Tolak</button>
                  <button onClick={() => handleAction(r._id, "approved")} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold active:scale-95 transition-all">Setujui</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}