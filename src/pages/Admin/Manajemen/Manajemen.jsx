import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { TopbarContext } from "../../../layouts/AppLayout";
import { getToken } from "../../../auth/auth";
import { API } from "../../../global/api";

// Komponen Pendukung
import WelcomeBannerArsip from "../Manajemen/components/WelcomeBanner";
import FolderCard from "./components/FolderCard";
import FileCard from "./components/FileCard";
import ArsipActions from "./components/ArsipActions";

// Icons
import { 
  FiHome, 
  FiChevronRight, 
  FiFileText, 
  FiFolder, 
  FiGrid, 
  FiList, 
  FiCheck, 
  FiX,
  FiEye
} from "react-icons/fi";

export default function ManajemenArsip() {
  const topbarCtx = useContext(TopbarContext);

  // States
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  
  // State View Mode: 'grid' (ikon kanan), 'list' (ikon kiri)
  const [viewMode, setViewMode] = useState("grid");

  /**
   * FETCH DATA UTAMA
   */
  const fetchData = useCallback(async (folderId) => {
    try {
      setLoading(true);
      const token = getToken();
      const [folderRes, fileRes] = await Promise.all([
        axios.get(`${API}/folders/by-parent-with-count`, {
          params: { parent: folderId },
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/files/fetchFileAdmin`, {
          params: { folder: folderId }, 
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);
      setFolders(folderRes.data.folders || []);
      setFiles(fileRes.data.files || []);
      setCurrentFolder(folderId);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * PENCARIAN
   */
  const handleSearch = useCallback(async (query) => {
    if (!query?.trim()) {
      fetchData(currentFolder);
      return;
    }
    try {
      setLoading(true);
      const token = getToken();
      const res = await axios.get(`${API}/files/search`, {
        params: { q: query, folder: currentFolder },
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data.files || []);
      setFolders([]); 
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentFolder, fetchData]);

  /**
   * KONFIGURASI TOPBAR
   */
  useEffect(() => {
    topbarCtx?.setTopbar((p) => ({ 
      ...p, 
      title: "Manajemen Arsip", 
      showSearch: true, 
      onSearch: (q) => handleSearch(q),
    }));

    return () => {
      topbarCtx?.setTopbar(p => ({ ...p, showSearch: false, onSearch: null }));
    };
  }, [handleSearch]);

  /**
   * NAVIGASI FOLDER
   */
  useEffect(() => {
    fetchData(null);
  }, [fetchData]);

  const openFolder = (folder) => {
    setFolderPath((prev) => [...prev, folder]);
    fetchData(folder._id);
  };

  const goRoot = () => {
    setFolderPath([]);
    fetchData(null);
  };

  const goToPath = (index) => {
    const newPath = folderPath.slice(0, index + 1);
    const target = newPath[newPath.length - 1];
    setFolderPath(newPath);
    fetchData(target._id);
  };

  const deleteFolder = async (folder) => {
    try {
      const token = getToken();
      await axios.delete(`${API}/folders/${folder._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(currentFolder);
    } catch (err) { 
      console.error("Gagal menghapus folder:", err); 
    }
  };

  return (
    <div className=" md:p-0 space-y-8 min-h-screen bg-[#F8FAFC] p-6 lg:p-0 pb-20">
      <WelcomeBannerArsip userName="Admin" />

      {/* Navigasi & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          <button 
            onClick={goRoot} 
            className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 shadow-sm border border-slate-100 hover:text-blue-600 transition-all"
          >
            <FiHome /> Arsip
          </button>
          {folderPath.map((f, i) => (
            <div key={f._id} className="flex items-center gap-1 shrink-0">
              <FiChevronRight className="text-slate-300" />
              <button 
                onClick={() => goToPath(i)} 
                className={`rounded-2xl px-4 py-2.5 text-xs font-black uppercase tracking-widest shadow-sm border transition-all ${
                    i === folderPath.length - 1 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {f.name}
              </button>
            </div>
          ))}
        </nav>

        <div className="w-full md:w-auto">
          <ArsipActions currentFolder={currentFolder} onSuccess={() => fetchData(currentFolder)} />
        </div>
      </div>

      <div className="space-y-12">
        {/* FOLDER SECTION */}
        <section>
          <div className="mb-6 flex items-center gap-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><FiFolder size={20}/></div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Direktori Folder</h3>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-[1.5rem]" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {folders.map(f => (
                <FolderCard key={f._id} folder={f} onOpen={openFolder} onDelete={deleteFolder} />
              ))}
            </div>
          )}
        </section>

        {/* FILE SECTION */}
        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><FiFileText size={20}/></div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Dokumen Digital</h3>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* TOGGLE VIEW BUTTONS (Sesuai Gambar User) */}
            <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm h-10">
              <button 
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                  viewMode === "list" 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {viewMode === "list" && <FiCheck size={14} strokeWidth={3} />}
                <FiList size={18} />
              </button>
              
              <div className="w-px h-5 bg-slate-200 mx-1" />
              
              <button 
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                  viewMode === "grid" 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {viewMode === "grid" && <FiCheck size={14} strokeWidth={3} />}
                <FiGrid size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {[1,2,3,4,5].map(i => <div key={i} className="aspect-[4/5] bg-slate-100 rounded-[2rem] animate-pulse" />)}
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                /* GRID VIEW: Pratinjau Halaman Langsung */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  <AnimatePresence>
                    {files.map((file, idx) => (
                      <motion.div
                        key={file._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <FileCard file={file} onPreview={setPreviewFile} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                /* LIST VIEW: Compact & Professional */
                <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-50 bg-slate-50/50">
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Dokumen</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Tipe</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {files.map((file) => (
                          <tr key={file._id} className="group hover:bg-blue-50/30 transition-all">
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-all">
                                  <FiFileText size={16} />
                                </div>
                                <p className="font-bold text-slate-700 text-sm truncate max-w-xs">{file.originalName}</p>
                              </div>
                            </td>
                            <td className="px-6 py-3 hidden md:table-cell">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight bg-slate-100 px-2 py-1 rounded">
                                {file.mimeType?.split('/')[1] || 'FILE'}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-right">
                              <button 
                                onClick={() => setPreviewFile(file)}
                                className="inline-flex items-center gap-2 h-8 px-4 text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                              >
                                <FiEye /> Buka
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* MODAL PREVIEW */}
      <AnimatePresence>
        {previewFile && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between bg-white px-8 py-5 border-b border-slate-100">
                <div className="min-w-0">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Preview</p>
                    <h3 className="font-bold text-slate-800 truncate">{previewFile.originalName}</h3>
                </div>
                <button onClick={() => setPreviewFile(null)} className="rounded-2xl bg-slate-50 p-3 text-slate-400 hover:text-rose-500 transition-all hover:rotate-90">
                  <FiX size={20} />
                </button>
              </div>
              <iframe src={`${API}/files/${previewFile._id}/preview`} className="flex-1 w-full bg-slate-100 border-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}