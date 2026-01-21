// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/Login";

import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";

// Kaban
import KabanDashboard from "./pages/Kaban/Dashboard/Dashboard";
import KabanSearch from "./pages/Kaban/Pencarian/Pencarian";
import KabanFavorit from "./pages/Kaban/Favorit/Favorit";
import KabanPersetujuan from "./pages/Kaban/Persetujuan/Persetujuan";
import KabanLog from "./pages/Kaban/Log/Log";

// Pegawai
import PegawaiSearch from "./pages/Pegawai/Pencarian/Pencarian";
import PegawaiInput from "./pages/Pegawai/Input/Input";

// Admin
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminManajemen from "./pages/Admin/Manajemen/Manajemen";
import AdminLaporan from "./pages/Admin/Laporan/Laporan";
import AdminLog from "./pages/Admin/LogAktivitas/LogAktivitas";
import AdminAkun from "./pages/Admin/AkunPengguna/AkunPengguna";

// Scanner
import ScannerDashboard from "./pages/Scanner/Dashboard/Dashboard";
import ScannerInput from "./pages/Scanner/Input/Input";
import ScannerLaporan from "./pages/Scanner/Laporan/Laporan";
import ScannerLog from "./pages/Scanner/LogAktivitas/LogAktivitas";

export default function App() {
  return (
    <Routes>
      {/* default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* auth */}
      <Route path="/login" element={<Login />} />

      {/* semua halaman yang butuh login */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          {/* KABAN */}
          <Route element={<RequireRole allow={["kaban"]} />}>
            <Route path="/kaban">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<KabanDashboard />} />
              <Route path="search" element={<KabanSearch />} />
              <Route path="favorite" element={<KabanFavorit />} />
              <Route path="approval" element={<KabanPersetujuan />} />
              <Route path="activity" element={<KabanLog />} />
            </Route>
          </Route>

          {/* PEGAWAI */}
          <Route element={<RequireRole allow={["pegawai"]} />}>
            <Route path="/pegawai">
              {/* lu tadi salah: index ke dashboard tapi elementnya PegawaiSearch */}
              {/* kita rapihin: default ke search */}
              <Route index element={<Navigate to="search" replace />} />
              <Route path="search" element={<PegawaiSearch />} />
              <Route path="input" element={<PegawaiInput />} />

              {/*
              <Route path="input" element={<PegawaiInput />} />
              <Route path="favorite" element={<PegawaiFavorit />} />
              <Route path="status" element={<PegawaiStatus />} />
              <Route path="activity" element={<PegawaiLog />} />
              */}
            </Route>
          </Route>

          {/* ADMIN */}
          <Route element={<RequireRole allow={["admin"]} />}>
            <Route path="/admin">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="manajemen-arsip" element={<AdminManajemen />} />
              <Route path="laporan" element={<AdminLaporan />} />
              <Route path="log-aktivitas" element={<AdminLog />} />
              <Route path="akun-pengguna" element={<AdminAkun />} />
              {/*
              <Route path="manajemen-arsip" element={<AdminManajemen />} />
              <Route path="laporan" element={<AdminLaporan />} />
              <Route path="log-aktivitas" element={<AdminLog />} />
              <Route path="akun-pengguna" element={<AdminAkun />} />
              */}
            </Route>
          </Route>

          {/* SCANNER */}
        
          <Route element={<RequireRole allow={["scanner"]} />}>
              <Route path="/scanner" >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ScannerDashboard />} />
              <Route path="input-dokumen" element={<ScannerInput />} />
              <Route path="laporan" element={<ScannerLaporan />} />
              <Route path="log-aktivitas" element={<ScannerLog />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
