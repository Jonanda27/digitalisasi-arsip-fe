import { useState } from "react";
import { FiFolderPlus } from "react-icons/fi";
import CreateFolderModal from "./CreateFolderModal";

export default function ArsipActions({ currentFolder, onSuccess }) {
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  return (
    <>
      {/* CONTAINER UTAMA:
          Mobile: Menjadi fixed di pojok kanan bawah, z-index tinggi agar di atas file.
          iPad/Laptop: Kembali ke flow normal (static) dalam flexbox header.
      */}
      <div className="fixed bottom-6 right-6 z-50 md:static md:bottom-auto md:right-auto md:z-auto">
        <button
          onClick={() => setIsFolderModalOpen(true)}
          className={`
            flex items-center justify-center gap-2 transition-all shadow-2xl md:shadow-sm
            /* Style Mobile (Google Drive Style FAB) */
            h-14 w-14 rounded-full bg-blue-600 text-white
            /* Style iPad & Laptop (Kembali ke Desain Awal) */
            md:h-auto md:w-auto md:rounded-2xl md:bg-white md:border md:border-slate-200 
            md:text-slate-700 md:hover:border-blue-500 md:hover:text-blue-600 md:px-4 md:py-2.5 
            md:text-sm md:font-bold
          `}
        >
          {/* Ikon: Lebih besar di mobile agar mudah ditekan jari */}
          <FiFolderPlus className="text-2xl md:text-[18px]" />
          
          {/* Teks: Hanya muncul di layar sedang (iPad) ke atas */}
          <span className="hidden md:inline">Folder Baru</span>
        </button>
      </div>

      {/* Modal Render tetap di luar flow agar tidak terpengaruh posisi button */}
      <CreateFolderModal
        open={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSuccess={onSuccess}
        parent={currentFolder}
      />
    </>
  );
}