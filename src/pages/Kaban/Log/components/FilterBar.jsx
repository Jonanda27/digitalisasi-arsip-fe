export default function FilterBar({
  status,
  setStatus,
  urutkan,
  setUrutkan,
  onApply,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-3 lg:gap-4">
      {/* Status */}
      <div>
        <label className="mb-1 block text-xs text-slate-500">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
        >
          <option value="">Semua</option>
          <option value="sukses">Sukses</option>
          <option value="gagal">Gagal</option>
        </select>
      </div>

      {/* Urutkan */}
      <div>
        <label className="mb-1 block text-xs text-slate-500">Urutkan</label>
        <select
          value={urutkan}
          onChange={(e) => setUrutkan(e.target.value)}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
        >
          <option value="tanggal_desc">Tanggal terbaru</option>
          <option value="id_asc">Log ID (A-Z)</option>
          <option value="id_desc">Log ID (Z-A)</option>
        </select>
      </div>

      {/* Button */}
      <div className="flex items-end">
        <button
          type="button"
          onClick={onApply}
          className="h-10 w-full rounded-lg bg-[#1F5EFF] px-4 text-sm font-medium text-white"
        >
          Terapkan Filter
        </button>
      </div>
    </div>
  );
}
