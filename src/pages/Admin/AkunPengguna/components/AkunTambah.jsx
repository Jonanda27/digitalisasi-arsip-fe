import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../../global/api";
import { getToken } from "../../../../auth/auth"; // Tambahkan import ini
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";

export default function AkunFormModal({
  open,
  onClose,
  onSuccess,
  editingUser,
}) {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    nip: "",
    username: "",
    role: "",
    bidang: "",
    password: "",
    no_hp: "",
  });
  
  const [folders, setFolders] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      axios
        .get(`${API}/folders/all-folders`)
        .then((res) => setFolders(res.data));
      if (editingUser) {
        setForm({
          ...editingUser,
          bidang: editingUser.bidang?._id || editingUser.bidang || "",
          password: "",
          no_hp: editingUser.no_hp || "",
        });
      } else {
        setForm({
          nama: "",
          email: "",
          nip: "",
          username: "",
          role: "",
          bidang: "",
          password: "",
          no_hp: "",
        });
      }
      setError("");
    }
  }, [open, editingUser]);

  const handleSubmit = async () => {
    const token = getToken(); // Ambil token untuk log
    setLoading(true);
    try {
      const payload = { ...form };
      if (payload.role !== "admin") {
        payload.no_hp = "";
      }

      const url = editingUser 
        ? `${API}/auth/editAcc/${editingUser._id}`
        : `${API}/auth/createAcc`;
      
      // 1. Jalankan proses Simpan/Edit Akun
      await (editingUser ? axios.put(url, payload) : axios.post(url, payload));

      // 2. HIT API LOG (Audit Trail)
      if (token) {
        await axios.post(
          `${API}/logs`,
          {
            kategori: "Manajemen Akun",
            aktivitas: editingUser 
              ? `Memperbarui data akun: ${form.nama} (Username: ${form.username})`
              : `Mendaftarkan akun baru: ${form.nama} (Username: ${form.username})`,
            status: "sukses",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all";
  const labelClass =
    "mb-1.5 block text-[11px] font-black text-slate-400 uppercase tracking-widest";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-[2.5rem] bg-white shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {editingUser ? "Perbarui Akun" : "Daftarkan Akun Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <FiX />
          </button>
        </div>

        <div className="p-8 grid grid-cols-2 gap-5">
          {error && (
            <div className="col-span-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">
              {error}
            </div>
          )}

          {/* Form fields tetap sama seperti sebelumnya */}
          <div className="col-span-2 md:col-span-1">
            <label className={labelClass}>Nama Lengkap</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className={inputClass}
              placeholder="Contoh: Budi Santoso"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className={labelClass}>NIP / ID Pegawai</label>
            <input
              type="text"
              value={form.nip}
              onChange={(e) => setForm({ ...form, nip: e.target.value })}
              className={inputClass}
              placeholder="199208..."
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Email Instansi</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              placeholder="budi@instansi.go.id"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className={labelClass}>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className={labelClass}>Hak Akses (Role)</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={inputClass}
            >
              <option value="">Pilih Role</option>
              <option value="admin">Administrator</option>
              <option value="pegawai">Pegawai Tetap</option>
            </select>
          </div>

          {form.role === "admin" && (
            <div className="col-span-2 animate-in slide-in-from-top-2 duration-300">
              <label className={labelClass}>Nomor WhatsApp / HP</label>
              <input
                type="text"
                value={form.no_hp}
                onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                className={inputClass}
                placeholder="0812xxxx"
              />
            </div>
          )}

          <div className="col-span-2">
            <label className={labelClass}>Penempatan Bidang</label>
            <select
              value={form.bidang}
              onChange={(e) => setForm({ ...form, bidang: e.target.value })}
              className={inputClass}
            >
              <option value="">Pilih Bidang</option>
              {folders.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 relative">
            <label className={labelClass}>Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass}
                placeholder={
                  editingUser
                    ? "Kosongkan jika tidak ingin diubah"
                    : "Minimal 8 karakter"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm active:scale-95 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Konfigurasi"}
          </button>
        </div>
      </div>
    </div>
  );
}