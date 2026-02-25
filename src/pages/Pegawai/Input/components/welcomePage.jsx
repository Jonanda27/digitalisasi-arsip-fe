import React from 'react';
import { motion } from 'framer-motion';

const WelcomeBanner = () => {
  // Floating elements hanya akan dirender jika layar bukan mobile (hidden di mobile secara CSS)
  const floatingElements = [
    { icon: "📑", size: "text-4xl", pos: "bottom-10 right-1/4", duration: 4, delay: 0 },
    { icon: "🔍", size: "text-3xl", pos: "top-10 right-1/2", duration: 5, delay: 1 },
    { icon: "💾", size: "text-2xl", pos: "top-20 right-1/4", duration: 6, delay: 2 },
    { icon: "📂", size: "text-4xl", pos: "bottom-20 left-1/4", duration: 4.5, delay: 1.5 },
    { icon: "✨", size: "text-xl", pos: "top-1/2 right-10", duration: 3.5, delay: 0.5 },
    { icon: "📄", size: "text-2xl", pos: "bottom-1/3 right-1/3", duration: 5.5, delay: 2.5 },
    { icon: "⚡", size: "text-lg", pos: "top-1/4 left-1/2", duration: 4, delay: 3 },
    { icon: "📁", size: "text-3xl", pos: "top-1/3 left-10", duration: 5, delay: 4 },
  ];

  return (
    // Radius diperkecil di mobile (rounded-b-xl) dan padding lebih rapat (p-5)
    <div className="relative overflow-hidden rounded-b-xl md:rounded-b-[1.5rem] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-5 md:p-8 text-white shadow-xl mb-6">
      
      {/* --- ORNAMENT BACKGROUND --- */}
      <div className="absolute -right-10 -top-10 h-32 w-32 md:h-40 md:w-40 rounded-full bg-blue-500/20 blur-[50px] md:blur-[60px]" />
      
      <div className="relative z-10 flex flex-row items-center justify-between gap-4">
        
        {/* --- LEFT SIDE: TEXT CONTENT --- */}
        <div className="max-w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-3xl font-bold tracking-tight leading-tight"
          >
            Manajemen Dokumen <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Jadi Lebih Cerdas.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-1 md:mt-2 text-blue-100/80 text-[11px] md:text-base leading-snug max-w-[280px] md:max-w-md"
          >
            Otomatisasi input data dengan <strong>OCR</strong>. Cukup unggah, biarkan sistem membaca.
          </motion.p>
        </div>

        {/* --- RIGHT SIDE: FEATURE STATS (Hanya tampil di tablet ke atas) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden sm:block shrink-0"
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
            <p className="text-blue-300 text-[10px] font-bold uppercase mb-0.5">Akurasi</p>
            <h4 className="text-xl font-bold">99.8%</h4>
            <p className="text-[9px] text-blue-100/50">OCR Engine</p>
          </div>
        </motion.div>
      </div>

      {/* --- FLOATING ELEMENTS (Dihapus di Mobile untuk performa) --- */}
      <div className="hidden md:block">
        {floatingElements.map((el, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.1, 0], 
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0]
            }} 
            transition={{ 
              duration: el.duration, 
              repeat: Infinity, 
              delay: el.delay,
              ease: "easeInOut"
            }}
            className={`absolute ${el.pos} ${el.size} pointer-events-none select-none filter blur-[0.2px]`}
          >
            {el.icon}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeBanner;