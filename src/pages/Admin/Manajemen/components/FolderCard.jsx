import { FiFolder, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { useState } from "react";

export default function FolderCard({ folder, onOpen, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-blue-100 hover:shadow-md">
      <div className="flex items-start gap-4">
        
        {/* 1. ICON FOLDER (Kiri) */}
        <div 
          onClick={() => onOpen(folder)}
          className="cursor-pointer shrink-0 rounded-2xl bg-amber-50 p-4 text-amber-500 transition-colors group-hover:bg-amber-100"
        >
          <FiFolder size={24} fill="currentColor" opacity={0.3} />
        </div>

        {/* 2. INFO TEXT (Tengah/Kanan) */}
        <div 
          className="flex-1 cursor-pointer min-w-0 py-1" 
          onClick={() => onOpen(folder)}
        >
          <h4 className="text-sm font-bold text-slate-700 leading-tight break-words whitespace-normal uppercase">
            {folder.name}
          </h4>
          <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
            {folder.itemCount || 0} Dokumen
          </p>
        </div>

        {/* 3. MENU DOTS (Pojok Kanan) */}
        <div className="relative shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="rounded-full p-2 hover:bg-slate-50 text-slate-400"
          >
            <FiMoreVertical size={18} />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                <button 
                  onClick={() => { onDelete(folder); setShowMenu(false); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs font-bold text-rose-500 hover:bg-rose-50"
                >
                  <FiTrash2 /> Hapus Folder
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}