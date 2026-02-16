import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiHeart } from "react-icons/hi";
import FavoriteBanner from "./components/Favoritbanner"; // Import banner baru
import FilterBar from "./components/FilterBar";
import FavoriteList from "./components/FavoriteList";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import RequestAccessModal from "./components/RequestAccessModal";
import { API } from "../../../global/api";
import PdfPreviewModal from "./components/PdfPreviewModal";

export default function PegawaiFavorit() {
  const { setTopbar } = useContext(TopbarContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("");
  const [akses, setAkses] = useState("");
  const [urutkan, setUrutkan] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPath, setPreviewPath] = useState("");

  useEffect(() => {
    setTopbar({ title: "Dokumen Favorit", showSearch: false });
  }, [setTopbar]);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const params = new URLSearchParams({ q: search, tipe, akses, urutkan });

    const [resFav, resAccess] = await Promise.all([
        axios.get(`${API}/files/favorites?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/access-requests/approved`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);

      const approvedSet = new Set(resAccess.data.map(r => 
        typeof r.file === "object" ? r.file._id : r.file
      ));

      const processed = (resFav.data.files || []).map(doc => ({
        ...doc,
        hasApprovedAccess: (doc.kerahasiaan || "").toLowerCase() === "umum" || approvedSet.has(doc._id),
        filePath: doc.path ? `${API.replace('/api', '')}/${doc.path.replace(/\\/g, "/")}` : null,
      }));

      setRows(processed);
    } catch (err) {
      console.error("Gagal memuat favorit:", err);
    } finally {
      setLoading(false);
    }
  }, [search, tipe, akses, urutkan]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

 const toggleFavorite = async (id) => {
    try {
      const token = getToken();
      // 4. Gunakan ${API} di sini juga
      await axios.patch(`${API}/files/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRows(prev => prev.filter(row => row._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleOpenPreview = (path) => {
    setPreviewPath(path);
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-6 lg:p-0">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        <FavoriteBanner />

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-8 border-b border-slate-100 bg-slate-50/30">
            <FilterBar
              tipe={tipe} setTipe={setTipe}
              akses={akses} setAkses={setAkses}
              urutkan={urutkan} setUrutkan={setUrutkan}
              search={search} setSearch={setSearch}
              onApply={fetchFavorites}
            />
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="py-20 text-center flex flex-col items-center gap-4"
                >
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Sinkronisasi Data...</p>
                </motion.div>
              ) : rows.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="py-24 text-center flex flex-col items-center gap-4"
                >
                  <div className="p-6 bg-slate-50 rounded-full text-slate-300 text-5xl">
                    <HiHeart />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-800 font-bold">Koleksi Masih Kosong</p>
                    <p className="text-slate-400 text-sm">Tandai dokumen sebagai favorit untuk melihatnya di sini.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <FavoriteList
                    items={rows}
                    onToggleFavorite={toggleFavorite}
                    onOpenRequest={(file) => { setSelectedFile(file); setIsModalOpen(true); }}
                    onPreview={handleOpenPreview}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <RequestAccessModal 
        open={isModalOpen} 
        file={selectedFile} 
        onClose={() => setIsModalOpen(false)} 
      />

     {/* MODAL PREVIEW PDF */}
      <PdfPreviewModal 
        open={isPreviewOpen} 
        filePath={previewPath} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </div>
  );
}