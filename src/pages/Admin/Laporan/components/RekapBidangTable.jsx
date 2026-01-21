const data = [
  {
    bidang: "PBB dan BPHTB",
    total: 300,
    umum: 50,
    terbatas: 100,
    rahasia: 150,
    permintaan: 97,
  },
  {
    bidang: "Pajak",
    total: 234,
    umum: 140,
    terbatas: 60,
    rahasia: 34,
    permintaan: 100,
  },
  {
    bidang: "Perencanaan dan Pengembangan Pendapatan Daerah",
    total: 198,
    umum: 50,
    terbatas: 50,
    rahasia: 98,
    permintaan: 50,
  },
  {
    bidang: "Pembukuan dan Pelaporan",
    total: 135,
    umum: 100,
    terbatas: 30,
    rahasia: 5,
    permintaan: 120,
  },
  {
    bidang: "Kepala Badan",
    total: 250,
    umum: 100,
    terbatas: 100,
    rahasia: 50,
    permintaan: 147,
  },
  {
    bidang: "Sekretariat",
    total: 367,
    umum: 150,
    terbatas: 50,
    rahasia: 167,
    permintaan: 36,
  },
  {
    bidang: "Unit Pelaksana Teknis Daerah",
    total: 210,
    umum: 110,
    terbatas: 50,
    rahasia: 50,
    permintaan: 47,
  },
];


export default function RekapBidangTable() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[25px] font-semibold text-slate-900">
          Rekap Arsip Setiap Bidang
        </div>

        <button className="rounded-[7px] bg-blue-600 px-4 py-2 text-[12px] font-regular text-white">
          Export PDF
        </button>
      </div>

      <table className="w-full table-fixed text-[12px]">
  <thead className="border-b text-[#94A3B8] font-medium">
    <tr>
      <th className="w-[18%] py-2 text-left">
        Nama Bidang/Jabatan
      </th>
      <th className="w-[15%] py-2 text-left">
        Jumlah Dokumen Terarsip
      </th>
      <th className="w-[10%] py-2 text-left">Umum</th>
      <th className="w-[10%] py-2 text-left">Terbatas</th>
      <th className="w-[10%] py-2 text-left">Rahasia</th>
      <th className="w-[15%] py-2 text-left">
        Permintaan Akses Dokumen
      </th>
    </tr>
  </thead>

  <tbody>
    {data.map((row, i) => (
      <tr
        key={i}
        className="border-b last:border-0 "
      >
        <td className="py-3 text-left text-slate-900">
          {row.bidang}
        </td>
        <td className="py-3 text-left">{row.total}</td>
        <td className="py-3 text-left">{row.umum}</td>
        <td className="py-3 text-left">{row.terbatas}</td>
        <td className="py-3 text-left">{row.rahasia}</td>
        <td className="py-3 text-left">
          {row.permintaan} Permintaan
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}

