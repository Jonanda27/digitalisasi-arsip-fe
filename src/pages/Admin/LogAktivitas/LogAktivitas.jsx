import { useContext, useEffect, useMemo } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";

import LogTable from "./components/LogTable";

export default function AdminLog() {
  const topbarCtx = useContext(TopbarContext);

  useEffect(() => {
    topbarCtx?.setTopbar((p) => ({
      ...p,
      title: "Log Aktivitas",
      showSearch: false,
    }));
  }, [topbarCtx]);

  const logs = useMemo(
    () => [
      {
        id: "001",
        waktu: "04/12/2026, 22:36 WIT",
        user: {
          nama: "Bidang PBB",
          detail: "pbb.staf@bapenda.go.id",
        },
        kategori: "Persetujuan Akses",
        aktivitas: "Meminta akses folder",
        status: "Sukses",
      },
      {
        id: "002",
        waktu: "05/12/2025, 12:30 WIT",
        user: {
          nama: "Admin",
          detail: "admin.staf@bapenda.go.id",
        },
        kategori: "Manajemen Akun",
        aktivitas: "Membuat akun baru",
        status: "Sukses",
      },
      {
        id: "003",
        waktu: "07/01/2026, 12:30 WIT",
        user: {
          nama: "Sistem",
          detail: "Sistem Lokal",
        },
        kategori: "Sistem",
        aktivitas: "Proses OCR",
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
