import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo-arsip-2.png";

import gridSvg from "./icons/dashboard.svg";
import searchSvg from "./icons/search.svg";
import inputSvg from "./icons/input-dokumen.svg";
import starSvg from "./icons/favorit.svg";
import approvalSvg from "./icons/persetujuan-akses.svg";
import logSvg from "./icons/log-aktivitas.svg";
import manajemenSvg from "./icons/manajemen.svg";
import laporanSvg from "./icons/laporan.svg";
import akunSvg from "./icons/akun-pengguna.svg";
import logoutSvg from "./icons/logout.svg";

import { getRole, clearAuth } from "../auth/auth";
import LogoutModal from "../global/LogoutModal";

const NAV_BY_ROLE = {
  kaban: [
    { key: "dashboard", label: "Dashboard", icon: gridSvg, to: "/kaban/dashboard", end: true },
    { key: "search", label: "Pencarian Dokumen", icon: searchSvg, to: "/kaban/search" },
    { key: "favorite", label: "Favorit", icon: starSvg, to: "/kaban/favorite" },
    { key: "approval", label: "Persetujuan Akses", icon: approvalSvg, to: "/kaban/approval" },
    { key: "activity", label: "Log Aktivitas", icon: logSvg, to: "/kaban/activity" },
  ],
  pegawai: [
    { key: "search", label: "Pencarian Dokumen", icon: searchSvg, to: "/pegawai/search", end: true },
    { key: "input", label: "Input Dokumen", icon: inputSvg, to: "/pegawai/input" },
    { key: "favorite", label: "Favorit", icon: starSvg, to: "/pegawai/favorite" },
    { key: "status", label: "Status Permintaan", icon: approvalSvg, to: "/pegawai/status" },
    { key: "activity", label: "Log Aktivitas", icon: logSvg, to: "/pegawai/activity" },
    { 
      key: "bantuan", 
      label: "Bantuan", 
      icon: manajemenSvg, 
      children: [
        { label: "Manual Book", to: "/pegawai/book" },
        { label: "Admin", to: "/pegawai/admin" },
        { label: "FAQ", to: "/pegawai/faq" },
      ]
    },
  ],
  admin: [
    { key: "dashboard", label: "Dashboard", icon: gridSvg, to: "/admin/dashboard", end: true },
    { key: "manajemen", label: "Manajemen Arsip", icon: manajemenSvg, to: "/admin/manajemenarsip" },
    { key: "laporan", label: "Laporan", icon: laporanSvg, to: "/admin/laporan" },
    { key: "activity", label: "Log Aktivitas", icon: logSvg, to: "/admin/logaktivitas" },
    { key: "akun", label: "Akun Pengguna", icon: akunSvg, to: "/admin/akunpengguna" },
  ],
  scanner: [
    { key: "dashboard", label: "Dashboard", icon: gridSvg, to: "/scanner/dashboard", end: true },
    { key: "inputdokumen", label: "Input Dokumen", icon: inputSvg, to: "/scanner/input-dokumen" },
    { key: "laporan", label: "Laporan", icon: laporanSvg, to: "/scanner/laporan" },
    { key: "activity", label: "Log Aktivitas", icon: logSvg, to: "/scanner/log-aktivitas" },
  ],
};

export default function Navbar() {
  const role = useMemo(() => getRole() || "guest", []);
  const [openLogout, setOpenLogout] = useState(false);
  
  // ✅ Gunakan nama state yang konsisten
  const [openBantuan, setOpenBantuan] = useState(false);

  if (role === "guest") return null;

  const navItems = NAV_BY_ROLE[role] || [];

  const doLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 z-50 h-screen w-[280px] flex-col bg-[#1D4EA8] text-white overflow-y-auto">
        {/* Logo */}
        <div className="px-6 pt-2 pb-15 flex justify-center">
          <div className="w-full max-w-[220px] overflow-hidden">
            <img
              src={logo}
              alt="Digitalisasi Arsip"
              draggable="false"
              style={{ height: 75 }}
              className="w-full object-cover select-none"
            />
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-8">
          <ul className="space-y-7">
            {navItems.map((item) => {
              // LOGIKA DROPDOWN
              if (item.children) {
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => setOpenBantuan(!openBantuan)}
                      className={`group flex w-full items-center gap-4 text-left transition-colors duration-200 ${
                        openBantuan ? "text-white" : "text-white/50 hover:text-white"
                      }`}
                    >
                      <img
                        src={item.icon}
                        alt=""
                        className={`h-6 w-6 transition duration-200 [filter:brightness(0)_invert(1)] ${
                          openBantuan ? "opacity-100" : "opacity-50 group-hover:opacity-100"
                        }`}
                      />
                      <span className="text-[16px] font-normal flex-1">{item.label}</span>
                      {/* Icon Panah Sederhana (SVG) */}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${openBantuan ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Sub-menu (Muncul jika openBantuan === true) */}
                    {openBantuan && (
                      <ul className="mt-4 ml-10 space-y-4 border-l border-white/20 pl-4">
                        {item.children.map((sub) => (
                          <li key={sub.label}>
                            <NavLink
                              to={sub.to}
                              className={({ isActive }) =>
                                `block text-[14px] transition-colors ${
                                  isActive ? "text-white font-medium" : "text-white/50 hover:text-white"
                                }`
                              }
                            >
                              {sub.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // RENDER MENU BIASA
              return (
                <li key={item.key}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `group flex w-full items-center gap-4 text-left transition-colors duration-200 ${
                        isActive ? "text-white" : "text-white/50 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <img
                          src={item.icon}
                          alt=""
                          className={`h-6 w-6 transition duration-200 [filter:brightness(0)_invert(1)] ${
                            isActive ? "opacity-100" : "opacity-50 group-hover:opacity-100"
                          }`}
                        />
                        <span className="text-[16px] font-normal">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-8 pb-8 pt-6">
          <button
            type="button"
            className="group flex w-full items-center gap-4 text-white/50 hover:text-white transition-colors duration-200"
            onClick={() => setOpenLogout(true)}
          >
            <img
              src={logoutSvg}
              alt=""
              className="h-6 w-6 opacity-50 transition duration-200 [filter:brightness(0)_invert(1)] group-hover:opacity-100"
              draggable="false"
            />
            <span className="text-[16px] font-normal">Logout</span>
          </button>
        </div>
      </aside>

      <LogoutModal
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        onConfirm={doLogout}
      />
    </>
  );
}