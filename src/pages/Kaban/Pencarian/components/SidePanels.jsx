import DocumentCard from "./DocumentCard";

// Komponen Pembungkus List
function Panel({ children }) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function SidePanels({
  recent = [],
  favoriteDocs = [],
  favorites = new Set(),
  onToggleFavorite,
}) {
  
  // LOGIKA: Cek apakah komponen ini sedang digunakan untuk menampilkan 'Recent' atau 'Favorite'
  // Dilihat dari cara panggil di Pencarian.jsx: 
  // Kolom kiri kirim favoriteDocs={[]}
  // Kolom kanan kirim recent={[]}
  
  const isRecentColumn = recent.length > 0 || (recent.length === 0 && favoriteDocs.length === 0);
  const isFavoriteColumn = favoriteDocs.length > 0;

  // Jika dipanggil dengan favoriteDocs saja (Kolom Kanan)
  if (favoriteDocs.length > 0 || (favoriteDocs.length === 0 && recent.length === 0 && !isRecentColumn)) {
     return (
        <Panel>
          {favoriteDocs.length > 0 ? (
            favoriteDocs.map((doc) => (
              <DocumentCard
                key={doc._id || doc.id}
                title={doc.namaFile || doc.name}
                nomorArsip={doc.noArsipPreview}
                nomorSurat={doc.noDokumenPreview || doc.nomorSurat}
                tahun={doc.tahun}
                akses={doc.kerahasiaan}
                isFavorite={true}
                onToggleFavorite={() => onToggleFavorite(doc._id || doc.id)}
                onOpen={() => console.log("Open fav:", doc._id)}
                hasApprovedAccess={doc.hasApprovedAccess}
              />
            ))
          ) : (
            <p className="text-sm text-slate-400 text-center py-10 italic">Belum ada favorit.</p>
          )}
        </Panel>
     );
  }

  // Jika dipanggil dengan recent saja (Kolom Kiri)
  return (
    <Panel>
      {recent.length > 0 ? (
        recent.map((doc) => (
          <DocumentCard
            key={doc._id || doc.id}
            title={doc.namaFile || doc.name}
            nomorArsip={doc.noArsipPreview}
            nomorSurat={doc.noDokumenPreview || doc.nomorSurat}
            tahun={doc.tahun}
            akses={doc.kerahasiaan}
            isFavorite={doc.isFavorite || favorites.has(doc._id || doc.id)}
            onToggleFavorite={() => onToggleFavorite(doc._id || doc.id)}
            onOpen={() => console.log("Open recent:", doc._id)}
            hasApprovedAccess={doc.hasApprovedAccess}
          />
        ))
      ) : (
        <p className="text-sm text-slate-400 text-center py-10 italic">Belum ada data pencarian.</p>
      )}
    </Panel>
  );
}