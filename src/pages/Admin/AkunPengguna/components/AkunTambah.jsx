import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../../global/api";
import { getToken } from "../../../../auth/auth";
import { FiX, FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiBriefcase, FiPhone } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AkunFormModal({ open, onClose, onSuccess, editingUser }) {
  const [form, setForm] = useState({
    nama: "", email: "", nip: "", username: "", role: "", bidang: "", password: "", no_hp: "",
  });
  
  const [folders, setFolders] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      axios.get(`${API}/folders/all-folders`).then((res) => setFolders(res.data));
      if (editingUser) {
        setForm({
          ...editingUser,
          bidang: editingUser.bidang?._id || editingUser.bidang || "",
          password: "",
          no_hp: editingUser.no_hp || "",
        });
      } else {
        setForm({ nama: "", email: "", nip: "", username: "", role: "", bidang: "", password: "", no_hp: "" });
      }
      setError("");
    }
  }, [open, editingUser]);

  const handleSubmit = async () => {
    const token = getToken();
    setLoading(true);
    try {
      const payload = { ...form };
      if (payload.role !== "admin") payload.no_hp = "";

      const url = editingUser ? `${API}/auth/editAcc/${editingUser._id}` : `${API}/auth/createAcc`;
      await (editingUser ? axios.put(url, payload) : axios.post(url, payload));

      if (token) {
        await axios.post(`${API}/logs`, {
          kategori: "Manajemen Akun",
          aktivitas: editingUser ? `Update akun: ${form.nama}` : `Tambah akun baru: ${form.nama}`,
          status: "sukses",
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "mb-1.5 block text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest";
  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[3rem] bg-white shadow-2xl flex flex-col max-h-[95vh] md:max-h-none"
          >
            {/* Header Modal */}
            <div className=" rounded-t-[2.5rem] sm:rounded-[3rem] flex items-center justify-between px-6 py-5 md:px-8 md:py-6 border-b border-slate-50 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 hidden sm:block">
                  <FiUser size={20} />
                </div>
                <h2 className="text-base md:text-lg font-bold text-slate-800">
                  {editingUser ? "Konfigurasi Akun" : "Registrasi Akun Baru"}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <FiX size={24} />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-5">
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">
                  ⚠️ {error}
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="col-span-1">
                  <label className={labelClass}>Nama Lengkap</label>
                  <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={inputClass} placeholder="Nama personil" />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>NIP / ID Pegawai</label>
                  <input type="text" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} className={inputClass} placeholder="Nomor Induk" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className={labelClass}>Email Instansi</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`${inputClass} pl-11`} placeholder="email@instansi.go.id" />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Username</label>
                  <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className={inputClass} />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Hak Akses (Role)</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
                    <option value="">Pilih Hak Akses</option>
                    <option value="admin">Administrator</option>
                    <option value="pegawai">Pegawai</option>
                  </select>
                </div>

                {form.role === "admin" && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="col-span-1 md:col-span-2">
                    <label className={labelClass}>Nomor WA (Khusus Admin)</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={form.no_hp} onChange={(e) => setForm({ ...form, no_hp: e.target.value })} className={`${inputClass} pl-11`} placeholder="0812..." />
                    </div>
                  </motion.div>
                )}

                <div className="col-span-1 md:col-span-2">
                  <label className={labelClass}>Penempatan Bidang</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select value={form.bidang} onChange={(e) => setForm({ ...form, bidang: e.target.value })} className={`${inputClass} pl-11 appearance-none`}>
                      <option value="">Pilih Penempatan</option>
                      {folders.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className={labelClass}>Kata Sandi</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`${inputClass} pl-11`} placeholder={editingUser ? "Kosongkan jika tak diubah" : "Minimal 8 karakter"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className=" rounded-t-[2.5rem] sm:rounded-[3rem] p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button onClick={onClose} className="w-full sm:w-auto px-8 py-3.5 md:py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all text-sm order-2 sm:order-1">
                Batalkan
              </button>
              <button onClick={handleSubmit} disabled={loading} className="w-full sm:flex-1 px-8 py-3.5 md:py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all text-sm active:scale-95 disabled:opacity-50 order-1 sm:order-2">
                {loading ? "Menyimpan Data..." : "Simpan Perubahan"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}