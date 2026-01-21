import { useContext, useEffect, useState } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";
import axios from "axios";

import AkunTable from "./components/AkunTable";
import AkunFormModal from "./components/AkunTambah"; // modal gabungan tambah & edit

export default function AdminAkun() {
  const topbarCtx = useContext(TopbarContext);
  const [keyword, setKeyword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [akunList, setAkunList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    topbarCtx?.setTopbar((p) => ({
      ...p,
      title: "Manajemen Akun",
      showSearch: false,
    }));
  }, [topbarCtx]);

  // Fetch data akun dari API
  const fetchAkun = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/auth/fetchAcc"); // pastikan endpoint sesuai
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAkun();
  }, []);

  // Hapus akun
  const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = async (akun, e) => {
  // 1. Hentikan perambatan event ke elemen induk
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  // 2. Cegah fungsi berjalan jika sedang dalam proses (Debounce sederhana)
  if (isDeleting) return;

  const confirmDelete = window.confirm(`Apakah anda yakin ingin menghapus user "${akun.nama}"?`);
  
  if (confirmDelete) {
    setIsDeleting(true); // Kunci proses
    try {
      await axios.delete(`http://localhost:4000/api/auth/deleteAcc${akun.id}`);
      fetchAkun(); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menghapus user");
    } finally {
      setIsDeleting(false); // Buka kunci setelah selesai
    }
  }
};

  // Filter akun berdasarkan keyword
  const filteredAkun = akunList.filter(
    (a) =>
      a.email.toLowerCase().includes(keyword.toLowerCase()) ||
      a.nama.toLowerCase().includes(keyword.toLowerCase()) ||
      a.nip.includes(keyword)
  );

  return (
    <>
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
        onDelete={handleDelete}
      />

      <AkunFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          fetchAkun();
          setEditingUser(null);
        }}
        editingUser={editingUser}
      />

      {loading && (
        <div className="text-center mt-4 text-slate-500 text-sm">
          Memuat data akun...
        </div>
      )}
    </>
  );
}
