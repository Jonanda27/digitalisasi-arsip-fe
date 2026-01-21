import storageSvg from "../icons/storage.svg";

export default function StorageCard() {
  return (
    <div className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="h-full flex flex-col">
        {/* Title (tetap di atas) */}
        <div className="text-sm text-slate-400">Penyimpanan Server</div>

        {/* Middle group (dibikin center biar ga kosong) */}
        <div className="flex-1 grid place-content-center">
          <div className="w-full min-w-[240px] max-w-[320px]">
            {/* Row: 25% Terpakai | icon + 1TB */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[#1D4ED8]">
                25% Terpakai
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <img
                  src={storageSvg}
                  alt=""
                  className="h-3.5 w-3.5 opacity-70"
                  draggable="false"
                />
                <span>1TB</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
              <div className="h-2 w-[25%] rounded-full bg-[#1D4ED8]" />
            </div>
          </div>
        </div>

        {/* Footer (tetap di bawah) */}
        <div className="text-[12px] text-[#1D4ED8]">
          Penyimpanan server tersisa{" "}
          <span className="font-semibold">750 GB</span> lagi
        </div>
      </div>
    </div>
  );
}
