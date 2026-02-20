import React, { useState } from "react";
import axios from "axios";

// icons
import scanIcon from "../icons/mulai-scan.svg";
import fileIcon from "../icons/file.svg";

export default function EmptyState({ icon, onScannerFound, onPickFile }) {
  const [loadingScanner, setLoadingScanner] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleStartScanning = async () => {
    // --- MODE MAINTENANCE ---
    alert("Mohon Maaf, Fitur Scanning sedang dalam proses maintenance / pemeliharaan.");
    return; // Berhenti di sini agar tidak menjalankan kode di bawahnya

    /* // BAGIAN HIT API DI-NONAKTIFKAN SEMENTARA
    setLoadingScanner(true);
    setShowError(false);
    try {
      const res = await axios.get("http://127.0.0.1:5001/scanner/list");

      if (res.data.available && res.data.devices.length > 0) {
        onScannerFound(res.data);
      } else {
        triggerError();
      }
    } catch (err) {
      triggerError();
    } finally {
      setLoadingScanner(false);
    }
    */
  };

  const triggerError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  return (
    <div className="relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden rounded-[3rem] bg-gradient-to-b from-white to-slate-50/50 p-8 text-center">
      <div
        className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl ring-8 ring-slate-50 transition-all duration-500 
        ${loadingScanner ? "scale-110" : "scale-100"} 
        ${showError ? "animate-bounce ring-red-100" : ""}`}
      >
        {loadingScanner && (
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500"></div>
        )}

        <img
          src={icon}
          alt=""
          className={`h-12 w-12 transition-all duration-300 ${showError ? "brightness-110 sepia hue-rotate-[320deg]" : "opacity-80"}`}
        />
      </div>

      <div className="mt-8">
        <h3
          className={`text-xl font-black transition-colors duration-300 ${showError ? "text-red-600" : "text-slate-800"}`}
        >
          {showError
            ? "Scanner Tidak Terdeteksi"
            : "Siap Mengarsipkan Dokumen?"}
        </h3>

        <p
          className={`mx-auto mt-3 max-w-[420px] text-[14px] leading-relaxed transition-colors duration-300 ${showError ? "text-red-400" : "text-slate-500"}`}
        >
          {showError
            ? "API Port 5001 aktif, namun sistem tidak menemukan perangkat scanner yang terhubung. Pastikan kabel USB sudah terpasang."
            : loadingScanner
              ? "Menghubungkan ke layanan scanner lokal..."
              : "Gunakan mesin scanner untuk proses digitalisasi dokumen fisik secara otomatis."}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          disabled={loadingScanner}
          onClick={handleStartScanning}
          className={`group relative flex h-[52px] items-center gap-3 overflow-hidden rounded-2xl px-8 text-[14px] font-bold text-white shadow-xl transition-all active:scale-95 
            ${showError ? "bg-red-500 shadow-red-200" : "bg-blue-600 shadow-blue-200 hover:bg-blue-700"}`}
        >
          {loadingScanner ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              <span>Mencari...</span>
            </div>
          ) : (
            <>
              <img
                src={scanIcon}
                alt=""
                className="h-5 w-5 brightness-0 invert"
              />
              <span>{showError ? "Coba Lagi" : "Mulai Scanning"}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onPickFile}
          className="group flex h-[52px] items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-8 text-[14px] font-bold text-slate-600 shadow-sm transition-all hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
        >
          <img
            src="data:image/svg+xml,%3csvg%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M11.9167%208.24998V3.20831L16.9584%208.24998M5.50002%201.83331C4.48252%201.83331%203.66669%202.64915%203.66669%203.66665V18.3333C3.66669%2018.8195%203.85984%2019.2859%204.20366%2019.6297C4.54747%2019.9735%205.01379%2020.1666%205.50002%2020.1666H16.5C16.9863%2020.1666%2017.4526%2019.9735%2017.7964%2019.6297C18.1402%2019.2859%2018.3334%2018.8195%2018.3334%2018.3333V7.33331L12.8334%201.83331H5.50002Z'%20fill='black'/%3e%3c/svg%3e"
            alt=""
            className="h-5 w-5 opacity-70"
          />
          <span>Pilih File Komputer</span>
        </button>
      </div>

      <div
        className={`absolute bottom-6 transition-all duration-500 transform ${showError ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <div className="flex items-center gap-2 rounded-full bg-red-50 border border-red-100 px-4 py-2 text-[12px] font-bold text-red-500 shadow-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          Hardware Error: Periksa koneksi USB Scanner Anda
        </div>
      </div>
    </div>
  );
}