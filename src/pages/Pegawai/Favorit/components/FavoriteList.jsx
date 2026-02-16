import FavoriteCard from "./FavoriteCard";

// Pastikan onOpenRequest ada di dalam destructuring props {}
export default function FavoriteList({ items, favorites, onToggleFavorite, onOpenRequest,onPreview }) {
  return (
    <div className="space-y-4">
      {items.map((doc) => (
        <FavoriteCard
          key={doc._id}
          title={doc.namaFile || doc.title}
          nomorSurat={doc.noDokumenPreview || doc.nomorSurat}
          nomorArsip={doc.noArsipPreview || doc.nomorArsip}
          tahun={doc.tahun}
          akses={doc.kerahasiaan || doc.akses}
          isFavorite={true} // Karena ini halaman favorit
          hasApprovedAccess={doc.hasApprovedAccess}
          filePath={doc.filePath}
          onToggleFavorite={() => onToggleFavorite(doc._id)}
         onOpen={() => onOpenRequest(doc)}
          onPreviewClick={() => onPreview(doc.filePath)} // <--- Memanggil fungsi dari PegawaiFavorit
        />
      ))}
    </div>
  );
}