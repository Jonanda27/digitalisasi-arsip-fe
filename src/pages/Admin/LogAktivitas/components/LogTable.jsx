import LogRow from "./LogRow";

export default function LogTable({ data }) {
  return (
    <div className="w-full">
      {/* Tampilan Desktop (Tabel) - Muncul di LG ke atas */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 bg-slate-50/50">
              <th className="py-4 pl-4 text-left border-b border-slate-100 w-20 rounded-tl-2xl">No</th>
              <th className="py-4 text-left border-b border-slate-100">Waktu</th>
              <th className="py-4 text-left border-b border-slate-100">Kategori</th>
              <th className="py-4 text-left border-b border-slate-100">Detail Aktivitas</th>
              <th className="py-4 pr-4 text-right border-b border-slate-100 rounded-tr-2xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 && data.map((item, index) => (
              <LogRow key={item._id} item={item} index={index} variant="table" />
            ))}
          </tbody>
        </table>
      </div>

      {/* Tampilan Mobile & iPad (Cards) - Muncul di bawah LG */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.length > 0 ? (
          data.map((item, index) => (
            <LogRow key={item._id} item={item} index={index} variant="card" />
          ))
        ) : null}
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl mb-2">📄</div>
            <p className="text-slate-800 font-bold">Data Kosong</p>
            <p className="text-slate-400 text-xs text-center px-6">Belum ada riwayat log yang terekam sistem.</p>
          </div>
        </div>
      )}
    </div>
  );
}