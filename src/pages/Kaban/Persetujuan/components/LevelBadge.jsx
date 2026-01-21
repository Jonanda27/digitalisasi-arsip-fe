export default function LevelBadge({ level }) {
  const key = (level || "").toLowerCase();

  const cls =
    key === "umum"
      ? "bg-emerald-600"
      : key === "terbatas"
      ? "bg-amber-500"
      : "bg-rose-700";

  const label =
    key === "umum" ? "Umum" : key === "terbatas" ? "Terbatas" : "Rahasia";

  return (
    <span className={`inline-flex items-center rounded-md px-4 py-1 text-xs font-medium text-white ${cls}`}>
      {label}
    </span>
  );
}
