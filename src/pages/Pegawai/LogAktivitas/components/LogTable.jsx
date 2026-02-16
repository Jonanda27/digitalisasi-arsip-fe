import LogRow from "./LogRow";

export default function LogTable({ data }) {
  return (
    <div className="overflow-x-auto">
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
          {data.length > 0 ? (
            data.map((item, index) => (
              <LogRow key={item._id} item={item} index={index} />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-24 text-center">
                <div className="flex flex-col items-center gap-2">
                   <div className="text-slate-200 text-6xl mb-2">📄</div>
                   <p className="text-slate-800 font-bold">Data Kosong</p>
                   <p className="text-slate-400 text-xs">Belum ada riwayat log yang terekam sistem.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}