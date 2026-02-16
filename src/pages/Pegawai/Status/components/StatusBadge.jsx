export default function StatusBadge({ status }) {
  const map = {
    menunggu: "text-amber-500",
    disetujui: "text-emerald-500",
    ditolak: "text-rose-500",
  };

  return (
    <span className={`text-xs font-medium ${map[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
