import { useMemo, useState, useContext, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SearchResults from "./components/SearchResults";
import SidePanels from "./components/SidePanels";
import VerticalBanner from "./components/verticalBanner";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import { API } from "../../../global/api";
import FilterMetadataModal from "./components/FilterMetadataModal";
import { HiOutlineFilter, HiOutlineSparkles } from "react-icons/hi";

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
  const [activeTab, setActiveTab] = useState(0);

  // --- TOPBAR CONFIG ---
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

  // --- FETCH LOGIC ---
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
          const resFolder = await axios.get(`${API}/folders/terb/${userBidangId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          kodeBidangUser = resFolder.data.kode || resFolder.data.name;
          setUserBidangKode(kodeBidangUser);
        } catch (err) {
          console.error(err);
        }
      }

      const [resFiles, resAccess] = await Promise.all([
        axios.get(`${API}/files/fetchFile`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/access-requests/approved`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const approvedSet = new Set();
      resAccess.data.forEach((r) => {
        if (r.file) approvedSet.add(typeof r.file === "object" ? r.file._id : r.file);
      });
      setApprovedIds(approvedSet);

      const filteredFiles = resFiles.data.files.filter((file) => file.status === "final");
      const docs = processFiles(filteredFiles || [], approvedSet, userId, kodeBidangUser);
      setDocuments(docs);
      setInitialDocs(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    if (!query.trim()) {
      setDocuments(initialDocs);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const token = getToken();
        const res = await axios.get(`${API}/files/search`, {
          params: { q: query },
          headers: { Authorization: `Bearer ${token}` },
        });

        const results = processFiles(res.data.files || [], approvedIds, userData?._id, userBidangKode);
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
      isFavorite: Array.isArray(doc.favoritedBy) && userId ? doc.favoritedBy.includes(userId) : doc.isFavorite,
      hasApprovedAccess:
        doc.kerahasiaan?.toLowerCase() === "umum" ||
        approvedSet.has(doc._id) ||
        (doc.kerahasiaan?.toLowerCase() === "terbatas" && String(doc.bidang) === String(kodeBidangUser)),
      filePath: doc.path ? `${API.replace("/api", "")}/${doc.path.replace(/\\/g, "/")}` : null,
    }));
  };

  const toggleFavorite = async (id) => {
    try {
      const token = getToken();
      await axios.patch(`${API}/files/${id}/favorite`, {}, { headers: { Authorization: `Bearer ${token}` } });
      const update = (prev) => prev.map((doc) => (doc._id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc));
      setDocuments(update);
      setInitialDocs(update);
      setLastSearchResults(update);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyFilter = async (filterData) => {
    setIsFilterModalOpen(false);
    setLoading(true);
    const params = { ...filterData };
    if (query) params.q = query;

    try {
      const token = getToken();
      const res = await axios.get(`${API}/files/filter`, {
        params: params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const results = processFiles(res.data.files || [], approvedIds, userData?._id, userBidangKode);
      setDocuments(results);
    } catch (err) {
      console.error("Gagal Filter:", err);
    } finally {
      setLoading(false);
    }
  };

  const recent = useMemo(() => lastSearchResults.slice(0, 3), [lastSearchResults]);
  const favoriteDocs = useMemo(() => documents.filter((d) => d.isFavorite), [documents]);

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-4 md:p-8 lg:p-10 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      <div className="max-w-[1650px] mx-auto">
        
        {/* ROW 1: BANNER & HASIL */}
        <div className="flex flex-col md:grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] xl:grid-cols-[380px_1fr] gap-6 xl:gap-10 mb-10 items-start">
          
          <div className="w-full md:sticky md:top-10 z-10">
            <VerticalBanner user={userData} totalDocs={initialDocs.length} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-200 overflow-hidden flex flex-col h-[650px] md:h-[750px] w-full"
          >
            {/* Header Sticky */}
            <div className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="overflow-hidden">
                <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  Dokumen Arsip
                  <HiOutlineSparkles className="text-blue-500 text-sm animate-pulse hidden md:block" />
                </h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">
                  {query ? `Hasil untuk: "${query}"` : `${documents.length} Dokumen Tersedia`}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {loading && (
                  <div className="h-5 w-5 animate-spin border-2 border-[#1D4EA8] border-t-transparent rounded-full" />
                )}
                {/* Mobile Filter Button */}
                <button 
                  onClick={() => setIsFilterModalOpen(true)}
                  className="md:hidden p-3 bg-blue-600 text-white rounded-2xl shadow-lg active:scale-90 transition-transform"
                >
                  <HiOutlineFilter className="text-xl" />
                </button>
              </div>
            </div>

            {/* List Results Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              <SearchResults
                results={documents}
                onToggleFavorite={toggleFavorite}
                loading={loading}
                query={query}
                onOpenMetadata={() => setIsFilterModalOpen(true)}
              />
            </div>
          </motion.div>
        </div>

        {/* ROW 2: RECENT & FAVORITES (Responsive Swipe for Mobile) */}
        <div className="space-y-6">
          {/* Dot Indicators for Mobile */}
          <div className="flex justify-center gap-2 md:hidden mb-2">
            {[0, 1].map((idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${activeTab === idx ? "w-6 bg-blue-600" : "w-1.5 bg-slate-300"}`} 
              />
            ))}
          </div>

          <div 
            onScroll={(e) => setActiveTab(Math.round(e.target.scrollLeft / e.target.offsetWidth))}
            className="flex flex-row overflow-x-auto md:overflow-visible md:grid md:grid-cols-2 gap-6 pb-10 snap-x snap-mandatory hide-scrollbar"
          >
            {/* Recent Searches Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-w-[90vw] md:min-w-0 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-[400px] flex flex-col snap-center"
            >
              <div className="p-8 pb-2">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                  <span className="h-2 w-2 bg-amber-400 rounded-full" />
                  Pencarian Terakhir
                </h4>
              </div>
              <div className="flex-1 p-4 overflow-hidden">
                <SidePanels
                  recent={recent}
                  favoriteDocs={[]}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            </motion.div>

            {/* Favorites Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="min-w-[90vw] md:min-w-0 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-[400px] flex flex-col snap-center"
            >
              <div className="p-8 pb-2">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                  <span className="h-2 w-2 bg-red-400 rounded-full" />
                  Dokumen Favorit
                </h4>
              </div>
              <div className="flex-1 p-4 overflow-hidden">
                <SidePanels
                  recent={[]}
                  favoriteDocs={favoriteDocs}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal Filter */}
      <FilterMetadataModal 
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilter}
      />

      {/* STYLES */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
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