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

  // Sinkronisasi dengan Topbar Layout
  useEffect(() => {
    setTopbar({
      title: "E-Arsip Digital",
      showSearch: true,
      searchPlaceholder: "Cari nomor surat, nama file...",
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

  // Debounce Search Logic
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
    <div className="min-h-screen bg-[#F8FAFC] bg-gradient-to-r  from-blue-100 via-blue-50/30 to-white 
                    md:from-transparent md:via-transparent md:to-transparent relative overflow-hidden">
      {/* Dekorasi Latar Belakang */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
      <div className="absolute -top-[10%] -right-[10%] w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-[20%] -left-[10%] w-[300px] h-[300px] bg-indigo-100/20 rounded-full blur-[80px] -z-10" />

      <div className="max-w-[1650px] mx-auto p-4 md:p-8 lg:p-10">
        
        {/* ROW 1: BANNER & DAFTAR HASIL */}
        {/* PERBAIKAN: md:grid memastikan iPad (breakpoint md) menggunakan layout kolom seperti Laptop */}
        <div className="flex flex-col md:grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] xl:grid-cols-[380px_1fr] gap-6 xl:gap-10 mb-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:sticky md:top-10"
          >
            <VerticalBanner user={userData} totalDocs={initialDocs.length} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white overflow-hidden flex flex-col h-[650px] md:h-[750px] w-full relative"
          >
            {/* STICKY HEADER */}
            <div className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-100/50 flex justify-between items-center bg-white/50 sticky top-0 z-20 backdrop-blur-md">
              <div className="overflow-hidden">
                <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  Dokumen Arsip
                  <HiOutlineSparkles className="text-blue-500 text-sm animate-pulse" />
                </h3>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {loading ? "Menyinkronkan..." : `${documents.length} Dokumen`}
                  </p>
                  <AnimatePresence>
                    {query && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 bg-blue-400 rounded-full" />
                        <p className="text-[11px] text-blue-600 font-bold truncate max-w-[150px] md:max-w-xs italic">
                          Hasil pencarian: "{query}"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {loading && (
                  <div className="h-4 w-4 animate-spin border-2 border-blue-600 border-t-transparent rounded-full mr-2" />
                )}
                {/* Filter Button: Hanya muncul di layar sangat kecil, iPad sudah pakai sidebar banner */}
                <button 
                  onClick={() => setIsFilterModalOpen(true)} 
                  className="md:hidden p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 active:scale-90 transition-all flex items-center justify-center"
                >
                  <HiOutlineFilter className="text-xl" />
                </button>
              </div>
            </div>

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

        {/* ROW 2: RECENT & FAVORITES */}
        <div className="space-y-6">
          {/* Pagination Dots: Hanya muncul di mobile (< 768px) */}
          <div className="flex items-center justify-center px-4 md:hidden">
            <div className="flex gap-2">
              {[0, 1].map((dot) => (
                <div 
                  key={dot} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeTab === dot ? "w-8 bg-blue-600" : "w-2 bg-slate-300"
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* PERBAIKAN: md:overflow-visible dan md:grid memastikan iPad tidak geser-geser (scroll) */}
          <div 
            onScroll={(e) => setActiveTab(Math.round(e.target.scrollLeft / e.target.offsetWidth))}
            className="flex flex-row overflow-x-auto md:overflow-visible md:grid md:grid-cols-2 gap-6 pb-10 snap-x snap-mandatory no-scrollbar"
          >
            {/* Box 1: Recent Search */}
            <motion.div 
              whileHover={{ y: -5 }} 
              className="min-w-[85vw] md:min-w-0 bg-white rounded-[2.5rem] border border-white shadow-lg shadow-slate-200/50 overflow-hidden h-[400px] flex flex-col snap-center"
            >
              <div className="p-8 pb-2 text-left">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  </div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Pencarian Terakhir</h4>
                </div>
              </div>
              <div className="flex-1 p-4 md:p-6 overflow-hidden">
                <SidePanels recent={recent} favoriteDocs={[]} onToggleFavorite={toggleFavorite} />
              </div>
            </motion.div>

            {/* Box 2: Favorites */}
            <motion.div 
              whileHover={{ y: -5 }} 
              className="min-w-[85vw] md:min-w-0 bg-white rounded-[2.5rem] border border-white shadow-lg shadow-slate-200/50 overflow-hidden h-[400px] flex flex-col snap-center"
            >
              <div className="p-8 pb-2 text-left">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                    <div className="w-2 h-2 bg-rose-400 rounded-full" />
                  </div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Dokumen Favorit</h4>
                </div>
              </div>
              <div className="flex-1 p-4 md:p-6 overflow-hidden">
                <SidePanels recent={[]} favoriteDocs={favoriteDocs} onToggleFavorite={toggleFavorite} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modal Filter */}
        <AnimatePresence>
          {isFilterModalOpen && (
            <FilterMetadataModal 
              open={isFilterModalOpen} 
              onClose={() => setIsFilterModalOpen(false)} 
              onApply={handleApplyFilter} 
            />
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}