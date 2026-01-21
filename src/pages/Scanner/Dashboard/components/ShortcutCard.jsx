export default function ShortcutCard({ title, desc, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:-translate-y-[1px]"
    >
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
          <img src={icon} alt="" className="h-7 w-7" draggable="false" />
        </div>

        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-[12px] text-slate-500 leading-5 line-clamp-2">{desc}</div>
        </div>
      </div>
    </button>
  );
}
