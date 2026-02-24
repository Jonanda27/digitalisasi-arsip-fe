export default function ActivityLogTable({ logs, loading }) {
  if (loading) return (
    <div className="p-10 text-center bg-white rounded-[2rem] border animate-pulse text-slate-300 font-bold uppercase text-[10px]">
      Syncing...
    </div>
  );

  return (
    <div className="rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header Tanpa Garis Bawah */}
      <div className="px-5 py-5 bg-white">
        <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">Manajemen Akun</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight opacity-70">
          Daftar pengguna terdaftar
        </p>
      </div>

      <div className="overflow-y-auto max-h-[450px]">
        {/* Table Tanpa divide-y (Garis hilang) */}
        <table className="w-full">
          <tbody className="">
            {logs?.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar Biru Solid - Ukuran diperkecil untuk mobile agar pas */}
                    <div className="h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xs md:text-sm shadow-sm">
                      {user.nama.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      {/* Nama user diperkecil sedikit di mobile agar tidak terpotong */}
                      <div className="font-bold text-[#0F172A] text-[11px] md:text-sm truncate uppercase tracking-tight mb-0.5">
                        {user.nama}
                      </div>
                      
                      {/* Label Role sesuai gambar referensi */}
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-wider ${
                        user.role === 'admin' 
                          ? 'bg-red-50 text-red-500' 
                          : 'bg-blue-50 text-blue-500'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            
            {logs.length === 0 && (
              <tr>
                <td className="p-10 text-center text-slate-400 font-bold uppercase text-[10px]">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}