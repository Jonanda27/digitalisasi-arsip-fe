export default function StatusBadge({ status }) {
  const s = status?.toLowerCase();

  if (s === "sukses") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200 uppercase tracking-tight">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Sukses
      </span>
    );
  }

  if (s === "gagal") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-4 py-1 text-[11px] font-bold text-rose-700 border border-rose-200 uppercase tracking-tight">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Gagal
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1 text-[11px] font-bold text-slate-600 border border-slate-200 uppercase tracking-tight">
      {status}
    </span>
  );
}