import { FiFolder, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { useState } from "react";

export default function FolderCard({ folder, onOpen, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 bg-white p-3 sm:p-5 shadow-sm transition-all hover:border-blue-100 hover:shadow-md active:scale-[0.98] sm:active:scale-100">
      <div className="flex items-center sm:items-start gap-3 sm:gap-4">
        
        {/* 1. ICON FOLDER (Kiri) */}
        <div 
          onClick={() => onOpen(folder)}
          className="cursor-pointer shrink-0 rounded-xl sm:rounded-2xl bg-amber-50 p-3 sm:p-4 text-amber-500 transition-colors group-hover:bg-amber-100"
        >
          {/* Ikon mengecil di mobile (20) dan normal di desktop (24) */}
          <FiFolder size={20} className="sm:w-6 sm:h-6" fill="currentColor" opacity={0.3} />
        </div>

        {/* 2. INFO TEXT (Tengah) */}
        <div 
          className="flex-1 cursor-pointer min-w-0" 
          onClick={() => onOpen(folder)}
        >
          <h4 className="text-[12px] sm:text-sm font-bold text-slate-700 leading-tight truncate sm:whitespace-normal uppercase tracking-tight">
            {folder.name}
          </h4>
          <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400">
            {folder.itemCount || 0} Dokumen
          </p>
        </div>

        {/* 3. MENU DOTS (Pojok Kanan) */}
        <div className="relative shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="rounded-full p-1.5 sm:p-2 hover:bg-slate-50 text-slate-400 transition-colors"
          >
            <FiMoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          
          {showMenu && (
            <>
              {/* Overlay untuk menutup menu */}
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              
              <div className="absolute right-0 z-20 mt-2 w-36 sm:w-40 overflow-hidden rounded-xl sm:rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
                <button 
                  onClick={() => { onDelete(folder); setShowMenu(false); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-[10px] sm:text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
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