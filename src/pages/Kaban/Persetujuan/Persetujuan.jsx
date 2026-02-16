import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth"; 
import { API } from "../../../global/api";

import ApprovalsBanner from "./components/ApprovalsBanner";
import ApprovalsToolbar from "./components/ApprovalsToolbar";
import ApprovalsTable from "./components/ApprovalsTable";

export default function Persetujuan() {
  const { setTopbar } = useContext(TopbarContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setTopbar({ title: "Persetujuan Akses", showSearch: false });
  }, [setTopbar]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
     const token = getToken();
      // Menggunakan API terpusat untuk mengambil permintaan pending
      const res = await axios.get(`${API}/access-requests/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id, status) => {
    const previousData = [...data];
    setData((prev) => prev.filter((item) => item._id !== id));
    const isApprove = status === "approved";

    try {
     const token = getToken();
      await axios.patch(`${API}/access-requests/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotification({
        type: 'success',
        message: `Permintaan berhasil ${isApprove ? 'disetujui' : 'ditolak'}.`
      });
    } catch (err) {
      setData(previousData);
      setNotification({ type: 'error', message: 'Gagal memproses permintaan.' });
    }
  };
const rows = useMemo(() => {
  const formatted = data.map(item => {
    const rawDate = item.tanggalDiajukan;
    let formattedDate = "Tanggal Tidak Valid";

    if (rawDate && typeof rawDate === "string") {
      try {
        // 1. Pisahkan tanggal dari jam (pecah berdasarkan koma)
        // Contoh: "06/02/2026, 13.53 WIT" -> ["06/02/2026", " 13.53 WIT"]
        const parts = rawDate.split(",");
        const datePart = parts[0].trim(); // "06/02/2026"

        // 2. Pecah komponen tanggal (hari/bulan/tahun)
        const [day, month, year] = datePart.split("/");

        // 3. Buat array nama bulan untuk tampilan lebih bagus
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
          "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
        ];

        // 4. Susun format akhir: "06 Feb 2026"
        if (day && month && year) {
          formattedDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
        }
      } catch (e) {
        console.error("Gagal parsing tanggal manual:", e);
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

  if (!q) return formatted;
  return formatted.filter(r => 
    Object.values(r).some(v => String(v).toLowerCase().includes(q.toLowerCase()))
  );
}, [data, q]);

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-6 lg:p-0">
      <div className="max-w-[1400px] mx-auto">
        <ApprovalsBanner />

        {/* Notifikasi Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className={`fixed top-10 right-10 z-[100] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border ${
                notification.type === 'success' ? 'bg-white border-emerald-100' : 'bg-white border-rose-100'
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {notification.type === 'success' ? '✓' : '✕'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{notification.type === 'success' ? 'Berhasil' : 'Gagal'}</p>
                <p className="text-xs text-slate-500 font-medium">{notification.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <ApprovalsToolbar value={q} onChange={setQ} onClear={() => setQ("")} />
          </div>

          <div className="p-4 sm:p-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Sinkronisasi Data...</p>
                </div>
              ) : (
                <ApprovalsTable rows={rows} onApprove={handleAction} onReject={handleAction} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}