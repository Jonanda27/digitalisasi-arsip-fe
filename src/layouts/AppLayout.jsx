// src/layouts/AppLayout.jsx
import { Outlet } from "react-router-dom";
import { createContext, useMemo, useState } from "react";
import Navbar from "../global/Navbar";
import Topbar from "../global/Topbar";

export const TopbarContext = createContext(null);

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State baru
  const [topbar, setTopbar] = useState({
    title: "",
    showSearch: false,
    searchPlaceholder: "Cari dokumen",
    onSearch: null,
  });

  const value = useMemo(() => ({ topbar, setTopbar }), [topbar]);

  return (
    <TopbarContext.Provider value={value}>
      <div className="min-h-screen bg-[#F6F8FC]">
        {/* Kirim state ke Navbar */}
        <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main className="h-screen lg:ml-[280px] flex flex-col overflow-hidden transition-all duration-300">
          <div className="shrink-0 bg-[#F6F8FC]">
            <div className="px-5 pt-4 pb-3 lg:px-6 flex items-center gap-4">
              {/* Tombol Hamburger - Hanya tampil di bawah lg */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 lg:hidden text-slate-600"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex-1">
                <Topbar
                  title={topbar.title}
                  showSearch={topbar.showSearch}
                  searchPlaceholder={topbar.searchPlaceholder}
                  onSearch={topbar.onSearch}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pb-10 lg:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </TopbarContext.Provider>
  );
}