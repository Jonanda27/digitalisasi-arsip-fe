import { useContext, useEffect, useMemo, useState } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";

import FilterBar from "./components/FilterBar";
import LogTable from "./components/LogTable";

const MOCK_LOGS = [
  {
    id: "001",
    datetime: "04/12/2026, 22:36 WIT",
    kategori: "Persetujuan Akses",
    aktivitas: "Menerima permintaan akses",
    status: "sukses",
    kerahasiaan: "umum",
  },
  {
    id: "002",
    datetime: "05/12/2025, 12:30 WIT",
    kategori: "Persetujuan Akses",
    aktivitas: "Menolak permintaan akses",
    status: "sukses",
    kerahasiaan: "terbatas",
  },
  {
    id: "003",
    datetime: "07/01/2026, 12:30 WIT",
    kategori: "Sistem",
    aktivitas: "Login sistem",
    status: "sukses",
    kerahasiaan: "umum",
  },
  // dummy biar keliatan table panjang
  ...Array.from({ length: 12 }, (_, i) => ({
    id: String(4 + i).padStart(3, "0"),
    datetime: `0${(i % 9) + 1}/12/2026, 0${(i % 9) + 1}:1${i} WIT`,
    kategori: i % 2 === 0 ? "Arsip" : "Sistem",
    aktivitas: i % 3 === 0 ? "Mengunduh dokumen" : i % 3 === 1 ? "Membuka dokumen" : "Perubahan metadata",
    status: i % 4 === 0 ? "gagal" : "sukses",
    kerahasiaan: i % 3 === 0 ? "umum" : i % 3 === 1 ? "terbatas" : "rahasia",
  })),
];

export default function Log() {
  const { setTopbar } = useContext(TopbarContext);

  useEffect(() => {
    setTopbar({
      title: "Log Aktivitas",
      showSearch: false, // di desain search nggak dipakai, yang ada filter
      searchPlaceholder: "Cari dokumen",
      onSearch: null,
    });
  }, [setTopbar]);

  const [status, setStatus] = useState("");
  const [urutkan, setUrutkan] = useState("tanggal_desc");

  const rows = useMemo(() => {
    let data = [...MOCK_LOGS];

    if (status) data = data.filter((r) => r.status === status);

    if (urutkan === "tanggal_desc") {
      // mock: anggap string datetime sudah urut, jadi reverse aja biar efek "terbaru"
      data = [...data].reverse();
    }
    if (urutkan === "id_asc") data = [...data].sort((a, b) => a.id.localeCompare(b.id));
    if (urutkan === "id_desc") data = [...data].sort((a, b) => b.id.localeCompare(a.id));

    return data;
  }, [status, urutkan]);

  const applyFilter = () => {
    // di FE ini sebenarnya filter sudah live, tombol hanya untuk UI mockup
    console.log("Terapkan Filter");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-5">
          <FilterBar
            status={status}
            setStatus={setStatus}
            urutkan={urutkan}
            setUrutkan={setUrutkan}
            onApply={applyFilter}
          />
        </div>

        <div className="px-5 pb-5">
          <LogTable rows={rows} />
        </div>
      </div>
    </div>
  );
}
