import { useState, useEffect } from "react";
import { API } from "../global/api";
import { getToken } from "../auth/auth";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiChevronDown } from "react-icons/hi";

export default function Topbar({
  title = "",
  showSearch = false,
  searchPlaceholder = "Cari dokumen...",
  onSearch,
}) {
  const [q, setQ] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (typeof onSearch === "function") onSearch(q);
  };

  return (
    <div className="sticky top-0 z-[40] w-full bg-[#F6F8FC]/80 backdrop-blur-md px-0 ">
      <div className="flex items-center justify-between gap-6">
        {/* SISI KIRI: JUDUL & PENCARIAN */}
        <div className="flex flex-1 items-center gap-10">
          {title && (
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden whitespace-nowrap text-2xl font-black tracking-tight text-slate-800 lg:block"
            >
              {title}
            </motion.h1>
          )}

          {showSearch && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={submit}
              className="relative w-full max-w-[450px]"
            >
              <div className="group relative flex items-center">
                <HiOutlineSearch className="absolute left-4 text-xl text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm 
                             text-slate-700 shadow-sm transition-all outline-none
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                />
              </div>
            </motion.form>
          )}
        </div>

        {/* SISI KANAN: USER PROFILE */}
        <div className="flex items-center relative">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="h-11 w-48 rounded-2xl bg-slate-200 animate-pulse" />
            ) : user ? (
              <div className="relative">
                {/* Profile Button */}
                <motion.div
                  layout
                  onClick={() => setIsDetailOpen(!isDetailOpen)}
                  className="flex items-center bg-white border border-slate-200 shadow-sm rounded-2xl p-1 pr-3 cursor-pointer hover:border-blue-300 transition-colors"
                >
                  {/* AVATAR: Sembunyi di mobile (hidden), muncul di tablet/ipad ke atas (md:block) */}
                  <div className="relative shrink-0 ml-0.5 hidden md:block">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.nama,
                      )}&background=1D4EA8&color=fff&bold=true`}
                      alt="avatar"
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm"></div>
                  </div>

                  <div className="ml-2 md:ml-3 flex items-center gap-2 whitespace-nowrap">
                    <span className="text-[14px] font-bold text-slate-800">
                      {user.nama
                        ? user.nama.split(" ").slice(0, 2).join(" ")
                        : ""}
                    </span>
                  </div>

                  {/* AREA DETAIL DESKTOP (Sideways) - Tetap untuk layar lebar */}
                  <AnimatePresence>
                    {isDetailOpen && (
                      <motion.div
                        initial={{ width: 0, opacity: 0, x: -10 }}
                        animate={{ width: "auto", opacity: 1, x: 0 }}
                        exit={{ width: 0, opacity: 0, x: -10 }}
                        className="hidden lg:flex items-center overflow-hidden border-l border-slate-100 ml-3 pl-3 gap-3"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {user.role}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 italic whitespace-nowrap">
                          NIP: {user.nip || "-"}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="ml-3"
                    animate={{ rotate: isDetailOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <HiChevronDown className="text-slate-400 text-lg" />
                  </motion.div>
                </motion.div>

                {/* AREA DETAIL DROPDOWN: Muncul di Mobile & iPad (Dibawah lg) */}
                <AnimatePresence>
                  {isDetailOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -10 }}
                      animate={{ height: "auto", opacity: 1, y: 5 }}
                      exit={{ height: 0, opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-full min-w-[200px] bg-white border border-slate-200 shadow-xl rounded-2xl p-4 lg:hidden z-[50] overflow-hidden"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Role
                          </span>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit">
                            {user.role}
                          </span>
                        </div>
                        <div className="h-px bg-slate-100 my-1" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Nomor Induk
                          </span>
                          <span className="text-xs font-medium text-slate-600 italic">
                            NIP: {user.nip || "-"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-sm font-bold text-slate-400">Masuk Akun</div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
