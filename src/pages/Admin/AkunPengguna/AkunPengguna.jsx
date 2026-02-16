import { useContext, useEffect, useState } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";
import WelcomeBanner from "../AkunPengguna/components/WelcomeBanner";
import { API } from "../../../global/api";
import ConfirmModal from "./components/ConfirmModal";
import { getToken } from "../../../auth/auth";
import axios from "axios";

import AkunTable from "./components/AkunTable";
import AkunFormModal from "./components/AkunTambah";
import SuccessNotification from "./components/SuccessNotification";

export default function AdminAkun() {
  const topbarCtx = useContext(TopbarContext);

  // State Management
  const [keyword, setKeyword] = useState("");
  const [akunList, setAkunList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for Modals
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // State for Delete Action
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for Notification
  const [notif, setNotif] = useState({
    show: false,
    message: "",
  });

  // Helper untuk memicu notifikasi
  const triggerNotif = (message) => {
    setNotif({ show: true, message });
  };

  // Set Topbar Title
  useEffect(() => {
    if (topbarCtx) {
      topbarCtx.setTopbar((p) => ({
        ...p,
        title: "Manajemen Akun",
        showSearch: false,
      }));
    }
  }, []);

  // Fetch data akun dari API
  const fetchAkun = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/auth/fetchAcc`);
      const users = res.data.users.map((u) => ({
        ...u,
        tanggal: new Date(u.createdAt).toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      }));
      setAkunList(users);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat data akun");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAkun();
  }, []);

  // Fungsi membuka konfirmasi hapus
  const openDeleteConfirm = (akun, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSelectedUser(akun);
    setDeleteModalOpen(true);
  };

  // Eksekusi hapus akun
 const handleConfirmDelete = async () => {
    if (!selectedUser || isDeleting) return;

    const token = getToken(); // Ambil token untuk log
    setIsDeleting(true);
    
    try {
      // 1. Jalankan proses hapus akun
      await axios.delete(`${API}/auth/deleteAcc/${selectedUser._id}`);
      
      // 2. HIT API LOG (Audit Trail)
      if (token) {
        await axios.post(
          `${API}/logs`,
          {
            kategori: "Manajemen Akun",
            aktivitas: `Menghapus akun: ${selectedUser.nama} (NIP: ${selectedUser.nip || "-"})`,
            status: "sukses",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      await fetchAkun();
      setDeleteModalOpen(false);
      
      // Tampilkan notifikasi berhasil hapus
      triggerNotif(`Akun "${selectedUser.nama}" berhasil dihapus dari sistem.`);
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menghapus user");
    } finally {
      setIsDeleting(false);
      setSelectedUser(null);
    }
  };

  // Filter pencarian
  const filteredAkun = akunList.filter(
    (a) =>
      a.email.toLowerCase().includes(keyword.toLowerCase()) ||
      a.nama.toLowerCase().includes(keyword.toLowerCase()) ||
      a.nip.includes(keyword)
  );

  return (
    <div className="p-6 lg:p-0 space-y-8 bg-slate-50 min-h-screen">
      <WelcomeBanner userName="Admin" />

      {/* Notifikasi Global */}
      <SuccessNotification
        show={notif.show}
        message={notif.message}
        onClose={() => setNotif({ ...notif, show: false })}
      />

      <AkunTable
        data={filteredAkun}
        searchValue={keyword}
        onSearchChange={setKeyword}
        onAdd={() => {
          setEditingUser(null);
          setOpenModal(true);
        }}
        onEdit={(user) => {
          setEditingUser(user);
          setOpenModal(true);
        }}
        onDelete={openDeleteConfirm}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Hapus Akun"
        message={`Apakah Anda yakin ingin menghapus user "${selectedUser?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
      />

      {/* Modal Form Tambah & Edit */}
      <AkunFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          fetchAkun();
          triggerNotif(
            editingUser 
              ? "Perubahan akun berhasil disimpan." 
              : "Akun baru berhasil didaftarkan ke sistem."
          );
          setEditingUser(null);
        }}
        editingUser={editingUser}
      />

      {loading && (
        <div className="text-center mt-4 text-slate-500 text-sm animate-pulse">
          Memuat data akun...
        </div>
      )}
    </div>
  );
}