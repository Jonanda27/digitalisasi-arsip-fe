export default function ApprovalCard({ total = 5, onClick }) {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#2D7CFF] to-[#1B4FB6] p-6 text-white shadow-sm">
      {/* Header */}
      <div>
        <div className="text-[20px] font-semibold text-white">
          Persetujuan Akses
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/90">
          Ada{" "}
          <span className="font-semibold text-white">{total}</span>{" "}
          persetujuan akses menunggu konfirmasi anda. Tinjau sekarang untuk
          melakukan proses.
        </p>
      </div>

      {/* Button (gak terlalu ke bawah, normal) */}
      <button
        type="button"
        onClick={onClick}
        className="mt-5 w-fit rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-normal text-white
                   hover:bg-white/25 transition"
      >
        Buka Persetujuan Sekarang
      </button>
    </div>
  );
}
