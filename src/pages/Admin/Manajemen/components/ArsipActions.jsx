import { useState } from "react";
import { FiPlus, FiFolderPlus, FiUpload } from "react-icons/fi";
import CreateFolderModal from "./CreateFolderModal"; // Pastikan path benar

export default function ArsipActions({ currentFolder, onSuccess }) {
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {/* Tombol Pemicu Modal */}
      <button
        onClick={() => setIsFolderModalOpen(true)}
        className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm"
      >
        <FiFolderPlus size={18} />
        <span className="hidden sm:inline">Folder Baru</span>
      </button>

      {/* Modal Render */}
      <CreateFolderModal
        open={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSuccess={onSuccess} // Ini akan memanggil fetchData(currentFolder) di ManajemenArsip
        parent={currentFolder}
      />
    </div>
  );
}