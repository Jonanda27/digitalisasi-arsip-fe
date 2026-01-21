import DocumentCard from "./DocumentCard";

export default function SearchResults({
  results = [],
  favorites = new Set(),
  onToggleFavorite,
  onOpenMetadata,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col">
      {/* HEADER (tidak ikut scroll) */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Hasil Pencarian</h3>
          <p className="mt-1 text-sm text-slate-500">
            {results.length} Dokumen berhasil ditemukan
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenMetadata}
          className="rounded-lg bg-[#1F5EFF] px-4 py-2 text-sm font-semibold text-white"
        >
          Cari dengan Metadata
        </button>
      </div>

      {/* BODY SCROLL */}
      <div className="mt-4 flex-1 min-h-0 overflow-y-auto pr-1 max-h-[620px]">
        <div className="space-y-3">
          {results.map((doc) => (
            <DocumentCard
              key={doc.id}
              {...doc}
              isFavorite={favorites.has(doc.id)}
              onToggleFavorite={() => onToggleFavorite(doc.id)}
              onOpen={() => console.log("Open result:", doc.id)}
              onDownload={() => console.log("Download result:", doc.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
