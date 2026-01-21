export default function StorageCard({ title, percent = 0, leftText, rightText, note }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="text-[13px] text-slate-500">{title}</div>

      <div className="mt-4 flex items-center justify-between text-[12px]">
        <div className="text-blue-600 font-semibold">{leftText}</div>
        <div className="text-slate-400">{rightText}</div>
      </div>

      <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>

      {note ? <div className="mt-4 text-[12px] text-blue-600">{note}</div> : null}
    </div>
  );
}
