import { useContext, useEffect, useMemo } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";

import LogTable from "./components/LogTable";

export default function ScannerLog() {
  const topbarCtx = useContext(TopbarContext);

  // ✅ FIX: Infinite Loop solved here
  useEffect(() => {
    const setTopbar = topbarCtx?.setTopbar;
    if (!setTopbar) return;

    setTopbar((p) => ({
      ...p,
      title: "Log Aktivitas",
      showSearch: false,
    }));

    // Dependency array diubah agar stabil
  }, [topbarCtx?.setTopbar]);

  const logs = useMemo(
    () => [
      {
        id: "001",
        waktu: "04/12/2026, 22:36 WIT",
        kategori: "Scan Dokumen",
        aktivitas: "Scan dokumen arsip fisik",
        status: "Sukses",
      },
      {
        id: "002",
        waktu: "05/12/2026, 12:30 WIT",
        kategori: "Upload File",
        aktivitas: "Upload file dokumen digital",
        status: "Sukses",
      },
      {
        id: "003",
        waktu: "07/01/2026, 12:30 WIT",
        kategori: "Sistem",
        aktivitas: "Login ke dalam aplikasi",
        status: "Sukses",
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <LogTable data={logs} />
    </div>
  );
}