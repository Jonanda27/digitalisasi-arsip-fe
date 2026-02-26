import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth"; 
import { API } from "../../../global/api";

// Import Komponen Pendukung
import ApprovalsBanner from "./components/ApprovalsBanner";
import ApprovalsToolbar from "./components/ApprovalsToolbar";
import ApprovalsTable from "./components/ApprovalsTable";
import SuccessNotification from "./components/SuccessNotification";

export default function Persetujuan() {
  const { setTopbar } = useContext(TopbarContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  
  // State untuk Notifikasi Sukses
  const [showNotify, setShowNotify] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState("");

  // 1. Sinkronisasi Topbar
  useEffect(() => {
    setTopbar({ title: "Persetujuan Akses", showSearch: false });
  }, [setTopbar]);

  // 2. Ambil Data dari API
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await axios.get(`${API}/access-requests/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gagal mengambil data persetujuan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchRequests(); 
  }, []);

  // 3. Fungsi Aksi (Approve/Reject)
  const handleAction = async (id, status) => {
    const previousData = [...data];
    const itemTarget = data.find((item) => item._id === id);
    const isApprove = status === "approved";

    // Optimistic Update: Hapus dari list segera agar UI terasa cepat
    setData((prev) => prev.filter((item) => item._id !== id));

    try {
      const token = getToken();
      await axios.patch(`${API}/access-requests/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Tampilkan Notifikasi Sukses
      setNotifyMsg(`Permintaan ${itemTarget?.user?.nama || 'Akses'} telah ${isApprove ? 'disetujui' : 'ditolak'}.`);
      setShowNotify(true);

    } catch (err) {
      // Kembalikan data jika API gagal
      setData(previousData);
      console.error("Gagal memproses aksi:", err);
      alert("Terjadi kesalahan sistem. Sila coba lagi.");
    }
  };

  // 4. Transformasi Data & Filtering (Memoized)
  const rows = useMemo(() => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];

    const formatted = data.map(item => {
      const rawDate = item.tanggalDiajukan;
      let formattedDate = "Waktu tidak valid";

      if (rawDate && typeof rawDate === "string") {
        try {
          // Parsing format: "DD/MM/YYYY, HH.mm WIT"
          const datePart = rawDate.split(",")[0].trim(); 
          const [day, month, year] = datePart.split("/");
          if (day && month && year) {
            formattedDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
          }
        } catch (e) {
          formattedDate = rawDate; // Fallback ke string asli
        }
      }

      return {
        id: item._id,
        tanggal: formattedDate,
        pemohon: item.user?.nama || "User",
        fileTujuan: item.file?.namaFile || "Dokumen",
        tipeDokumen: item.keperluan || "Urusan Dinas",
        tingkat: item.file?.kerahasiaan || "Umum",
      };
    });

    if (!q.trim()) return formatted;
    
    return formatted.filter(r => 
      r.pemohon.toLowerCase().includes(q.toLowerCase()) ||
      r.fileTujuan.toLowerCase().includes(q.toLowerCase()) ||
      r.tipeDokumen.toLowerCase().includes(q.toLowerCase())
    );
  }, [data, q]);

  return (
    <div className="min-h-screen bg-[#F6F8FC] bg-gradient-to-r  from-blue-100 via-blue-50/30 to-white 
                    md:from-transparent md:via-transparent md:to-transparent pb-20">
      {/* Notifikasi Global */}
      <SuccessNotification 
        show={showNotify} 
        onClose={() => setShowNotify(false)} 
        message={notifyMsg} 
      />

      <div className="px-4 md:px-8 pt-6 md:pt-10">
        <div className="max-w-[1400px] mx-auto">
          <ApprovalsBanner />

          <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden mt-6">
            {/* Toolbar Area */}
            <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30">
              <ApprovalsToolbar 
                value={q} 
                onChange={setQ} 
                onClear={() => setQ("")} 
              />
            </div>

            {/* Content Area */}
            <div className="p-4 md:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loader"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="py-24 text-center flex flex-col items-center gap-4"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-slate-100 rounded-full" />
                      <div className="absolute top-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.25em]">Memuat Antrean...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="table-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ApprovalsTable 
                      rows={rows} 
                      onApprove={handleAction} 
                      onReject={handleAction} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary */}
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                {rows.length} Permintaan Ditemukan
              </p>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}