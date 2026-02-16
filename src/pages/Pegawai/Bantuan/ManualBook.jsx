import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { TopbarContext } from "../../../layouts/AppLayout";
import { 
  HiOutlineDownload, 
  HiOutlineDocumentText, 
  HiOutlineInformationCircle,
  HiOutlineEye
} from "react-icons/hi";
// 1. Import komponen notifikasi
import SuccessNotification from "./components/SuccessNotification"; 

export default function ManualBookPage() {
  const { setTopbar } = useContext(TopbarContext);
  const [fileSize, setFileSize] = useState("Menghitung...");
  // 2. Tambahkan state untuk mengontrol notifikasi
  const [showSuccess, setShowSuccess] = useState(false);

  const FILE_PATH = "/ManualBook.pdf"; 
  const FILE_NAME = "Panduan_User_Sistem_Arsip.pdf";

  const formatBytes = (bytes, decimals = 1) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  useEffect(() => {
    setTopbar({ title: "Manual Book" });

    const fetchFileSize = async () => {
      try {
        const response = await fetch(FILE_PATH);
        if (response.ok) {
          const blob = await response.blob();
          setFileSize(formatBytes(blob.size));
        } else {
          setFileSize("File tidak ditemukan");
        }
      } catch (error) {
        setFileSize("Error akses file");
      }
    };

    fetchFileSize();
  }, [setTopbar]);

  // 3. Fungsi Handler untuk Unduh
  const handleDownloadSuccess = () => {
    setShowSuccess(true);
  };

  return (
    <div className="relative min-h-screen bg-[#F6F8FC] overflow-hidden p-6 md:p-10">
      
      {/* --- BACKGROUND ANIMATION --- */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <span className="bg-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase">
            Pusat Edukasi
          </span>
          <h1 className="text-4xl font-extrabold text-slate-800 mt-4">Dokumentasi Panduan</h1>
          <p className="text-slate-500 mt-3 text-lg">Pelajari cara penggunaan sistem melalui dokumen resmi di bawah ini.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Detail */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full transition-all group-hover:bg-indigo-500/10" />

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-indigo-200">
                  <HiOutlineDocumentText />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Detail File</h3>
                  <p className="text-indigo-600 font-medium text-xs uppercase tracking-widest">Informasi Utama</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-indigo-50 transition-colors">
                    <HiOutlineInformationCircle className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nama Dokumen</span>
                    <span className="text-sm font-bold truncate pr-2">{FILE_NAME}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-600">
                  <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-indigo-50 transition-colors">
                    <HiOutlineEye className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Ukuran File</span>
                    <span className="text-sm font-bold">{fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                {/* 4. Tambahkan onClick untuk memicu notifikasi */}
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href={FILE_PATH}
                  download={FILE_NAME}
                  onClick={handleDownloadSuccess}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 transition-all cursor-pointer"
                >
                  <HiOutlineDownload className="text-xl" />
                  Unduh Dokumen
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Preview Window */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 bg-white/70 backdrop-blur-md border border-white rounded-[2.5rem] p-4 shadow-2xl shadow-slate-200/60 overflow-hidden h-[800px] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400 shadow-inner" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-inner" />
                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-inner" />
                </div>
                <span className="ml-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  PDF Reader System
                </span>
              </div>
            </div>

            <div className="flex-grow rounded-[1.8rem] overflow-hidden border border-slate-100 shadow-inner bg-slate-800">
              <iframe 
                src={`${FILE_PATH}#view=FitH&toolbar=0`} 
                className="w-full h-full border-none"
                title="Manual Book Preview"
              />
            </div>
          </motion.div>

        </div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-slate-400 text-sm"
        >
          <p>Dokumentasi diperbarui secara berkala mengikuti update versi sistem.</p>
        </motion.div>
      </div>

      {/* 5. Render Komponen Notifikasi */}
      <SuccessNotification 
        show={showSuccess} 
        onClose={() => setShowSuccess(false)} 
        message="Manual book berhasil diunduh ke perangkat Anda."
      />
    </div>
  );
}