export default function StatusBadge({ status }) {
  const key = (status || "").toLowerCase();
  const isOk = key === "sukses";

  return (
    <span
      className={[
        "inline-flex items-center rounded-md px-4 py-1 text-xs font-medium text-white",
        isOk ? "bg-emerald-700" : "bg-rose-700",
      ].join(" ")}
    >
      {isOk ? "Sukses" : "Gagal"}
    </span>
  );
}
