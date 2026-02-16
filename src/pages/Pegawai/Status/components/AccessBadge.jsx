export default function AccessBadge({ level }) {
  const map = {
    umum: "bg-emerald-500",
    rahasia: "bg-rose-500",
    terbatas: "bg-amber-500",
  };

  return (
    <span
      className={`rounded-md px-3 py-1 text-xs font-medium text-white ${map[level]}`}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}
