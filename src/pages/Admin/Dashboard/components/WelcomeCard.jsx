import { useState, useEffect, useMemo } from "react";
import calendarSvg from "../icons/date.svg";
import img6 from "../../../../assets/image6.png"; 
import img7 from "../../../../assets/image7.png";
import img8 from "../../../../assets/image8.png";

export default function WelcomeCard({ name }) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [bgIndex, setBgIndex] = useState(0);
  
  const backgrounds = [img6, img7, img8];

  useEffect(() => {
    const clockTimer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    const bgTimer = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(bgTimer);
    };
  }, [backgrounds.length]);

  const greeting = useMemo(() => {
    const hour = currentDateTime.getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  }, [currentDateTime]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date).replace(/\./g, ":");
  };

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-blue-900 text-white shadow-lg">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {backgrounds.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt={`background-${index}`} 
            // object-bottom digunakan untuk "menurunkan" fokus gambar agar area atas lebih terlihat
            className={`absolute inset-0 h-full w-full object-cover object-mid transition-opacity duration-1000 ease-in-out ${
              index === bgIndex ? "opacity-100" : "opacity-0"
            } group-hover:scale-110 transition-transform duration-1000`}
          />
        ))}
        <div className="absolute inset-0 bg-blue-900/50 transition-opacity duration-500 group-hover:bg-blue-900/40"></div>
      </div>
      
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

      <div className="relative z-10 flex h-full items-center px-8 py-6">
        <div className="flex flex-col">
          
          {/* FONT SIZE ADJUSTED: text-base & text-[26px] */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-base font-medium tracking-wide text-blue-50/80 drop-shadow-sm">
              {greeting},
            </p>
            <h2 className="text-[26px] font-bold leading-tight tracking-tight text-white drop-shadow-md">
              {name || "User"} <span className="inline-block animate-bounce-slow text-xl">👋</span>
            </h2>
          </div>

          {/* REAL-TIME BADGE */}
          <div className="mt-3 inline-flex w-fit items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 backdrop-blur-md shadow-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/30">
              <img src={calendarSvg} alt="" className="h-3.5 w-3.5 brightness-0 invert" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[12px] font-semibold tracking-tight">
                {formatDate(currentDateTime)}
              </span>
              <span className="mt-1 font-mono text-[10px] font-medium text-blue-100/70 tabular-nums">
                {formatTime(currentDateTime)} <span className="ml-1 text-[8px] font-bold opacity-60">WIB</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}