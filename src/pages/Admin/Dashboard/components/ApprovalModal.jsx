import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../../auth/auth";
import { API } from "../../../../global/api";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return dateString;
};

export default function ApprovalModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!open) return;
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) return;
        const res = await axios.get(
          `${API}/access-requests/pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(res.data);
      } catch (err) {
        console.error("ERROR FETCH:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [open]);

  const handleStatus = async (id, status) => {
    try {
      setProcessingId(id);
      const token = getToken();
      if (!token) return;

      await axios.patch(
        `${API}/access-requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests((prev) =>
        prev.map((r) =>
          r._id === id
            ? {
                ...r,
                status,
                tanggalDisetujui: status === "approved" ? new Date().toISOString() : null,
              }
            : r
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengubah status");
    } finally {
      setProcessingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
      {/* Container Modal: Fullscreen di mobile (items-end), Boxed di desktop */}
      <div className="w-full max-w-3xl h-[90vh] sm:h-auto max-h-[90vh] sm:max-h-[85vh] transform overflow-hidden rounded-t-[2.5rem] sm:rounded-3xl bg-white shadow-2xl transition-all flex flex-col">
        
        {/* Header: Padding lebih kecil di mobile */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8 sm:py-6 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Permintaan Akses</h2>
              <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5">Izin dokumen pegawai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content Area: Scrolling area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-5 sm:p-8">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 sm:h-40 animate-pulse rounded-2xl bg-slate-200"></div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-white p-5 shadow-sm ring-1 ring-slate-100 text-slate-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 className="font-semibold text-slate-900">Kosong</h3>
              <p className="text-xs text-slate-500 mt-1 px-10">Tidak ada permintaan tertunda.</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {requests.map((r) => (
                <div
                  key={r._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div className="max-w-[70%] sm:max-w-none">
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 break-words">
                            {r.file?.namaFile || "Dokumen Tanpa Nama"}
                          </h3>
                          <p className="text-[10px] sm:text-sm text-slate-500 mt-1 italic">
                            {formatDate(r.tanggalDiajukan)}
                          </p>
                        </div>
                        
                        {r.status !== 'pending' && (
                           <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              r.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                           }`}>
                             {r.status === 'approved' ? 'OK' : 'Batal'}
                           </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                           <div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                              {r.user?.nama ? r.user.nama.charAt(0).toUpperCase() : "?"}
                           </div>
                           <div className="min-w-0">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Pemohon</p>
                              <p className="text-xs font-semibold text-slate-700 truncate">{r.user?.nama}</p>
                           </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Keperluan</p>
                            <p className="text-xs text-slate-700 mt-0.5 line-clamp-2 italic">{r.keperluan}</p>
                        </div>
                      </div>
                    </div>

                    {/* Button Group: Sejajar di mobile, Vertikal di desktop */}
                    {r.status === "pending" && (
                       <div className="flex flex-row lg:flex-col gap-2 pt-3 sm:pt-4 lg:pt-0 lg:border-l border-slate-100 lg:pl-6 shrink-0">
                          <button
                            disabled={processingId === r._id}
                            onClick={() => handleStatus(r._id, "approved")}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all disabled:opacity-50"
                          >
                            {processingId === r._id ? "..." : "Setujui"}
                          </button>
                          
                          <button
                            disabled={processingId === r._id}
                            onClick={() => handleStatus(r._id, "rejected")}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs sm:text-sm font-bold text-slate-600 active:bg-rose-50 transition-all disabled:opacity-50"
                          >
                            Tolak
                          </button>
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Hidden on small mobile to save space, but visible on tablets/desktop */}
        <div className="hidden sm:block bg-slate-50 px-8 py-4 border-t border-slate-100 text-right">
            <button 
              onClick={onClose} 
              className="px-6 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-200 transition-colors"
            >
              Tutup
            </button>
        </div>

      </div>
    </div>
  );
}