import { useMemo, useState, useContext, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Tambahkan ini
import SearchResults from "./components/SearchResults";
import SidePanels from "./components/SidePanels";
import VerticalBanner from "./components/verticalBanner"; // Tambahkan ini
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import { API } from "../../../global/api";

export default function Pencarian() {
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialDocs, setInitialDocs] = useState([]);
  const [lastSearchResults, setLastSearchResults] = useState([]);
  const [approvedIds, setApprovedIds] = useState(new Set());
  const [userData, setUserData] = useState(null); // Tambahkan state userData
  const { setTopbar } = useContext(TopbarContext);

  const getUserFromToken = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

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

      // Ambil data user untuk Banner
      const userPayload = getUserFromToken(token);
      setUserData(userPayload); 
      const userId = userPayload?._id || userPayload?.id;

      const [resFiles, resAccess] = await Promise.all([
        axios.get(`${API}/files/fetchFile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/access-requests/approved`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const approvedSet = new Set();
      resAccess.data.forEach((r) => {
        if (r.file) {
          const fileId = typeof r.file === "object" ? r.file._id : r.file;
          approvedSet.add(fileId);
        }
      });
      setApprovedIds(approvedSet);

      const docs = processFiles(resFiles.data.files || [], approvedSet, userId);
      setDocuments(docs);
      setInitialDocs(docs);
    } catch (err) {
      console.error("Initial fetch error:", err);
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
        const userPayload = getUserFromToken(token);
        const userId = userPayload?._id || userPayload?.id;

        const res = await axios.get(`${API}/files/search`, {
          params: { q: query },
          headers: { Authorization: `Bearer ${token}` },
        });

        const searchResults = processFiles(res.data.files || [], approvedIds, userId);
        setDocuments(searchResults);
        if (searchResults.length > 0) setLastSearchResults(searchResults);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, initialDocs, approvedIds]);

  const processFiles = (rawFiles, approvedSet, userId) => {
    return rawFiles.map((doc) => {
      const currentApproved = approvedSet || new Set();
      const isApproved = currentApproved.has(doc._id);
      
      let isFav = false;
      if (typeof doc.isFavorite === 'boolean') {
        isFav = doc.isFavorite;
      } else if (Array.isArray(doc.favoritedBy) && userId) {
        isFav = doc.favoritedBy.includes(userId);
      }

      return {
        ...doc,
        isFavorite: isFav,
        hasApprovedAccess: doc.kerahasiaan?.toLowerCase() === "umum" || isApproved,
        filePath: doc.path
          ? `${API.replace('/api', '')}/${doc.path.replace(/\\/g, "/")}`
          : null,
      };
    });
  };

  const toggleFavorite = async (id) => {
    try {
      const token = getToken();
      await axios.patch(`${API}/files/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updateLogic = (prev) =>
        prev.map((doc) =>
          doc._id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
        );

      setDocuments(updateLogic);
      setInitialDocs(updateLogic);
      setLastSearchResults(updateLogic); 
    } catch (err) {
      console.error(err);
    }
  };

  const recent = useMemo(() => lastSearchResults.slice(0, 3), [lastSearchResults]);
  const favoriteDocs = useMemo(() => documents.filter((d) => d.isFavorite), [documents]);

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-6 lg:p-0">
      <div className="max-w-[1650px] mx-auto">
        
        {/* ROW 1: BANNER & HASIL PENCARIAN */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 mb-10 items-start">
          
          {/* Section Kiri: Banner */}
          <div className="sticky top-10">
            <VerticalBanner user={userData} totalDocs={initialDocs.length} />
          </div>

          {/* Section Kanan: Hasil Dokumen */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]"
          >
            {/* Header Box */}
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-20">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  Dokumen Arsip
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  {query ? `Menampilkan hasil untuk "${query}"` : "Daftar dokumen tersedia"}
                </p>
              </div>
              {loading && (
                <div className="h-5 w-5 animate-spin border-2 border-[#1D4EA8] border-t-transparent rounded-full" />
              )}
            </div>

            {/* List Area dengan Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <SearchResults
                results={documents}
                onToggleFavorite={toggleFavorite}
                loading={loading}
              />
            </div>
          </motion.div>
        </div>

        {/* ROW 2: RECENT & FAVORITES (GRID 2 KOLOM) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10">
          
          {/* Panel Terakhir Dicari */}
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

          {/* Panel Favorit */}
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

      {/* Gaya CSS untuk scrollbar agar selaras dengan desain */}
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