import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiCalendar, FiUser, FiHash, FiShield, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AkunSearch from "./AkunSearch";

export default function AkunTable({ data, searchValue, onSearchChange, onAdd, onEdit, onDelete }) {
  return (
    <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden transition-all">
      
      {/* 1. FLOATING ACTION BUTTON (Hanya muncul di Mobile/iPad < LG) */}
      <div className="lg:hidden fixed bottom-8 right-6 z-[90]">
        <motion.button
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={onAdd}
          className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-2xl shadow-blue-400 border-2 border-white/20"
        >
          <FiPlus size={28} />
        </motion.button>
      </div>

      {/* Header Responsif */}
      <div className="p-5 md:p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/30">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900">Daftar Pengguna</h3>
          <p className="text-xs md:text-sm text-slate-500">Total {data.length} personil terdaftar</p>
        </div>
        
        <div className="flex flex-row items-center gap-3">
          <div className="flex-1 lg:w-72">
            <AkunSearch value={searchValue} onChange={onSearchChange} />
          </div>
          
          {/* Tombol Tambah yang HANYA muncul di Desktop LG ke atas */}
          <button
            onClick={onAdd}
            className="hidden lg:flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
          >
            <FiPlus /> <span>Tambah Akun</span>
          </button>
        </div>
      </div>

      {/* VIEW MOBILE & IPAD (Card Mode) */}
      <div className="lg:hidden divide-y divide-slate-100 pb-20"> {/* Tambah padding bawah agar tidak tertutup FAB */}
        <AnimatePresence mode="popLayout">
          {data.map((akun, idx) => (
            <motion.div 
              key={akun._id || akun.email}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {akun.nama.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm uppercase truncate">{akun.nama}</h4>
                    <p className="text-[11px] text-slate-500 font-medium truncate">{akun.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shrink-0 ${
                  akun.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {akun.role}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">NIP / ID</p>
                  <p className="text-xs font-mono text-slate-700 truncate">{akun.nip || "-"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Terdaftar</p>
                  <p className="text-xs font-mono text-slate-700">{akun.tanggal.split(',')[0]}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => onEdit(akun)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white text-amber-600 text-xs font-bold border border-slate-200 shadow-sm active:bg-amber-50">
                  <FiEdit2 size={12} /> Edit
                </button>
                <button onClick={(e) => onDelete(akun, e)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white text-rose-600 text-xs font-bold border border-slate-200 shadow-sm active:bg-rose-50">
                  <FiTrash2 size={12} /> Hapus
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* VIEW DESKTOP (Table Mode) */}
      <div className="hidden lg:block overflow-x-auto">
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
                    akun.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-600 border-slate-200'
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