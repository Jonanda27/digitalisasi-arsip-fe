import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiHeart } from "react-icons/hi";
import FavoriteBanner from "./components/Favoritbanner";
import FilterBar from "./components/FilterBar";
import FavoriteList from "./components/FavoriteList";
import PdfPreviewModal from "../../Kaban/Favorit/components/PdfPreviewModal"; 
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import { API } from "../../../global/api";

export default function AdminFavorit() {
  const { setTopbar } = useContext(TopbarContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State Modal Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState(null);

  // State Filter (Data yang diikat ke Input)
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("");
  const [akses, setAkses] = useState("");
  const [urutkan, setUrutkan] = useState("");

  useEffect(() => {
    setTopbar({ title: "Dokumen Favorit", showSearch: false });
  }, [setTopbar]);

  // Fungsi Fetch Data
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      // Query params diambil langsung dari state saat ini
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
        // Pastikan URL file mengarah ke statics backend dengan benar
        filePath: doc.path ? `${API.replace('/api', '')}/${doc.path.replace(/\\/g, "/")}` : null,
      }));

      setRows(processed);
    } catch (err) {
      console.error("Gagal memuat favorit:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tipe, akses, urutkan]);

  // Hanya jalankan saat komponen pertama kali dibuka
  useEffect(() => {
    fetchFavorites();
  }, []); // Kosong = Trigger Manual

  const toggleFavorite = async (id) => {
    try {
    const token = getToken();
      // 3. Menggunakan ${API} untuk update status favorit
      await axios.patch(`${API}/files/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRows(prev => prev.filter(row => row._id !== id));
    } catch (err) { console.error(err); }
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
              onApply={fetchFavorites} // Pemicu Filter Manual
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
                    <p className="text-slate-400 text-sm">Coba ubah filter atau tambahkan favorit baru.</p>
                  </div>
                </motion.div>
              ) : (
                <FavoriteList
                  items={rows}
                  onToggleFavorite={toggleFavorite}
                  onPreview={(path) => {
                    setSelectedFilePath(path);
                    setIsPreviewOpen(true);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

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