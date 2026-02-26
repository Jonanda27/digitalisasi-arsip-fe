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
  FiEye,
  FiSearch
} from "react-icons/fi";

export default function ManajemenArsip() {
  const topbarCtx = useContext(TopbarContext);

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  // 1. Fetch Data Logic
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

  // 2. Search Logic
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

  // 3. Navigation Logic
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
    if(!window.confirm("Hapus folder ini?")) return;
    try {
      const token = getToken();
      await axios.delete(`${API}/folders/${folder._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(currentFolder);
    } catch (err) { 
      console.error("Gagal menghapus:", err); 
    }
  };

  // Effect untuk Topbar & Initial Load
  useEffect(() => {
    topbarCtx?.setTopbar((p) => ({ 
      ...p, 
      title: "Manajemen Arsip", 
      showSearch: true, 
      onSearch: (q) => handleSearch(q),
    }));
    fetchData(null);
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 min-h-screen bg-[#F8FAFC] bg-gradient-to-r  from-blue-100 via-blue-50/30 to-white 
                    md:from-transparent md:via-transparent md:to-transparent p-4 md:p-6 lg:p-0 pb-24">
      <WelcomeBannerArsip />

      {/* BREADCRUMBS & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center gap-1 overflow-x-auto py-2 hide-scrollbar whitespace-nowrap -mx-4 px-4 md:mx-0 md:px-0">
          <button 
            onClick={goRoot} 
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm border border-slate-100 hover:text-blue-600 transition-all shrink-0"
          >
            <FiHome /> Arsip
          </button>
          {folderPath.map((f, i) => (
            <div key={f._id} className="flex items-center gap-1 shrink-0">
              <FiChevronRight className="text-slate-300" />
              <button 
                onClick={() => goToPath(i)} 
                className={`rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm border transition-all ${
                    i === folderPath.length - 1 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-100 text-slate-500"
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

      <div className="space-y-8">
        {/* SECTION FOLDER */}
        {folders.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><FiFolder size={18}/></div>
              <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-400">Folder</h3>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map(f => (
                <FolderCard key={f._id} folder={f} onOpen={openFolder} onDelete={deleteFolder} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION FILE */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><FiFileText size={18}/></div>
              <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Dokumen</h3>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition-all ${viewMode === "list" ? "bg-blue-100 text-blue-700" : "text-slate-400"}`}
              >
                <FiList size={18} />
              </button>
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-blue-100 text-blue-700" : "text-slate-400"}`}
              >
                <FiGrid size={18} />
              </button>
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-slate-200 rounded-2xl" />)}
             </div>
          ) : files.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {files.map((file, idx) => (
                      <motion.div
                        key={file._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <FileCard file={file} onPreview={setPreviewFile} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* MOBILE LIST: No Horizontal Scroll */}
                  <div className="grid grid-cols-1 gap-3 md:hidden">
                    {files.map((file) => (
                      <div 
                        key={file._id}
                        onClick={() => setPreviewFile(file)}
                        className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-all"
                      >
                        <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl shrink-0"><FiFileText size={18} /></div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-700 text-xs truncate uppercase tracking-tight">{file.originalName}</p>
                          <p className="text-[9px] text-slate-400 font-medium uppercase mt-0.5">{file.mimeType?.split('/')[1] || 'FILE'}</p>
                        </div>
                        <FiChevronRight className="text-slate-300" />
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP TABLE */}
                  <div className="hidden md:block bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-50 bg-slate-50/50">
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Nama Dokumen</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Tipe</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {files.map((file) => (
                          <tr key={file._id} className="group hover:bg-blue-50/30 transition-all">
                            <td className="px-6 py-3 flex items-center gap-3">
                              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all"><FiFileText size={16} /></div>
                              <p className="font-bold text-slate-700 text-sm">{file.originalName}</p>
                            </td>
                            <td className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">{file.mimeType?.split('/')[1] || 'FILE'}</td>
                            <td className="px-6 py-3 text-right">
                              <button onClick={() => setPreviewFile(file)} className="inline-flex items-center gap-2 h-8 px-4 text-[10px] font-black uppercase text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
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
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
               <FiSearch size={48} className="mb-4 opacity-20" />
               <p className="text-sm font-bold uppercase tracking-widest">Tidak ada file ditemukan</p>
            </div>
          )}
        </section>
      </div>

      {/* MODAL PREVIEW */}
      <AnimatePresence>
        {previewFile && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/90 backdrop-blur-sm p-0 sm:p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
              className="relative flex h-[95vh] sm:h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-[2rem] sm:rounded-[2.5rem] bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between bg-white px-6 sm:px-8 py-4 sm:py-5 border-b border-slate-100 sticky top-0 z-10">
                <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Preview</p>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate">{previewFile.originalName}</h3>
                </div>
                <button onClick={() => setPreviewFile(null)} className="rounded-xl bg-slate-50 p-2.5 text-slate-400 hover:text-rose-500 transition-all hover:rotate-90">
                  <FiX size={18} />
                </button>
              </div>
              <iframe src={`${API}/files/${previewFile._id}/preview`} className="flex-1 w-full bg-slate-100 border-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}