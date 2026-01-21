import illustration from "../icons/illustrasi-arsip.svg";
import calendarSvg from "../icons/date.svg";

export default function WelcomeCard() {
  return (
    <div
      className="
        h-full relative overflow-hidden
        rounded-2xl
        bg-gradient-to-br from-[#2C6BFF] to-[#143E9C]
        px-7 py-6           
        text-white
      "
    >
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
        {/* LEFT */}
        <div>
          <p className="text-[20px] font-medium text-white">
            Selamat Datang,
          </p>

          <h2 className="mt-1 text-[30px] font-semibold leading-tight">
            Naufal Fadil Aziz
          </h2>

          {/* Date */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#3B82F6] px-4 py-2 text-sm">
            <img src={calendarSvg} alt="" className="h-4 w-4" />
            <span>8 Januari 2026 | 09:42 WIT</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:flex justify-end">
          <img
            src={illustration}
            alt=""
            className="max-h-[150px] w-auto select-none"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}