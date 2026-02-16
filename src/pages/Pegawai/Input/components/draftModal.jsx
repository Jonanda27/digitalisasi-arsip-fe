import React, { useState } from "react";

export default function DraftModal({ open, onClose, drafts, onSelect, loading }) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filteredDrafts = drafts.filter((d) =>
    (d.namaFile || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.nomorSurat || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Daftar Draf Tersimpan</h3>
            <p className="text-xs text-slate-500">Pilih draf untuk memulihkan data formulir</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400 hover:text-slate-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Cari berdasarkan nama file atau nomor surat..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 space-y-3 bg-slate-50/30 flex-1">
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
              <p className="mt-4 text-sm text-slate-500 font-medium">Mengambil draf...</p>
            </div>
          ) : filteredDrafts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-2xl border-slate-200">
              <p className="text-slate-400 italic text-sm">
                {search ? "Draf tidak ditemukan" : "Tidak ada draf yang tersedia"}
              </p>
            </div>
          ) : (
            filteredDrafts.map((draft) => (
              <div
                key={draft._id}
                onClick={() => onSelect(draft)}
                className="group relative p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition cursor-pointer flex justify-between items-center"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📝</span>
                    <p className="font-bold text-slate-700 truncate">
                      {draft.namaFile || "Draf Tanpa Nama"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
  📅 {draft.createdAt && !isNaN(new Date(draft.createdAt)) 
    ? new Date(draft.createdAt).toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    : "Tanggal tidak tersedia"}
</span>
                    <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 rounded-md">
                      {draft.bidang || "Umum"}
                    </span>
                    {draft.nomorSurat && (
                      <span className="text-[11px] text-slate-400 italic truncate max-w-[200px]">
                        No: {draft.nomorSurat}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  <button className="bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold py-2 px-4 rounded-lg shadow-sm transition transform active:scale-95">
                    GUNAKAN
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
          <p className="text-[11px] text-slate-400">Total: {filteredDrafts.length} Draf</p>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}