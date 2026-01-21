import { useState, useEffect } from "react";
import axios from "axios";
import SuccessToast from "./SuccessNotification";

export default function AkunFormModal({ open, onClose, onSuccess, editingUser }) {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    nip: "",
    username: "",
    role: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);

  useEffect(() => {
  if (open) {
    if (editingUser) {
      setForm({
        nama: editingUser.nama || "",
        email: editingUser.email || "",
        nip: editingUser.nip || "",
        username: editingUser.username || "",
        role: editingUser.role || "",
        password: "",
      });
    } else {
      setForm({
        nama: "",
        email: "",
        nip: "",
        username: "",
        role: "",
        password: "",
      });
    }
    setError(""); // reset error juga
    setShowPassword(false); // reset toggle password
  }
}, [open, editingUser]);


  // --- LOGIKA BARU ---
  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (editingUser) {
        await axios.put(`http://localhost:4000/api/auth/editAcc${editingUser.id}`, form);
      } else {
        await axios.post("http://localhost:4000/api/auth/createAcc", form);
      }

      // Langkah 1: Jalankan refresh tabel di parent
      onSuccess && onSuccess(); 
      // Langkah 2: Tutup modal input
      onClose(); 
      // Langkah 3: Munculkan notifikasi sukses (SuccessNotification akan menghilang sendiri)
      setShowSuccessNotif(true);

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Terjadi kesalahan server");
      } else {
        setError("Tidak bisa terhubung ke server");
      }
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = editingUser ? "Edit Akun" : "Tambah Akun";
  const submitText = editingUser ? "Simpan Perubahan" : "Tambahkan";

  return (
    <>
      {/* SuccessToast diletakkan di luar kondisi {open} agar tetap aktif saat modal tutup */}
      <SuccessToast
        show={showSuccessNotif}
        onClose={() => setShowSuccessNotif(false)}
      />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-base font-semibold text-slate-800">{modalTitle}</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>

            <div className="px-6 py-5 space-y-4 text-sm">
              {error && <div className="text-red-500 text-xs">{error}</div>}

              <div>
                <label className="mb-1 block text-slate-600">Nama</label>
                <input type="text" name="nama" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>

              <div>
                <label className="mb-1 block text-slate-600">Email</label>
                <input type="email" name="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>

              <div>
                <label className="mb-1 block text-slate-600">NIP</label>
                <input type="text" name="nip" value={form.nip} onChange={(e) => setForm({...form, nip: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>

              <div>
                <label className="mb-1 block text-slate-600">Username</label>
                <input type="text" name="username" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>

              <div>
                <label className="mb-1 block text-slate-600">Role</label>
                <select name="role" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Pilih Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Pegawai">Pegawai</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-slate-600">Password</label>
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder={editingUser ? "(kosongkan jika tidak ingin diubah)" : ""} className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <label className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="h-3.5 w-3.5" />
                  Tampilkan Password
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4">
              <button onClick={onClose} className="rounded-md bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600">Batalkan</button>
              <button onClick={handleSubmit} disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700">
                {loading ? "Memproses..." : submitText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}