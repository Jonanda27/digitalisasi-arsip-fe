import { useState } from "react";
import searchBg from "../pages/Kaban/Dashboard/icons/pencarian.svg";

export default function Topbar({
  title = "",
  showSearch = false,
  searchPlaceholder = "Cari dokumen",
  onSearch,
}) {
  const [q, setQ] = useState("");

  // dummy user (nanti dari auth)
  const user = {
    name: "Fahrizal Mudzaqi Maulana",
    nip: "199203222019032005",
    roleLabel: "Pegawai",
    avatar: "https://i.pravatar.cc/80?img=12",
  };

  const submit = (e) => {
    e.preventDefault();
    if (typeof onSearch === "function") onSearch(q);
  };

  return (
    <div className="flex items-start justify-between gap-6">
      {/* kiri: title + search */}
      <div className="min-w-0 flex-1">
        {title ? (
          <h1 className="text-[30px] font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
        ) : null}

        {showSearch ? (
          <form
            onSubmit={submit}
            className="mt-6 w-full max-w-[520px]" // 👈 dari mt-4 → mt-6
          >
            <div
              className="relative h-[48px] w-full overflow-hidden rounded-full
                  border border-slate-200 bg-white shadow-sm
                  focus-within:border-[#1F5EFF] focus-within:ring-4 focus-within:ring-blue-100"
            >
              {/* background diagonal (di DALAM field) */}
              <img
                src={searchBg}
                alt=""
                className="pointer-events-none absolute right-0 top-0 h-full w-[96px] select-none"
              />

              {/* input */}
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={searchPlaceholder}
                className="relative z-10 h-full w-full bg-transparent
                 pl-5 pr-[96px] text-sm text-slate-700 outline-none"
              />

              {/* icon search */}
              <button
                type="submit"
                aria-label="Cari"
                title="Cari"
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2
                 grid h-8 w-8 place-items-center rounded-full
                 text-white hover:brightness-95"
              ></button>
            </div>
          </form>
        ) : null}
      </div>

      {/* kanan: profil */}
      <div className="flex shrink-0 items-center gap-3">
        <img
          src={user.avatar}
          alt="avatar"
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-900">
            {user.name}
          </div>
          <div className="text-xs text-slate-500">{user.nip}</div>
          <div className="text-xs text-slate-600">{user.roleLabel}</div>
        </div>
      </div>
    </div>
  );
}
