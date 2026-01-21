export default function ActionCard({ title, desc, icon, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-full w-full text-left",
        "rounded-2xl bg-white px-6 py-5 ring-1 ring-slate-200 shadow-sm",
        "transition hover:shadow-md hover:-translate-y-[1px]",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <img src={icon} alt="" className="h-9 w-9 shrink-0" draggable="false" />

        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-slate-900 leading-5 line-clamp-1">
            {title}
          </div>
          <div className="mt-1 text-[12px] leading-5 text-slate-400 line-clamp-2">
            {desc}
          </div>
        </div>
      </div>
    </button>
  );
}
