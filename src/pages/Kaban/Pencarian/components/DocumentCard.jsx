import pdfIcon from "../icons/pdf.svg";
import starIcon from "../icons/favorit.svg";

export default function DocumentCard({
  title,
  nomorSurat,
  nomorArsip,
  tahun,
  akses,
  isFavorite,
  onToggleFavorite,
  onOpen,
  onDownload,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex min-h-[150px] flex-col justify-between">
      {/* TOP CONTENT */}
      <div className="flex gap-4">
        {/* TEXT */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-900">{title}</h4>

          <p className="mt-1 text-xs text-slate-500">
            Nomor Surat: {nomorSurat} &nbsp; Nomor Arsip: {nomorArsip}
          </p>

          <p className="mt-1 text-xs text-slate-500">Tahun Dokumen: {tahun}</p>
        </div>

        {/* PDF ICON */}
        <img
          src={pdfIcon}
          alt="PDF"
          className="h-10 w-10 flex-shrink-0"
          draggable="false"
        />
      </div>

      {/* BOTTOM ACTION */}
      <div className="mt-4 flex items-center">
        {/* LEFT: BUTTONS (boleh wrap, tapi star tetap kanan) */}
        <div className="flex flex-1 min-w-0 flex-wrap items-center gap-2">
          <button
            onClick={onOpen}
            className="rounded-lg bg-[#1F5EFF] px-3 py-1.5 text-xs font-medium text-white"
          >
            Buka Dokumen
          </button>

          <span
            className={[
              "rounded-lg px-3 py-1.5 text-xs font-medium",
              akses === "umum"
                ? "bg-emerald-500 text-white"
                : akses === "terbatas"
                ? "bg-amber-500 text-white"
                : "bg-rose-600 text-white",
            ].join(" ")}
          >
            {akses === "umum"
              ? "Umum"
              : akses === "terbatas"
              ? "Terbatas"
              : "Rahasia"}
          </span>

          <button
            onClick={onDownload}
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white"
          >
            Unduh Dokumen
          </button>
        </div>

        {/* RIGHT: STAR (posisi fix & jarak konsisten) */}
        <button
          onClick={onToggleFavorite}
          className="ml-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg hover:bg-slate-100"
          title="Favorit"
        >
          <img
            src={starIcon}
            alt="Favorit"
            className={[
              "h-4 w-4",
              isFavorite ? "opacity-100" : "opacity-40",
            ].join(" ")}
            draggable="false"
          />
        </button>
      </div>
    </div>
  );
}
