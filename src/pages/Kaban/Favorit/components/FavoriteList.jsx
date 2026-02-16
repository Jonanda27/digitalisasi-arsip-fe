import { AnimatePresence } from "framer-motion";
import FavoriteCard from "./FavoriteCard";

export default function FavoriteList({ items, onToggleFavorite, onPreview }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <AnimatePresence mode="popLayout">
        {items.map((doc) => (
          <FavoriteCard
            key={doc._id}
            title={doc.namaFile || doc.title}
            nomorSurat={doc.noDokumenPreview || doc.nomorSurat}
            nomorArsip={doc.noArsipPreview || doc.nomorArsip}
            tahun={doc.tahun}
            akses={doc.kerahasiaan}
            filePath={doc.filePath}
            onToggleFavorite={() => onToggleFavorite(doc._id)}
            onPreview={() => onPreview(doc.filePath)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}