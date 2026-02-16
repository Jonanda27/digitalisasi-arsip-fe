export default function ActivityLogTable({ logs, loading }) {
  if (loading) return (
    <div className="p-10 text-center bg-white rounded-2xl border animate-pulse text-slate-400">
      Memuat data pengguna...
    </div>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header Tetap (Sticky) */}
      <div className="px-6 py-5 border-b border-slate-100 bg-white">
        <h3 className="text-lg font-bold text-slate-900">Manajemen Akun</h3>
        <p className="text-[11px] text-slate-500">Daftar pengguna terdaftar</p>
      </div>

      {/* Kontainer dengan Scroll - Tinggi dibatasi untuk ~4 baris */}
      <div className="overflow-y-auto max-h-[255px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm text-slate-400 font-medium uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Pengguna</th>
              <th className="px-6 py-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs && logs.length > 0 ? (
              logs.map((user) => (
                <tr key={user._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {user.nama.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate uppercase text-[11px]">
                          {user.nama}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate lowercase">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide uppercase ${
                      user.role === 'admin' 
                        ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="py-10 text-center text-slate-400 text-xs">
                  Tidak ada data akun.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}