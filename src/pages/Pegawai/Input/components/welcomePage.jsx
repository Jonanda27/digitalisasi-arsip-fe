import React from 'react';
import { motion } from 'framer-motion';

const WelcomeBanner = () => {
  // Konfigurasi elemen melayang yang lebih sedikit & kecil
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
    <div className="relative overflow-hidden rounded-b-[1.5rem] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 md:p-8 text-white shadow-xl mb-6">
      
      {/* --- ORNAMENT BACKGROUND (Diperkecil) --- */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-[60px]" />
      <div className="absolute left-1/4 top-1/2 h-20 w-20 rounded-full bg-indigo-500/20 blur-[50px]" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        
        {/* --- LEFT SIDE: TEXT CONTENT --- */}
        <div className="max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold tracking-tight leading-tight"
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
            className="mt-2 text-blue-100/80 text-sm md:text-base leading-snug max-w-md"
          >
            Otomatisasi input data dengan <strong>OCR</strong>. Cukup unggah, biarkan sistem membaca dalam hitungan detik.
          </motion.p>
        </div>

        {/* --- RIGHT SIDE: FEATURE STATS --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="shrink-0"
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
            <p className="text-blue-300 text-[10px] font-bold uppercase mb-0.5">Akurasi</p>
            <h4 className="text-xl font-bold">99.8%</h4>
            <p className="text-[9px] text-blue-100/50">OCR Engine</p>
          </div>
        </motion.div>
      </div>

      {/* --- FLOATING ELEMENTS --- */}
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
  );
};

export default WelcomeBanner;