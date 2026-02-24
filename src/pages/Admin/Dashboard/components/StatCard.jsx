import folderSvg from "../icons/folder.svg";

const iconMap = {
  folder: folderSvg,
};

export default function StatCard({ title, value, subtitle, icon = "folder" }) {
  const iconSrc = iconMap[icon] || folderSvg;

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ring-1 ring-slate-100 animate-mobile-entry">
      
      {/* Dekorasi Latar Belakang: Lingkaran cahaya halus */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      {/* Icon: Diletakkan di kanan dengan penyesuaian ukuran di mobile */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-slate-50 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm sm:shadow-none">
          <img
            src={iconSrc}
            alt=""
            draggable="false"
            className="h-10 w-10 sm:h-12 sm:w-12 select-none drop-shadow-sm transition-all group-hover:drop-shadow-md"
          />
        </div>
      </div>

      {/* Content Area: Menggunakan pr-20 di mobile agar tidak tertutup ikon yang lebih kecil */}
      <div className="relative z-10 flex h-full flex-col justify-between pr-20 sm:pr-24">
        <div>
          <span className="inline-block rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 animate-mobile-slide-right">
            Statistik
          </span>
          <div className="mt-2 text-sm font-semibold text-slate-500 transition-colors group-hover:text-blue-600">
            {title}
          </div>
        </div>

        <div className="mt-auto">
          {/* Nilai angka dengan animasi hitung naik sederhana di mobile */}
          <div className="text-5xl font-black leading-none tracking-tighter text-slate-900 tabular-nums animate-mobile-value-pop">
            {value}
          </div>

          <div className="mt-3 flex items-center gap-1.5 whitespace-nowrap text-[11px] sm:text-[12px] font-medium text-orange-600">
            <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
            <span className="italic">{subtitle}</span>
          </div>
        </div>
      </div>

      {/* --- MOBILE ANIMATION ENGINE --- */}
      <style jsx>{`
        @media (max-width: 767px) {
          /* Animasi Masuk Kartu */
          .animate-mobile-entry {
            animation: cardEntry 0.7s cubic-bezier(0.23, 1, 0.32, 1) both;
          }

          /* Animasi Label "Statistik" */
          .animate-mobile-slide-right {
            animation: slideRight 0.8s ease-out 0.2s both;
          }

          /* Animasi Angka Value */
          .animate-mobile-value-pop {
            animation: valuePop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.4s both;
          }
        }

        @keyframes cardEntry {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes slideRight {
          0% { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes valuePop {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}