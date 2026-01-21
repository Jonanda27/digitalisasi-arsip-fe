import scannerIcon from "../icons/scanner.svg";
import draftIcon from "../icons/draft.svg";
import uploadIcon from "../icons/upload.svg";

function Step({ label, active, done }) {
  const base =
    "flex items-center justify-center h-6 w-6 rounded-full text-[11px] font-semibold";
  const cls = done
    ? "bg-emerald-600 text-white"
    : active
    ? "bg-blue-600 text-white"
    : "bg-slate-200 text-slate-500";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${base} ${cls}`}>
        {done ? "✓" : "•"}
      </div>
      <div className="text-[12px] text-white/90">{label}</div>
    </div>
  );
}

export default function ProcessCard({
  scannedToday = 0,
  draftCount = 0,
  onScan,
  onDraft,
  onUpload,
}) {
  return (
    <div className="rounded-2xl bg-[#1F5EFF] p-6 text-white shadow-sm ring-1 ring-blue-200/40">
      <div className="text-[22px] font-semibold">Proses Digitalisasi Arsip</div>

      <div className="mt-5 grid grid-cols-12 gap-5">
        {/* step box */}
        <div className="col-span-12 lg:col-span-7 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
          <div className="flex items-center justify-between gap-4">
            <Step label="Scan" active done={false} />
            <div className="h-[2px] flex-1 bg-white/20 rounded" />
            <Step label="QC" active={false} done={false} />
            <div className="h-[2px] flex-1 bg-white/20 rounded" />
            <Step label="Input Metadata" active={false} done={false} />
            <div className="h-[2px] flex-1 bg-white/20 rounded" />
            <Step label="Simpan" active={false} done />
          </div>

          <div className="mt-4 flex items-center gap-6 text-[12px] text-white/90">
            <div>Scan Dokumen Hari Ini: {scannedToday}</div>
            <div>Draft Dokumen: {draftCount}</div>
          </div>
        </div>

        {/* action buttons */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={onScan}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
          >
            <img src={scannerIcon} alt="" className="h-5 w-5 [filter:brightness(0)_invert(1)]" draggable="false" />
            Mulai Scan
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onDraft}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
            >
              <img src={draftIcon} alt="" className="h-5 w-5 [filter:brightness(0)_invert(1)]" draggable="false" />
              Lanjutkan Draft
            </button>

            <button
              type="button"
              onClick={onUpload}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
            >
              <img src={uploadIcon} alt="" className="h-5 w-5 [filter:brightness(0)_invert(1)]" draggable="false" />
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
