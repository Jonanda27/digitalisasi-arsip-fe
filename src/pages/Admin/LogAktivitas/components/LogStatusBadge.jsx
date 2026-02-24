export default function LogStatusBadge({ status }) {
  const isSukses = status?.toLowerCase() === "sukses";

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
      isSukses 
        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
        : "bg-rose-50 text-rose-600 border-rose-100"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isSukses ? "bg-emerald-500" : "bg-rose-500"}`} />
      {status}
    </div>
  );
}