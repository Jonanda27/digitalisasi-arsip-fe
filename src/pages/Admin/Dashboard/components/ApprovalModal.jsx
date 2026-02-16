import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../../auth/auth";
import { API } from "../../../../global/api";

// --- HELPER FUNCTION (YANG SUDAH DIPERBAIKI) ---
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

// --- COMPONENT ---
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all p-4">
      {/* Container Modal lebih lebar (max-w-3xl) */}
      <div className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Permintaan Akses</h2>
              <p className="text-sm text-slate-500 mt-0.5">Daftar pegawai yang membutuhkan izin dokumen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          {loading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-200"></div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 rounded-full bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <svg className="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Tidak ada permintaan baru</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">Semua permintaan akses dokumen telah Anda tinjau. Kerja bagus!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((r) => (
                <div
                  key={r._id}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-300/50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    
                    {/* Icon File */}
                    <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      {/* Title & Date */}
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {r.file?.namaFile || "Dokumen Tanpa Nama"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                             <span>Diajukan: {formatDate(r.tanggalDiajukan)}</span>
                          </div>
                        </div>
                        
                        {/* Status Badge (Static) */}
                        {r.status !== 'pending' && (
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              r.status === 'approved' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-rose-100 text-rose-700'
                           }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                              {r.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                           </span>
                        )}
                      </div>

                      {/* User Info & Reason Box */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* User */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                           <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                              {r.user?.nama ? r.user.nama.charAt(0).toUpperCase() : "?"}
                           </div>
                           <div className="overflow-hidden">
                              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pemohon</p>
                              <p className="text-sm font-semibold text-slate-700 truncate">{r.user?.nama}</p>
                           </div>
                        </div>

                        {/* Reason */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Keperluan</p>
                            <p className="text-sm text-slate-700 mt-0.5 line-clamp-2" title={r.keperluan}>{r.keperluan}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions (Buttons) */}
                    {r.status === "pending" && (
                       <div className="flex flex-row lg:flex-col gap-3 lg:w-32 flex-shrink-0 pt-4 lg:pt-0 lg:border-l border-slate-100 lg:pl-6">
                          <button
                            disabled={processingId === r._id}
                            onClick={() => handleStatus(r._id, "approved")}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:shadow-none transition-all"
                          >
                            {processingId === r._id ? (
                               <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                            ) : "Setujui"}
                          </button>
                          
                          <button
                            disabled={processingId === r._id}
                            onClick={() => handleStatus(r._id, "rejected")}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
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

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-right">
           <button 
             onClick={onClose} 
             className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-colors"
           >
             Tutup
           </button>
        </div>

      </div>
    </div>
  );
}