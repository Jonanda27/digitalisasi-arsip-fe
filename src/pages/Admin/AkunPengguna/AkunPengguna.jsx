import { useContext, useEffect, useState } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";
import WelcomeBanner from "../AkunPengguna/components/WelcomeBanner";
import { API } from "../../../global/api";
import { getToken } from "../../../auth/auth";
import axios from "axios";
import { motion } from "framer-motion";

import AkunTable from "./components/AkunTable";
import AkunFormModal from "./components/AkunTambah";
import SuccessNotification from "./components/SuccessNotification";
import ConfirmModal from "./components/ConfirmModal";

export default function AdminAkun() {
  const topbarCtx = useContext(TopbarContext);
  const [keyword, setKeyword] = useState("");
  const [akunList, setAkunList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notif, setNotif] = useState({ show: false, message: "" });

  const triggerNotif = (message) => setNotif({ show: true, message });

  useEffect(() => {
    topbarCtx?.setTopbar((p) => ({ ...p, title: "Manajemen Akun", showSearch: false }));
  }, []);

  const fetchAkun = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/auth/fetchAcc`);
      const users = res.data.users.map((u) => ({
        ...u,
        tanggal: new Date(u.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit", month: "short", year: "numeric"
        }),
      }));
      setAkunList(users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAkun(); }, []);

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    const token = getToken();
    setIsDeleting(true);
    try {
      await axios.delete(`${API}/auth/deleteAcc/${selectedUser._id}`);
      if (token) {
        await axios.post(`${API}/logs`, {
          kategori: "Manajemen Akun",
          aktivitas: `Menghapus akun: ${selectedUser.nama}`,
          status: "sukses",
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchAkun();
      setDeleteModalOpen(false);
      triggerNotif(`Akun "${selectedUser.nama}" berhasil dihapus.`);
    } catch (err) {
      alert("Gagal menghapus user");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAkun = akunList.filter(a => 
    a.nama.toLowerCase().includes(keyword.toLowerCase()) || 
    a.email.toLowerCase().includes(keyword.toLowerCase()) ||
    (a.nip && a.nip.includes(keyword))
  );

  return (
    <div className="p-4 md:p-6 lg:p-0 space-y-6 bg-slate-50 bg-gradient-to-r  from-blue-100 via-blue-50/30 to-white 
                    md:from-transparent md:via-transparent md:to-transparent min-h-screen pb-24">
      <WelcomeBanner />
      
      <SuccessNotification 
        show={notif.show} 
        message={notif.message} 
        onClose={() => setNotif({ ...notif, show: false })} 
      />

      <AkunTable
        data={filteredAkun}
        searchValue={keyword}
        onSearchChange={setKeyword}
        onAdd={() => { setEditingUser(null); setOpenModal(true); }}
        onEdit={(user) => { setEditingUser(user); setOpenModal(true); }}
        onDelete={(user) => { setSelectedUser(user); setDeleteModalOpen(true); }}
        loading={loading}
      />

      <AkunFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => { fetchAkun(); triggerNotif(editingUser ? "Perubahan disimpan" : "Akun dibuat"); }}
        editingUser={editingUser}
      />

      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Hapus Akun"
        message={`Hapus akun ${selectedUser?.nama}?`}
      />
    </div>
  );
}