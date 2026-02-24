import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiHeart } from "react-icons/hi2";
import FavoriteBanner from "./components/Favoritbanner";
import FilterBar from "./components/FilterBar";
import FavoriteCard from "./components/FavoriteCard";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import RequestAccessModal from "./components/RequestAccessModal";
import { API } from "../../../global/api";
import PdfPreviewModal from "./components/PdfPreviewModal";

export default function PegawaiFavorit() {
  const { setTopbar } = useContext(TopbarContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // States untuk filter dan pencarian
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("");
  const [akses, setAkses] = useState("");
  const [urutkan, setUrutkan] = useState("");
  
  // States untuk modal dan preview
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPath, setPreviewPath] = useState("");

  // Sinkronisasi dengan Topbar Layout
  useEffect(() => {
    setTopbar({ title: "Favorit", showSearch: false });
  }, [setTopbar]);

  /**
   * Fungsi utama untuk mengambil data favorit dan memproses hak akses
   */
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;

      const params = new URLSearchParams({ q: search, tipe, akses, urutkan });

      // 1. Ambil data User, Dokumen Favorit, dan Akses yang disetujui secara paralel
      const [resUser, resFav, resAccess] = await Promise.all([
        axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/files/favorites?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/access-requests/approved`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);

      const user = resUser.data;
      const userId = user._id || user.id;
      const userBidangId = user.bidang?._id || user.bidang;

      // 2. Ambil Kode Bidang User dari Folder (untuk bypass kerahasiaan terbatas)
      let kodeBidangUser = "";
      if (userBidangId) {
        try {
          const resFolder = await axios.get(`${API}/folders/terb/${userBidangId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Mengambil kode atau nama folder sebagai pengenal bidang
          kodeBidangUser = resFolder.data.kode || resFolder.data.name;
        } catch (err) {
          console.error("Gagal mengambil info folder bidang:", err);
        }
      }

      // 3. Simpan daftar ID file yang sudah disetujui aksesnya oleh admin
      const approvedSet = new Set(resAccess.data.map(r => 
        typeof r.file === "object" ? r.file._id : r.file
      ));

      // 4. Proses pemetaan data file dan pengecekan hak akses otomatis
      const processed = (resFav.data.files || []).map(doc => {
        const kerahasiaan = (doc.kerahasiaan || "").toLowerCase();
        
        /**
         * LOGIKA HAK AKSES:
         * User dapat melihat file jika:
         * - Status Kerahasiaan adalah 'umum'
         * - File ID ada dalam daftar approvedSet (sudah request & di-approve)
         * - Kerahasiaan 'terbatas' DAN user berada di bidang yang sama (kode cocok)
         */
        const hasApprovedAccess = 
          kerahasiaan === "umum" || 
          approvedSet.has(doc._id) || 
          (kerahasiaan === "terbatas" && String(doc.bidang) === String(kodeBidangUser));

        return {
          ...doc,
          hasApprovedAccess,
          isFavorite: true, // Karena datang dari endpoint favorites
          filePath: doc.path ? `${API.replace('/api', '')}/${doc.path.replace(/\\/g, "/")}` : null,
        };
      });

      setRows(processed);
    } catch (err) {
      console.error("Gagal memuat favorit:", err);
    } finally {
      setLoading(false);
    }
  }, [search, tipe, akses, urutkan]);

  // Load data saat komponen mount atau filter berubah
  useEffect(() => { 
    fetchFavorites(); 
  }, [fetchFavorites]);

  /**
   * Fungsi untuk menghapus dari favorit
   */
  const toggleFavorite = async (id) => {
    try {
      const token = getToken();
      await axios.patch(`${API}/files/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Langsung hapus dari state agar UI responsif (karena ini halaman favorit)
      setRows(prev => prev.filter(row => row._id !== id));
    } catch (err) { 
      console.error("Gagal toggle favorit:", err); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Background Decoration */}
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
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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
                  <HiHeart className="text-7xl text-slate-100 mb-4" />
                  <h3 className="text-xl font-black text-slate-700">Tidak ada dokumen favorit</h3>
                  <p className="text-slate-400 text-sm mt-1">Coba sesuaikan pencarian atau filter Anda.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="list" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    max-h-[580px] overflow-y-auto pr-2 
                    md:max-h-none md:overflow-visible md:pr-0
                    scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent
                    snap-y snap-mandatory md:snap-none
                  "
                >
                  <div className="grid grid-cols-1 gap-6 pb-6">
                    {rows.map((file) => (
                      <div key={file._id} className="snap-start snap-always">
                        <FavoriteCard
                          title={file.namaFile || file.originalName}
                          nomorSurat={file.nomorSurat}
                          nomorArsip={file.nomorArsip}
                          tahun={file.tahun}
                          akses={file.kerahasiaan}
                          hasApprovedAccess={file.hasApprovedAccess}
                          filePath={file.filePath}
                          onToggleFavorite={() => toggleFavorite(file._id)}
                          onPreviewClick={() => { 
                            setPreviewPath(file.filePath); 
                            setIsPreviewOpen(true); 
                          }}
                          onOpen={() => { 
                            setSelectedFile(file); 
                            setIsModalOpen(true); 
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

      {/* Modals Implementation */}
      <RequestAccessModal 
        open={isModalOpen} 
        file={selectedFile} 
        onClose={() => setIsModalOpen(false)} 
      />

      <PdfPreviewModal 
        open={isPreviewOpen} 
        filePath={previewPath} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </div>
  );
}