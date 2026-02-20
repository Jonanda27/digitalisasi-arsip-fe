import { useMemo, useState, useContext, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SearchResults from "./components/SearchResults";
import SidePanels from "./components/SidePanels";
import VerticalBanner from "./components/verticalBanner";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import { API } from "../../../global/api";
import FilterMetadataModal from "./components/FilterMetadataModal";


export default function Pencarian() {
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialDocs, setInitialDocs] = useState([]);
  const [approvedIds, setApprovedIds] = useState(new Set());
  const [userData, setUserData] = useState(null);
  const { setTopbar } = useContext(TopbarContext);
  const [lastSearchResults, setLastSearchResults] = useState([]);
  const [userBidangKode, setUserBidangKode] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    setTopbar({
      title: "Pencarian Dokumen",
      showSearch: true,
      searchPlaceholder: "Cari nomor surat, nama file, atau perihal...",
      onSearch: (q) => setQuery(q),
    });
  }, [setTopbar]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;

      const resUser = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(resUser.data);

      const userId = resUser.data._id || resUser.data.id;
      const userBidangId = resUser.data.bidang?._id || resUser.data.bidang;

      let kodeBidangUser = "";
      if (userBidangId) {
        try {
          const resFolder = await axios.get(
            `${API}/folders/terb/${userBidangId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          kodeBidangUser = resFolder.data.kode || resFolder.data.name;
          setUserBidangKode(kodeBidangUser);
        } catch (err) {
          console.error(err);
        }
      }

      const [resFiles, resAccess] = await Promise.all([
        await axios.get(`${API}/files/fetchFile`, {
  headers: { Authorization: `Bearer ${token}` },
}),
       await axios.get(`${API}/access-requests/approved`, {
  headers: { Authorization: `Bearer ${token}` },
}),
      ]);

      const approvedSet = new Set();
      resAccess.data.forEach((r) => {
        if (r.file)
          approvedSet.add(typeof r.file === "object" ? r.file._id : r.file);
      });
      setApprovedIds(approvedSet);

      const filteredFiles = resFiles.data.files.filter(
        (file) => file.status === "final",
      );
      const docs = processFiles(
        filteredFiles || [],
        approvedSet,
        userId,
        kodeBidangUser,
      );
      setDocuments(docs);
      setInitialDocs(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!query.trim()) {
    setDocuments(initialDocs);
    return;
  }
  const delayDebounceFn = setTimeout(async () => {
    setLoading(true);
    try {
      const token = getToken();
      // PERBAIKAN: Tambahkan "const res =" di depan axios.get
      const res = await axios.get(`${API}/files/search`, {
        params: { q: query },
        headers: { Authorization: `Bearer ${token}` },
      });

      const results = processFiles(
        res.data.files || [], // Sekarang res sudah terdefinisi
        approvedIds,
        userData?._id,
        userBidangKode,
      );
      setDocuments(results);
      if (results.length > 0) setLastSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, 500);
  return () => clearTimeout(delayDebounceFn);
}, [query, initialDocs, approvedIds, userData, userBidangKode]);

  const processFiles = (rawFiles, approvedSet, userId, kodeBidangUser) => {
    return rawFiles.map((doc) => ({
      ...doc,
      isFavorite:
        Array.isArray(doc.favoritedBy) && userId
          ? doc.favoritedBy.includes(userId)
          : doc.isFavorite,
      hasApprovedAccess:
        doc.kerahasiaan?.toLowerCase() === "umum" ||
        approvedSet.has(doc._id) ||
        (doc.kerahasiaan?.toLowerCase() === "terbatas" &&
          String(doc.bidang) === String(kodeBidangUser)),
      filePath: doc.path
        ? `http://localhost:5000/${doc.path.replace(/\\/g, "/")}`
        : null,
    }));
  };

  const toggleFavorite = async (id) => {
    try {
      const token = getToken();
     await axios.patch(
  `${API}/files/${id}/favorite`,
  {},
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
      const update = (prev) =>
        prev.map((doc) =>
          doc._id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc,
        );
      setDocuments(update);
      setInitialDocs(update);
      setLastSearchResults(update);
    } catch (err) {
      console.error(err);
    }
  };

  const recent = useMemo(
    () => lastSearchResults.slice(0, 3),
    [lastSearchResults],
  );
  const favoriteDocs = useMemo(
    () => documents.filter((d) => d.isFavorite),
    [documents],
  );

 // Cari fungsi ini di Pencarian.jsx
const handleApplyFilter = async (filterData) => {
  setIsFilterModalOpen(false);
  setLoading(true);

  // Buat params secara dinamis
  const params = {};
  if (query) params.q = query;
  if (filterData.tahun) params.tahun = filterData.tahun;
  if (filterData.kerahasiaan) params.kerahasiaan = filterData.kerahasiaan;
  if (filterData.tipeDokumen) params.tipeDokumen = filterData.tipeDokumen;
  if (filterData.kategori) params.kategori = filterData.kategori; // <-- PASTIKAN BARIS INI ADA

  try {
    const token = getToken();
    const res = await axios.get(`${API}/files/filter`, {
      params: params,
      headers: { Authorization: `Bearer ${token}` },
    });

    const results = processFiles(
      res.data.files || [],
      approvedIds,
      userData?._id,
      userBidangKode,
    );
    setDocuments(results);
  } catch (err) {
    console.error("Gagal Filter:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-6 lg:p-0">
      <div className="max-w-[1650px] mx-auto">
        {/* ROW 1: BANNER & HASIL */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 mb-10 items-start">
          {" "}
          {/* Tambahkan items-start agar banner tidak lonjong */}
          <div className="sticky top-10">
            {" "}
            {/* Tambahkan sticky agar banner tetap terlihat saat scroll dokumen */}
            <VerticalBanner user={userData} totalDocs={initialDocs.length} />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]"
          >
            {/* Header tetap di atas (tidak ikut scroll) */}
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-20">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  Dokumen Arsip
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  {query ? `Menampilkan hasil untuk "${query}"` : ""}
                </p>
              </div>
              {loading && (
                <div className="h-5 w-5 animate-spin border-2 border-[#1D4EA8] border-t-transparent rounded-full" />
              )}
            </div>

            {/* SATU-SATUNYA TEMPAT SCROLLBAR MUNCUL */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <SearchResults
          results={documents}
          onToggleFavorite={toggleFavorite}
          loading={loading}
          query={query}
          onOpenMetadata={() => setIsFilterModalOpen(true)} // <-- Hubungkan tombol di sini
        />
      </div>
      <FilterMetadataModal 
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilter}
      />
          </motion.div>
        </div>

        {/* ROW 2: RECENT & FAVORITES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 pb-2">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                Pencarian Terakhir
              </h4>
            </div>
            <div className="p-2">
              <SidePanels
                recent={recent}
                favoriteDocs={[]}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 pb-2">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-red-400 rounded-full shadow-[0_0_8px_rgba(248,113,113,0.6)]" />
                Dokumen Favorit
              </h4>
            </div>
            <div className="p-2">
              <SidePanels
                recent={[]}
                favoriteDocs={favoriteDocs}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
