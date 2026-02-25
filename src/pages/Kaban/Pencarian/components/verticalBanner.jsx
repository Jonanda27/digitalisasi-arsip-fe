import { motion } from "framer-motion";
import { HiOutlineDocumentSearch } from "react-icons/hi";

const VerticalBanner = ({ user, totalDocs }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Pagi" : hour < 15 ? "Siang" : hour < 18 ? "Sore" : "Malam";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      // PERBAIKAN: md:h-[750px] dan md:rounded-[3rem] agar iPad mengikuti style laptop
      className="relative h-auto md:h-[750px] overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-[#0F172A] p-6 md:p-10 text-white shadow-2xl flex flex-col md:justify-between group w-full transition-all duration-500"
    >
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/image11.png"
          alt="Background Banner"
          // PERBAIKAN: md:opacity-100 agar gambar tajam di iPad
          className="w-full h-full object-cover opacity-60 md:opacity-100"
        />
      </div>

      {/* Overlay Gradient */}
      {/* PERBAIKAN: md:bg-gradient-to-b agar arah gradasi sama dengan laptop */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br md:bg-gradient-to-b from-[#1D4EA8]/80 via-[#112d61]/90 to-[#0F172A] mix-blend-multiply" />

      {/* Ornamen Cahaya Animasi */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-10 -right-10 w-40 h-40 md:w-80 md:h-80 bg-blue-500/30 blur-[60px] md:blur-[100px] rounded-full z-0" 
      />
      
      {/* --- KONTEN --- */}

      {/* Bagian Atas: Greeting & Deskripsi Dinamis */}
      <div className="relative z-10 flex flex-col justify-center">
        {/* PERBAIKAN: md:text-4xl dan md:leading-[1.1] */}
        <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight md:leading-[1.1]">
          Selamat <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">
            {greeting},{" "}
          </span> 
          <span className="text-white drop-shadow-md">
            {user?.nama?.split(' ')[0] || user?.username?.split(' ')[0] || 'Rekan'}! 👋
          </span>
        </h2>
        
        {/* Garis Dekoratif (Muncul di iPad & Laptop) */}
        <div className="hidden md:block h-1.5 w-12 bg-blue-500 rounded-full mt-6 mb-6" />
        
        <div className="mt-2 md:mt-0">
          {/* Sembunyi di iPad & Desktop */}
          <p className="block md:hidden text-blue-100/70 text-xs leading-relaxed font-medium max-w-[200px]">
            Efisiensi kerja dimulai dari sini.
          </p>

          {/* Muncul di iPad & Desktop */}
          <p className="hidden md:block text-blue-100/70 text-sm lg:text-base leading-relaxed font-medium max-w-xs">
            Efisiensi kerja dimulai dari sini. Temukan dokumen Anda dalam hitungan detik.
          </p>
        </div>
      </div>

      {/* Bagian Bawah: Stats Card */}
      <div className="relative z-10 mt-6 md:mt-0">
        <div className="relative overflow-hidden group/card">
          {/* Card Glassmorphism */}
          <div className="absolute inset-0 bg-white/5 md:bg-black/20 backdrop-blur-xl md:backdrop-blur-2xl border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem]" />
          
          {/* PERBAIKAN: md:flex-col dan md:text-center agar stats berada di tengah kotak seperti laptop */}
          <div className="relative p-5 md:p-10 flex md:flex-col items-center md:justify-center gap-4 md:gap-0 md:text-center">
            {/* Icon Box */}
            <div className="inline-flex p-2 md:p-3 rounded-xl md:rounded-2xl bg-blue-500/20 border border-blue-500/30">
              <HiOutlineDocumentSearch className="text-xl md:text-2xl text-blue-200" />
            </div>
            
            <div className="flex flex-col md:items-center">
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-blue-200/80 font-bold md:mb-2 md:mt-4">
                Total Dokumen
              </p>
              
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-5xl font-black text-white tracking-tighter"
              >
                {totalDocs?.toLocaleString() || '0'}
              </motion.p>
            </div>

            {/* Dekorasi Tambahan (Muncul di iPad & Desktop) */}
            <div className="hidden md:flex mt-4 items-center justify-center gap-2">
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