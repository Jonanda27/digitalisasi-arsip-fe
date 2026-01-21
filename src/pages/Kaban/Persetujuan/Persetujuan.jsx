import { useContext, useEffect, useMemo, useState } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";

import ApprovalsToolbar from "./components/ApprovalsToolbar";
import ApprovalsTable from "./components/ApprovalsTable";

const MOCK_ROWS = [
  {
    id: "a1",
    tanggal: "07 Nov 2025 | 12:30",
    pemohon: "Naufal",
    fileTujuan: "Perbup Tahun 2020",
    tipeDokumen: "Analog",
    tingkat: "umum",
  },
  {
    id: "a2",
    tanggal: "08 Nov 2025 | 14:10",
    pemohon: "Sekretaris",
    fileTujuan: "Surat Keputusan Kepala Badan Tahun 2025",
    tipeDokumen: "Digital",
    tingkat: "terbatas",
  },
  {
    id: "a3",
    tanggal: "10 Nov 2025 | 10:10",
    pemohon: "PBB",
    fileTujuan: "Surat Keputusan Kepala Badan Tahun 2025",
    tipeDokumen: "Digital",
    tingkat: "rahasia",
  },
];

export default function Persetujuan() {
  const { setTopbar } = useContext(TopbarContext);

  useEffect(() => {
    setTopbar({
      title: "Persetujuan Akses",
      showSearch: false, // sesuai mockup: search ada di dalam card/table
      searchPlaceholder: "Cari dokumen",
      onSearch: null,
    });
  }, [setTopbar]);

  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return MOCK_ROWS;
    return MOCK_ROWS.filter(
      (r) =>
        r.tanggal.toLowerCase().includes(s) ||
        r.pemohon.toLowerCase().includes(s) ||
        r.fileTujuan.toLowerCase().includes(s) ||
        r.tipeDokumen.toLowerCase().includes(s) ||
        r.tingkat.toLowerCase().includes(s)
    );
  }, [q]);

  const onApprove = (id) => console.log("APPROVE:", id);
  const onReject = (id) => console.log("REJECT:", id);

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      {/* card container besar */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-5">
          <ApprovalsToolbar value={q} onChange={setQ} onClear={() => setQ("")} />
        </div>

        <div className="px-5 pb-5">
          <ApprovalsTable rows={rows} onApprove={onApprove} onReject={onReject} />
        </div>
      </div>
    </div>
  );
}
