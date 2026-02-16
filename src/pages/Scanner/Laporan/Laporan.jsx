import { useContext, useEffect, useMemo, useState } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";

import StatCard from "./components/StatCard";
import RekapBidangTable from "./components/RekapBidangTable";
import ActivityLogTable from "./components/ActivityLogTable";

export default function ScannerLaporan() {
  const topbarCtx = useContext(TopbarContext);

  // ✅ FIX: Infinite Loop solved here
  useEffect(() => {
    const setTopbar = topbarCtx?.setTopbar;
    if (!setTopbar) return;

    setTopbar((p) => ({
      ...p,
      title: "Laporan Rekapitulasi Arsip",
      showSearch: false,
    }));

    // Dependency diubah ke function setTopbar saja agar stabil
  }, [topbarCtx?.setTopbar]);

  return (
    <div className="space-y-6">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Target Bulan Ini" value="2840" />
        <StatCard title="Scan Dokumen Hari Ini" value="1420" />
        <StatCard title="Total Dokumen Arsip Digital" value="4360" />
        <StatCard title="Progress Digitalisasi/Bulan" value="25%" />
      </div>

      {/* TABLE REKAP */}
      <RekapBidangTable />

      {/* LOG AKTIVITAS */}
      <ActivityLogTable />
    </div>
  );
}