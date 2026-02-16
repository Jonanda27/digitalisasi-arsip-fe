export default function LevelBadge({ level }) {
  const key = (level || "").toLowerCase();
  
  const styles = {
    umum: "bg-emerald-50 text-emerald-700 border-emerald-100",
    terbatas: "bg-amber-50 text-amber-700 border-amber-100",
    rahasia: "bg-rose-50 text-rose-700 border-rose-100",
  };

  const label = key.charAt(0).toUpperCase() + key.slice(1);
  const currentStyle = styles[key] || styles.umum;

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${currentStyle}`}>
      {label}
    </span>
  );
}