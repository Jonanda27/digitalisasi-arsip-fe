import React, { useState } from "react";
import axios from "axios";

// icons
import scanIcon from "../icons/mulai-scan.svg";
import fileIcon from "../icons/file.svg";

export default function EmptyState({ icon, onScannerFound, onPickFile }) {
  const [loadingScanner, setLoadingScanner] = useState(false);

  const handleStartScanning = async () => {
    setLoadingScanner(true);
    try {
      // Menggunakan fetch atau axios ke port 5001
      const res = await axios.get("http://127.0.0.1:5001/scanner/list");
      
      // Cek apakah fungsi ini ada sebelum dipanggil untuk menghindari error
      if (typeof onScannerFound === "function") {
        onScannerFound(res.data);
      } else {
        console.error("Prop onScannerFound tidak dikirim oleh parent!");
      }
      
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Koneksi ke Scanner Service gagal.");
    } finally {
      setLoadingScanner(false);
    }
  };

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center">
      <img src={icon} alt="" className="h-14 w-14 opacity-80" draggable="false" />

      <div className="mt-5 text-[18px] font-semibold text-slate-900">
        Belum Ada Dokumen
      </div>

      <div className="mt-2 max-w-[460px] text-center text-[13px] leading-6 text-slate-400">
        {loadingScanner 
          ? "Sedang mencari perangkat scanner yang terhubung..." 
          : "Pastikan scanner sudah menyala dan dokumen sudah diletakkan pada mesin scanner."}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          disabled={loadingScanner}
          onClick={handleStartScanning}
          className={`flex items-center gap-2 h-[40px] rounded-xl px-5 text-[13px] font-semibold text-white shadow-sm transition ${
            loadingScanner ? "bg-slate-400" : "bg-[#2563EB] hover:brightness-95"
          }`}
        >
          <img src={scanIcon} alt="" className="h-4 w-4" draggable="false" />
          {loadingScanner ? "Mencari..." : "Mulai Scanning"}
        </button>

        <button
          type="button"
          onClick={onPickFile}
          className="flex items-center gap-2 h-[40px] rounded-xl bg-[#F59E0B] px-5 text-[13px] font-semibold text-white shadow-sm hover:brightness-95 transition"
        >
          <img src={fileIcon} alt="" className="h-4 w-4" draggable="false" />
          Pilih File Lokal
        </button>
      </div>
    </div>
  );
}