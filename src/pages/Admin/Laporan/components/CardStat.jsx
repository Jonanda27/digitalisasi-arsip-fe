export default function StatCard({ title, value }) {
  return (
    <div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-md hover:shadow-lg transition-shadow">
      <div className="text-[12px] text-slate-500">{title}</div>
      <div className="mt-2 text-[28px] font-bold text-slate-900">
        {value}
      </div>
    </div>
  );
}
