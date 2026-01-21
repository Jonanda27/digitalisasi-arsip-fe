import pdfIcon from "../icons/pdf.svg";
import starIcon from "../icons/favorit.svg";

function AccessBadge({ akses }) {
  const cls =
    akses === "umum"
      ? "bg-emerald-500"
      : akses === "terbatas"
      ? "bg-amber-500"
      : "bg-rose-600";

  const label =
    akses === "umum" ? "Umum" : akses === "terbatas" ? "Terbatas" : "Rahasia";

  return (
    <span className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white ${cls}`}>
      {label}
    </span>
  );
}

function RequestChip({ status }) {
  if (!status) return null;

  const isDikirim = status === "dikirim";
  const isDitolak = status === "ditolak";

  const cls = isDikirim
    ? "bg-[#1F5EFF] text-white"
    : isDitolak
    ? "bg-slate-700 text-white"
    : "bg-slate-200 text-slate-700";

  const label = isDikirim ? "Permintaan Dikirim" : isDitolak ? "Permintaan Ditolak" : status;

  return (
    <span className={`rounded-lg px-3 py-1.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default function FavoriteCard({
  title,
  nomorSurat,
  nomorArsip,
  tahun,
  akses,
  requestStatus,
  isFavorite,
  onToggleFavorite,
  onOpen,
  onDownload,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex min-h-[150px] flex-col justify-between">
      {/* TOP */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-900">{title}</h4>

          <p className="mt-1 text-xs text-slate-500">
            Nomor Surat: {nomorSurat} &nbsp; Nomor Arsip: {nomorArsip}
          </p>

          <p className="mt-1 text-xs text-slate-500">Tahun Dokumen: {tahun}</p>
        </div>

        <img src={pdfIcon} alt="PDF" className="h-10 w-10 flex-shrink-0" draggable="false" />
      </div>

      {/* BOTTOM */}
      <div className="mt-4 grid grid-cols-[auto_40px] items-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpen}
            className="rounded-lg bg-[#1F5EFF] px-3 py-1.5 text-xs font-medium text-white"
          >
            Buka Dokumen
          </button>

          <RequestChip status={requestStatus} />

          <AccessBadge akses={akses} />

          <button
            onClick={onDownload}
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white"
          >
            Unduh Dokumen
          </button>
        </div>

        <button
          onClick={onToggleFavorite}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100"
          title="Favorit"
        >
          <img
            src={starIcon}
            alt="Favorit"
            className={["h-4 w-4", isFavorite ? "opacity-100" : "opacity-40"].join(" ")}
            draggable="false"
          />
        </button>
      </div>
    </div>
  );
}
