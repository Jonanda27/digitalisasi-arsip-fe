import axios from "axios";
import AkunSearch from "./AkunSearch";

export default function AkunTable({
  data,
  searchValue,
  onSearchChange,
  onAdd,
  onEdit,
  onDelete, 
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
      {/* HEADER: SEARCH + TAMBAH AKUN */}
      <div className="flex items-center justify-between">
        <AkunSearch value={searchValue} onChange={onSearchChange} />

        <button
          onClick={onAdd}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Tambah Akun
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full text-[12px]">
        <thead className="border-b text-[#94A3B8] font-medium">
          <tr>
            <th className="py-2 text-left">Email</th>
            <th className="py-2 text-left">Tanggal Dibuat ↓</th>
            <th className="py-2 text-left">Nama</th>
            <th className="py-2 text-left">NIP</th>
            <th className="py-2 text-left">Role</th>
            <th className="py-2 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((akun) => (
            <tr key={akun.email} className="border-b last:border-0 ">
              <td className="py-3">{akun.email}</td>
              <td className="py-3">{akun.tanggal}</td>
              <td className="py-3 font-medium">{akun.nama}</td>
              <td className="py-3">{akun.nip}</td>
              <td className="py-3">{akun.role}</td>

              <td className="py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(akun)}
                    className="rounded bg-orange-400 px-3 py-1 text-white text-xs hover:bg-orange-500"
                  >
                    Edit
                  </button>
                  {/* LANGSUNG panggil onDelete tanpa handleDelete internal */}
                  <button
                    onClick={(e) => onDelete(akun, e)}
                    className="rounded bg-red-500 px-3 py-1 text-white text-xs hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="py-10 text-center text-slate-400">
                Data tidak ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}