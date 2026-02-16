import React from 'react';
import { motion } from 'framer-motion';

const WelcomeBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-10 text-white shadow-2xl shadow-blue-200/50 mb-10">
      
      {/* --- ORNAMENT BACKGROUND --- */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]" />
      <div className="absolute left-1/3 top-1/2 h-40 w-40 rounded-full bg-indigo-500/20 blur-[80px]" />
      
      {/* Pola Garis Abstrak (Grid) */}
      <div className="absolute inset-0 opacity-10 [mask-image:linear-gradient(to_bottom,white,transparent)]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        
        {/* --- LEFT SIDE: TEXT CONTENT --- */}
        <div className="max-w-xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
            Digitalisasi Arsip genX 3.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight leading-tight"
          >
            Manajemen Dokumen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Jadi Lebih Cerdas.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-blue-100/80 text-lg leading-relaxed max-w-lg"
          >
            Otomatisasi penginputan data dengan teknologi <strong>OCR</strong>. Cukup unggah, biarkan sistem membaca, dan simpan dalam hitungan detik.
          </motion.p>
        </div>

        {/* --- RIGHT SIDE: FEATURE STATS --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-auto"
        >
          {/* Hanya menampilkan Akurasi */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors ">
            <p className="text-blue-300 text-sm font-bold uppercase mb-1">Akurasi</p>
            <h4 className="text-3xl font-black">99.8%</h4>
            <p className="text-[10px] text-blue-100/50 mt-1">Deteksi OCR Otomatis</p>
          </div>
        </motion.div>

      </div>

      {/* Elemen melayang */}
      <motion.div 
        animate={{ y: [0, -15, 0] }} 
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-10 right-1/4 text-4xl opacity-20 pointer-events-none"
      >
        📑
      </motion.div>
      <motion.div 
        animate={{ y: [0, 15, 0] }} 
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute top-10 right-1/2 text-3xl opacity-10 pointer-events-none"
      >
        🔍
      </motion.div>
    </div>
  );
};

export default WelcomeBanner;