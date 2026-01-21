import { useMemo, useState, useContext, useEffect } from "react";
import SearchResults from "./components/SearchResults";
import SidePanels from "./components/SidePanels";
import { TopbarContext } from "../../../layouts/AppLayout";

const MOCK_DOCS = [
  {
    id: "d1",
    title: "Surat Pelayanan Wajib Pajak",
    nomorSurat: "973 / 045 / BAPENDA / 2024",
    nomorArsip: "20240520-143005",
    tahun: "2024",
    akses: "umum",
  },
  {
    id: "d2",
    title: "Surat Ketetapan Pajak Daerah",
    nomorSurat: "973 / 046 / BAPENDA / 2024",
    nomorArsip: "20240520-143006",
    tahun: "2024",
    akses: "terbatas",
  },
  {
    id: "d3",
    title: "Peraturan Bupati Tahun 2020",
    nomorSurat: "180 / 012 / SETDA / 2020",
    nomorArsip: "20200115-091200",
    tahun: "2020",
    akses: "rahasia",
  },

  // ===== dummy tambahan buat test scroll =====
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `dx-${i}`,
    title: `Dokumen Dummy Pajak ${i + 1}`,
    nomorSurat: `900 / ${100 + i} / BAPENDA / 2023`,
    nomorArsip: `20231201-${100000 + i}`,
    tahun: "2023",
    akses: i % 3 === 0 ? "umum" : i % 3 === 1 ? "terbatas" : "rahasia",
  })),
];


export default function Pencarian() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState(new Set(["d3"]));

  // Topbar global: judul + search aktif (search dari topbar)
  const { setTopbar } = useContext(TopbarContext);

  useEffect(() => {
    setTopbar({
      title: "Pencarian Dokumen",
      showSearch: true,
      searchPlaceholder: "Cari dokumen",
      onSearch: (q) => setQuery(q),
    });
  }, [setTopbar]);

  const results = useMemo(() => {
    if (!query.trim()) return MOCK_DOCS;
    const q = query.toLowerCase();
    return MOCK_DOCS.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.nomorSurat.toLowerCase().includes(q) ||
        d.nomorArsip.toLowerCase().includes(q) ||
        String(d.tahun).includes(q)
    );
  }, [query]);

  const recent = useMemo(() => [MOCK_DOCS[0], MOCK_DOCS[1]], []);
  const favoriteDocs = useMemo(
    () => MOCK_DOCS.filter((d) => favorites.has(d.id)),
    [favorites]
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openMetadata = () => {
    console.log("Open metadata search");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        {/* kiri: hasil pencarian */}
        <SearchResults
          results={results}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onOpenMetadata={openMetadata}
        />

        {/* kanan: pencarian terakhir + favorit */}
        <SidePanels
          recent={recent}
          favoriteDocs={favoriteDocs}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
}
