import { useState } from "react";
import axios from "axios";
import { API } from "../../../../global/api";
import { getToken } from "../../../../auth/auth"; // TAMBAHKAN INI

export default function CreateFolderModal({ open, onClose, onSuccess, parent }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama folder wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = getToken(); // DEFINISIKAN TOKEN DI SINI

      await axios.post(
        `${API}/folders/createFol`,
        {
          name: name.trim(),
          parent: parent || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setName("");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Gagal membuat folder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Buat Folder Baru</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nama Folder</label>
            <input
              type="text"
              autoFocus
              placeholder="Contoh: Laporan Keuangan 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>

          {error && <p className="text-sm font-medium text-rose-500 bg-rose-50 p-3 rounded-xl">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
            >
              {loading ? "Menyimpan..." : "Buat Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}