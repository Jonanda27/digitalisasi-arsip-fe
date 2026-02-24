import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { getToken } from "../../../../auth/auth";
import { API } from "../../../../global/api";
import SuccessNotification from "./SuccessNotification";

export default function RequestAccessModal({ open, onClose, file }) {
  const [keperluan, setKeperluan] = useState("");
  const [lamaAksesHari, setLamaAksesHari] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setKeperluan("");
      setLamaAksesHari(1);
    }
  }, [open]);

  if (!open && !showSuccess) return null;

  const submit = async () => {
    const token = getToken();
    if (!token) return alert("Anda belum login");
    if (!keperluan.trim()) return alert("Harap isi keperluan akses");

    try {
      setLoading(true);
      await axios.post(
        `${API}/access-requests/akses`,
        {
          fileId: file?._id,
          keperluan: keperluan,
          lamaAkses: Number(lamaAksesHari),
          kerahasiaan: file?.kerahasiaan,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.post(
        `${API}/logs`,
        {
          kategori: "Persetujuan Akses",
          aktivitas: `Meminta akses dokumen: ${file?.namaFile || file?.originalName}`,
          status: "sukses",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowSuccess(true);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengirim permintaan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              // Responsive: w-full max-w-sm (Mobile), sm:max-w-md (Desktop)
              className="relative w-full max-w-sm sm:max-w-md bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="pt-6 sm:pt-10 px-6 text-center">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tighter">
                  Minta Akses
                </h3>
                {/* Mobile Only: Nama File Ringkas */}
                <p className="block sm:hidden text-[11px] font-bold text-blue-600 mt-1 truncate px-4">
                   {file?.namaFile || file?.originalName}
                </p>
                <p className="hidden sm:block text-[9px] text-slate-400 font-bold uppercase tracking-[0.25em] mt-2">
                  Formulir Permohonan
                </p>
              </div>

              {/* Content Area */}
              <div className="px-5 py-6 sm:px-10 sm:py-8">
                
                {/* Target Dokumen Card: Hanya tampil di Desktop/iPad */}
                <div className="hidden sm:block mb-8 p-6 rounded-[2rem] bg-[#F4F9FF] border border-blue-100/50 text-left">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    Target Dokumen:
                  </span>
                  <p className="text-[15px] font-black text-slate-700 leading-tight mt-1">
                    {file?.namaFile || file?.originalName || "DOKUMEN E-ARSIP"}
                  </p>
                  <div className="mt-4 text-left">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase text-white ${
                      file?.kerahasiaan?.toLowerCase() === "rahasia" ? "bg-red-500" : "bg-[#FF6B00]"
                    }`}>
                      {file?.kerahasiaan || "TERBATAS"}
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col items-start">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1.5">
                      Keperluan
                    </label>
                    <textarea
                      className="w-full rounded-[1.2rem] sm:rounded-[1.5rem] border-2 border-slate-50 bg-[#F8FAFC] p-4 sm:p-5 text-xs sm:text-sm font-medium text-slate-600 focus:bg-white focus:border-blue-500/50 outline-none transition-all resize-none"
                      rows="3"
                      placeholder="Alasan peminjaman..."
                      value={keperluan}
                      onChange={(e) => setKeperluan(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col items-start">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1.5">
                      Durasi Akses
                    </label>
                    <div className="relative w-full">
                      <input
                        type="number"
                        min={1}
                        className="w-full rounded-[1.2rem] sm:rounded-[1.5rem] border-2 border-slate-50 bg-[#F8FAFC] p-4 sm:p-5 text-xs sm:text-sm font-black text-slate-800 focus:bg-white focus:border-blue-500/50 outline-none transition-all"
                        value={lamaAksesHari}
                        onChange={(e) => setLamaAksesHari(e.target.value)}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">
                        Hari
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 sm:mt-10 space-y-2 sm:space-y-4">
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full py-4 sm:py-5 rounded-[1.2rem] sm:rounded-[1.5rem] bg-[#1F5EFF] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-lg hover:bg-blue-700 active:scale-[0.97] transition-all disabled:opacity-50"
                  >
                    {loading ? "Mengirim..." : "Kirim Permintaan"}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-600 transition-colors"
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SuccessNotification
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Permintaan akses berhasil dikirim."
      />
    </>
  );
}