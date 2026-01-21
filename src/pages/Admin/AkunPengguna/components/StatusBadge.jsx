export default function StatusBadge({ status }) {
  if (status === "Sukses") {
    return (
      <span className="inline-flex items-center rounded-[5px] bg-[#1F6F43] px-5 py-1.5 text-[12px] font-regular text-white">
        Sukses
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-[5px] bg-slate-200 px-5 py-1.5 text-[12px] font-regular text-slate-700">
      {status}
    </span>
  );
}
