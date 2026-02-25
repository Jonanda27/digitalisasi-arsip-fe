import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiHeart } from "react-icons/hi2";
import FavoriteBanner from "./components/Favoritbanner";
import FilterBar from "./components/FilterBar";
import FavoriteCard from "./components/FavoriteCard";
import PdfPreviewModal from "../../Kaban/Favorit/components/PdfPreviewModal"; 
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import { API } from "../../../global/api";

export default function AdminFavorit() {
  const { setTopbar } = useContext(TopbarContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State Filter
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("");
  const [akses, setAkses] = useState("");
  const [urutkan, setUrutkan] = useState("");

  // State Modal Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState(null);

  useEffect(() => {
    setTopbar({ title: "Dokumen Favorit", showSearch: false });
  }, [setTopbar]);

  // Fungsi Fetch Data
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (tipe) params.append("tipe", tipe);
      if (akses) params.append("akses", akses);
      if (urutkan) params.append("urutkan", urutkan);

      const resFav = await axios.get(`${API}/files/favorites?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const processed = (resFav.data.files || []).map(doc => ({
        ...doc,
        // Bypass akses: Selalu true agar tombol "Buka Dokumen" muncul langsung
        hasApprovedAccess: true, 
        filePath: doc.path ? `${API.replace('/api', '')}/${doc.path.replace(/\\/g, "/")}` : null,
      }));

      setRows(processed);
    } catch (err) {
      console.error("Gagal memuat favorit:", err);
    } finally {
      setLoading(false);
    }
  }, [search, tipe, akses, urutkan]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (id) => {
    try {
      const token = getToken();
      await axios.patch(`${API}/files/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRows(prev => prev.filter(row => row._id !== id));
    } catch (err) { 
      console.error("Gagal toggle favorit:", err); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Background Decoration (Laptop) */}
      <div className="hidden md:block absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      <div className="max-w-[1200px] mx-auto p-4 md:p-8 space-y-6 md:space-y-10">
        
        {/* Banner Area */}
        <FavoriteBanner />

        {/* Main Content Container */}
        <div className="bg-white/70 backdrop-blur-xl md:bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
          
          {/* Filter Section */}
          <div className="p-5 md:p-8 border-b border-slate-100 bg-slate-50/50">
            <FilterBar
              tipe={tipe} setTipe={setTipe}
              akses={akses} setAkses={setAkses}
              urutkan={urutkan} setUrutkan={setUrutkan}
              search={search} setSearch={setSearch}
              onApply={fetchFavorites} 
            />
          </div>

          {/* Documents List Area */}
          <div className="flex-1 p-4 md:p-10">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="py-20 text-center flex flex-col items-center gap-4"
                >
                  <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sinkronisasi Data...</p>
                </motion.div>
              ) : rows.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="py-16 text-center flex flex-col items-center justify-center"
                >
                  <div className="p-6 bg-slate-50 rounded-full text-slate-200 text-6xl mb-4">
                    <HiHeart />
                  </div>
                  <h3 className="text-xl font-black text-slate-700">Koleksi Masih Kosong</h3>
                  <p className="text-slate-400 text-sm mt-1">Coba sesuaikan pencarian atau tambahkan favorit baru.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="list" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    max-h-[600px] overflow-y-auto pr-2 
                    md:max-h-none md:overflow-visible md:pr-0
                    scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent
                    snap-y snap-mandatory md:snap-none
                  "
                >
                  <div className="grid grid-cols-1 gap-6 pb-6">
                    {rows.map((file) => (
                      <div key={file._id} className="snap-start snap-always">
                        <FavoriteCard
                          title={file.namaFile || file.name}
                          nomorSurat={file.noDokumenPreview || file.nomorSurat}
                          nomorArsip={file.noArsipPreview || file.nomorArsip}
                          tahun={file.tahun}
                          akses={file.kerahasiaan}
                          hasApprovedAccess={file.hasApprovedAccess} // Bernilai true dari pemrosesan di atas
                          filePath={file.filePath}
                          onToggleFavorite={() => toggleFavorite(file._id)}
                          onPreviewClick={() => { 
                            setSelectedFilePath(file.filePath); 
                            setIsPreviewOpen(true); 
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal Preview */}
      <PdfPreviewModal 
        open={isPreviewOpen} 
        filePath={selectedFilePath} 
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedFilePath(null);
        }} 
      />
    </div>
  );
}