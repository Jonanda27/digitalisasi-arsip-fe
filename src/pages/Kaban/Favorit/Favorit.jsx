import { useEffect, useMemo, useState, useContext } from "react";
import FilterBar from "./components/FilterBar";
import FavoriteList from "./components/FavoriteList";
import { TopbarContext } from "../../../layouts/AppLayout";

const MOCK_FAVS = [
  {
    id: "f1",
    title: "Peraturan Bupati Tahun 2020",
    nomorSurat: "973 / 045 / BAPENDA / 2024",
    nomorArsip: "20240520-143005",
    tahun: "2024",
    akses: "rahasia",
    tipe: "Peraturan",
    requestStatus: "dikirim", // dikirim | ditolak | null
    isFavorite: true,
  },
  {
    id: "f2",
    title: "Surat Pelayanan Wajib Pajak",
    nomorSurat: "973 / 045 / BAPENDA / 2024",
    nomorArsip: "20240520-143005",
    tahun: "2024",
    akses: "rahasia",
    tipe: "Surat",
    requestStatus: null,
    isFavorite: true,
  },
  {
    id: "f3",
    title: "Surat Edaran Kepala Badan",
    nomorSurat: "973 / 045 / BAPENDA / 2024",
    nomorArsip: "20240520-143005",
    tahun: "2024",
    akses: "rahasia",
    tipe: "Surat Edaran",
    requestStatus: "ditolak",
    isFavorite: true,
  },
];

export default function Favorit() {
  const { setTopbar } = useContext(TopbarContext);

  useEffect(() => {
    // Favorit: sesuai desain, search ada di filter bar (bukan topbar)
    setTopbar({
      title: "Favorit",
      showSearch: false,
      searchPlaceholder: "Cari dokumen",
      onSearch: null,
    });
  }, [setTopbar]);

  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("");
  const [akses, setAkses] = useState("");
  const [urutkan, setUrutkan] = useState("");

  const [favorites, setFavorites] = useState(() => new Set(MOCK_FAVS.map((d) => d.id)));

  const data = useMemo(() => {
    // base list = yang favorit
    let rows = MOCK_FAVS.filter((d) => favorites.has(d.id));

    // filter
    if (tipe) rows = rows.filter((d) => d.tipe === tipe);
    if (akses) rows = rows.filter((d) => d.akses === akses);

    // search
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.nomorSurat.toLowerCase().includes(q) ||
          d.nomorArsip.toLowerCase().includes(q) ||
          String(d.tahun).includes(q)
      );
    }

    // sort
    if (urutkan === "judul_asc") rows = [...rows].sort((a, b) => a.title.localeCompare(b.title));
    if (urutkan === "judul_desc") rows = [...rows].sort((a, b) => b.title.localeCompare(a.title));
    if (urutkan === "tahun_desc") rows = [...rows].sort((a, b) => String(b.tahun).localeCompare(String(a.tahun)));
    if (urutkan === "tahun_asc") rows = [...rows].sort((a, b) => String(a.tahun).localeCompare(String(b.tahun)));

    return rows;
  }, [search, tipe, akses, urutkan, favorites]);

  const onApply = () => {
    // desain tombol "Terapkan Filter" (di FE ini sebenernya filter sudah live)
    // jadi cukup placeholder biar sesuai UI
    console.log("Apply filter");
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      {/* Card besar putih seperti desain */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <FilterBar
          tipe={tipe}
          setTipe={setTipe}
          akses={akses}
          setAkses={setAkses}
          urutkan={urutkan}
          setUrutkan={setUrutkan}
          search={search}
          setSearch={setSearch}
          onApply={onApply}
        />

        <div className="mt-6">
          <FavoriteList
            items={data}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </div>
    </div>
  );
}
