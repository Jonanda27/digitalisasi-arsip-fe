import FavoriteCard from "./FavoriteCard";

export default function FavoriteList({ items = [], favorites = new Set(), onToggleFavorite }) {
  return (
    <div className="space-y-4">
      {items.map((doc) => (
        <FavoriteCard
          key={doc.id}
          {...doc}
          isFavorite={favorites.has(doc.id)}
          onToggleFavorite={() => onToggleFavorite(doc.id)}
          onOpen={() => console.log("Open:", doc.id)}
          onDownload={() => console.log("Download:", doc.id)}
        />
      ))}
    </div>
  );
}
