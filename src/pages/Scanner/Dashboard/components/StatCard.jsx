import targetIcon from "../icons/target.svg";

export default function StatCard({ title, value, note, variant }) {
  const isTarget = variant === "target";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div className="text-[13px] text-slate-500">{title}</div>

        {isTarget ? (
          <img src={targetIcon} alt="" className="h-10 w-10" draggable="false" />
        ) : (
          <div className="h-10 w-10 rounded-xl bg-slate-50 ring-1 ring-slate-200" />
        )}
      </div>

      <div className="mt-2 text-[44px] font-semibold text-slate-900 leading-none">
        {value}
      </div>

      {note ? (
        <div className={`mt-3 text-[12px] ${isTarget ? "text-blue-600" : "text-amber-500"}`}>
          {note}
        </div>
      ) : null}
    </div>
  );
}
