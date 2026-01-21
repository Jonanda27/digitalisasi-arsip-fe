import checkSvg from "../icons/checklist.svg";
import xSvg from "../icons/x.svg";

const rows = [
  {
    date: "07 Nov 2025 | 12:30",
    bidang: "PBB",
    reason: "Untuk print dokumen fisik",
    type: "Analog",
    level: "Umum",
  },
  {
    date: "08 Nov 2025 | 14:10",
    bidang: "Sekretaris",
    reason: "Permintaan dari Bapak Gubernur Papua",
    type: "Digital",
    level: "Terbatas",
  },
  {
    date: "10 Nov 2025 | 10:10",
    bidang: "PBB",
    reason: "Ingin mengecek dokumen takut ada yang tertinggal",
    type: "Digital",
    level: "Rahasia",
  },
];

const levelStyle = {
  Umum: "bg-emerald-600 text-white",
  Terbatas: "bg-amber-500 text-white",
  Rahasia: "bg-red-700 text-white",
};

export default function AccessRequestTable() {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">
          Permintaan Akses Terbaru
        </h2>
        <button className="text-sm text-slate-400 hover:text-slate-600 transition">
          Lihat Selengkapnya
        </button>
      </div>

      <div className="px-6 pb-6 overflow-x-auto">
        <table className="min-w-[980px] w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="py-3 font-medium">Tanggal Permintaan</th>
              <th className="py-3 font-medium">Nama Bidang Peminta</th>
              <th className="py-3 font-medium">Keperluan/Kepentingan</th>
              <th className="py-3 font-medium">Tipe Dokumen</th>
              <th className="py-3 font-medium">Tingkat Kerahasiaan</th>
              <th className="py-3 font-medium">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((r, idx) => (
              <tr key={idx} className="text-slate-700">
                <td className="py-4">{r.date}</td>
                <td className="py-4">{r.bidang}</td>
                <td className="py-4">{r.reason}</td>
                <td className="py-4">{r.type}</td>
                <td className="py-4">
                  <span
                    className={[
                      "inline-flex rounded-lg px-3 py-1 text-xs font-semibold",
                      levelStyle[r.level] || "bg-slate-200 text-slate-700",
                    ].join(" ")}
                  >
                    {r.level}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <button
                      className="grid h-9 w-9 place-items-center"
                      title="Setujui"
                      type="button"
                    >
                      <img src={checkSvg} alt="" className="h-5 w-5" draggable="false" />
                    </button>

                    <button
                      className="grid h-9 w-9 place-items-center"
                      title="Tolak"
                      type="button"
                    >
                      <img src={xSvg} alt="" className="h-5 w-5" draggable="false" />
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
