import { useContext, useEffect, useMemo, useState } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";

import StatCard from "./components/CardStat";
import RekapBidangTable from "./components/RekapBidangTable";
import ActivityLogTable from "./components/RekapPengguna";

export default function AdminLaporan() {
  const topbarCtx = useContext(TopbarContext);

  useEffect(() => {
    topbarCtx?.setTopbar((p) => ({
      ...p,
      title: "Laporan Rekapitulasi Arsip",
      showSearch: false,
    }));
  }, [topbarCtx]);

  return (
    <div className="space-y-6">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Arsip" value="2840" />
        <StatCard title="Scan Dokumen Bulan Ini" value="1420" />
        <StatCard title="Draft Dokumen" value="980" />
        <StatCard title="Sisa Penyimpanan Server" value="750 GB" />
      </div>

      {/* TABLE REKAP */}
      <RekapBidangTable />

      {/* LOG AKTIVITAS */}
      <ActivityLogTable />
    </div>
  );
}
