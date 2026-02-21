import { motion } from "framer-motion";
import { HiOutlineDocumentSearch } from "react-icons/hi";

const VerticalBanner = ({ user, totalDocs }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Pagi" : hour < 15 ? "Siang" : hour < 18 ? "Sore" : "Malam";

  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative h-[700px] overflow-hidden rounded-[3rem] bg-[#0F172A] p-10 text-white shadow-2xl flex flex-col justify-between group w-full"
    >
      
      {/* --- BACKGROUND LAYERS --- */}
      
      {/* 1. Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/image11.png" // Pastikan file ini ada di folder public
          alt="Background Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. Gradient Overlay Layer (Agar teks terbaca jelas) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1D4EA8]/80 via-[#112d61]/90 to-[#0F172A] mix-blend-multiply" />

      {/* Ornamen Cahaya Dinamis */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/30 blur-[100px] rounded-full z-0" 
      />
      
      {/* --- BAGIAN YANG DIHAPUS: Grid Pattern Overlay --- */}
      {/* Div untuk garis-garis putih sudah dihapus di sini */}

      {/* --- KONTEN --- */}

      {/* Bagian Atas: Greeting */}
      <div className="relative z-10 pt-4">
        <h2 className="text-4xl font-black tracking-tight leading-[1.1]">
          Selamat <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">
            {greeting},
          </span> <br />
          <span className="text-white drop-shadow-md">
            {user?.nama?.split(' ')[0] || user?.username?.split(' ')[0] || 'Rekan'}! 👋
          </span>
        </h2>
        
        <div className="h-1.5 w-12 bg-blue-500 rounded-full mt-8 mb-8" />
        
        <p className="text-blue-100/80 text-sm lg:text-base leading-relaxed font-medium w-full drop-shadow-sm">
          Efisiensi kerja dimulai dari sini. Temukan dokumen Anda dalam hitungan detik.
        </p>
      </div>

      {/* Bagian Bawah: Stats Card */}
      <div className="relative z-10">
        <div className="relative overflow-hidden group/card">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[2.5rem]" />
          
          <div className="relative p-10 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30 mb-4">
              <HiOutlineDocumentSearch className="text-2xl text-blue-200" />
            </div>
            
            <p className="text-[10px] uppercase tracking-[0.3em] text-blue-200/80 font-bold mb-2">
              Total Dokumen
            </p>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-5xl font-black text-white tracking-tighter"
            >
              {totalDocs?.toLocaleString() || '0'}
            </motion.p>
            
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="h-px w-4 bg-blue-500/40" />
              <p className="text-[10px] text-blue-300/60 font-medium uppercase tracking-widest">Arsip Digital</p>
              <div className="h-px w-4 bg-blue-500/40" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VerticalBanner;