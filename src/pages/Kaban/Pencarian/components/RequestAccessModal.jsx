import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../../auth/auth";
import { API } from "../../../../global/api";

// Pastikan menerima 'file' (bukan fileId) karena SearchResults mengirim file={selectedFile}
export default function RequestAccessModal({ open, onClose, file }) {
  const [keperluan, setKeperluan] = useState("");
  const [lamaAksesHari, setLamaAksesHari] = useState(1);
  const [loading, setLoading] = useState(false);

  // Debugging untuk memastikan data masuk
  useEffect(() => {
    if (open) {
      console.log("Data File di Modal:", file);
    }
  }, [open, file]);

  if (!open) return null;

  const submit = async () => {
    const token = getToken();
    if (!token) {
      alert("Anda belum login");
      return;
    }

    if (!keperluan.trim()) {
      alert("Harap isi keperluan akses");
      return;
    }

    try {
      setLoading(true);
      const idFile = file?._id;
      // Ambil data kerahasiaan dari objek file yang di-pass sebagai props
      const kerahasiaanFile = file?.kerahasiaan;

      if (!idFile) {
        alert("ID Dokumen tidak ditemukan");
        return;
      }
      await axios.post(
        `${API}/access-requests/akses`,
        {
          fileId: idFile,
          keperluan: keperluan,
          lamaAkses: Number(lamaAksesHari),
          kerahasiaan: file?.kerahasiaan || "Terbatas",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // 2. HIT API LOG (Otomatis mencatat aktivitas peminjaman)
      await axios.post(
        `${API}/logs`,
        {
          kategori: "Persetujuan Akses",
          aktivitas: `Mengajukan izin akses dokumen: ${file?.namaFile || file?.originalName}`,
          status: "sukses",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Permintaan akses berhasil dikirim");
      setKeperluan("");
      onClose();
    } catch (err) {
      // ... handle error ...
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="mb-1 text-lg font-semibold text-slate-900">
          Minta Akses Dokumen
        </h3>
        <div className="mb-4">
          <p className="text-sm text-slate-700 font-medium">
            File:{" "}
            <span className="text-blue-600">
              {file?.namaFile || file?.originalName}
            </span>
          </p>
          {/* Menampilkan Badge Kerahasiaan di Modal */}
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
              file?.kerahasiaan?.toLowerCase() === "rahasia"
                ? "bg-red-500"
                : "bg-amber-500"
            }`}
          >
            Tingkat: {file?.kerahasiaan || "Terbatas"}
          </span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Keperluan Akses
            </label>
            <textarea
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder="Jelaskan alasan Anda meminta akses..."
              value={keperluan}
              onChange={(e) => setKeperluan(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Lama Akses (hari)
            </label>
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={lamaAksesHari}
              onChange={(e) => setLamaAksesHari(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            Batal
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className={`rounded-lg bg-[#1F5EFF] px-6 py-2 text-sm font-bold text-white transition-all ${
              loading ? "opacity-50" : "hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "Mengirim..." : "Submit Permintaan"}
          </button>
        </div>
      </div>
    </div>
  );
}
