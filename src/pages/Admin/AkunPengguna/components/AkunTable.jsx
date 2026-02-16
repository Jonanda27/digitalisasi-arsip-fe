import { FiMail, FiCalendar, FiUser, FiHash, FiShield, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AkunSearch from "./AkunSearch";

export default function AkunTable({ data, searchValue, onSearchChange, onAdd, onEdit, onDelete }) {
  return (
    <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden transition-all">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Daftar Pengguna</h3>
          <p className="text-sm text-slate-500">Total {data.length} personil terdaftar</p>
        </div>
        
        <div className="flex items-center gap-3">
          <AkunSearch value={searchValue} onChange={onSearchChange} />
          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
          >
            <FiPlus /> Tambah Akun
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-[0.15em]">
              <th className="px-6 py-4 text-left"><div className="flex items-center gap-2"><FiMail /> Email</div></th>
              <th className="px-6 py-4 text-left"><div className="flex items-center gap-2"><FiCalendar /> Terdaftar</div></th>
              <th className="px-6 py-4 text-left"><div className="flex items-center gap-2"><FiUser /> Nama</div></th>
              <th className="px-6 py-4 text-left"><div className="flex items-center gap-2"><FiHash /> NIP</div></th>
              <th className="px-6 py-4 text-left"><div className="flex items-center gap-2"><FiShield /> Role</div></th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((akun) => (
              <tr key={akun._id || akun.email} className="hover:bg-blue-50/40 transition-colors group">
                <td className="px-6 py-4 text-slate-600 font-medium">{akun.email}</td>
                <td className="px-6 py-4 text-slate-400 text-[11px] font-mono">{akun.tanggal}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-[11px]">
                    {akun.nama}
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{akun.nip || "-"}</td>
                <td className="px-6 py-4">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                    akun.role === 'admin' 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {akun.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(akun)} className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={(e) => onDelete(akun, e)} className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}