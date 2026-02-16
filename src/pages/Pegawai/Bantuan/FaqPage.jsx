import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopbarContext } from "../../../layouts/AppLayout";

const FAQ_DATA = [
  {
    question: "Bagaimana cara mengunggah dokumen baru?",
    answer: "Anda dapat pergi ke menu 'Input Dokumen', isi formulir yang tersedia seperti kategori, nomor surat, dan tanggal, lalu unggah file dalam format PDF. Klik simpan untuk mengirim dokumen ke sistem."
  },
  {
    question: "Apa yang harus dilakukan jika saya lupa kata sandi?",
    answer: "Silakan hubungi admin IT melalui menu 'Bantuan > Admin' atau langsung datang ke bagian persuratan untuk melakukan reset kata sandi akun Anda."
  },
  {
    question: "Berapa ukuran maksimal file yang bisa diunggah?",
    answer: "Sistem saat ini mendukung unggahan file dengan ukuran maksimal 10MB per dokumen untuk menjaga performa penyimpanan server."
  },
  {
    question: "Mengapa saya tidak bisa mengakses beberapa dokumen?",
    answer: "Beberapa dokumen bersifat rahasia. Jika Anda membutuhkan akses, silakan gunakan fitur 'Persetujuan Akses' untuk meminta izin kepada Kepala Badan (Kaban)."
  }
];

export default function FaqPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const { setTopbar } = useContext(TopbarContext);

  useEffect(() => {
    setTopbar({
      title: "Bantuan",
    });
  }, [setTopbar]);

  return (
    <div className="relative min-h-screen bg-[#F6F8FC] overflow-hidden p-6 md:p-10">
      
      {/* --- ANIMATED BACKGROUND ELEMENTS --- */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header dengan Animasi Slide Down */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase">
            Pusat Bantuan
          </span>
          <h1 className="text-4xl font-extrabold text-slate-800 mt-4">Pertanyaan Populer</h1>
          <p className="text-slate-500 mt-3 text-lg">Semua yang perlu Anda ketahui tentang sistem arsip digital.</p>
        </motion.div>

        {/* Accordion List dengan Stagger Animation */}
        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div 
                className={`bg-white border transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md ${
                  activeIndex === index ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200'
                }`}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className={`font-bold text-lg transition-colors duration-300 ${
                    activeIndex === index ? 'text-blue-600' : 'text-slate-700'
                  }`}>
                    {item.question}
                  </span>
                  <div className={`p-2 rounded-full transition-all duration-300 ${
                    activeIndex === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4 text-[16px]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Contact Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-center text-white shadow-xl shadow-blue-200"
        >
          <h3 className="text-xl font-bold">Tidak menemukan jawaban Anda?</h3>
          <p className="opacity-90 mt-2">Tim admin kami siap membantu kendala teknis Anda kapan saja.</p>
          <button className="mt-6 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all active:scale-95 shadow-lg">
            Hubungi Customer Service
          </button>
        </motion.div>
      </div>
    </div>
  );
}