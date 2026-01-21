export default function Badge({ variant = "umum", children }) {
  const styles = {
    umum: "bg-emerald-500 text-white",
    terbatas: "bg-amber-500 text-white",
    rahasia: "bg-rose-600 text-white",
    default: "bg-slate-200 text-slate-700",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold",
        styles[variant] || styles.default,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
