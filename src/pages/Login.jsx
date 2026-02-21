import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../././global/api";
import { saveAuth } from "../auth/auth";

import { User, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

import logo from "../assets/logo-arsip-2.png";
import bgImage from "../assets/image.png"; 

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Kredensial tidak valid.");
      saveAuth(data);
      const role = data?.user?.role;
      const routes = { admin: "/admin/dashboard", kaban: "/kaban/dashboard", pegawai: "/pegawai/search", scanner: "/scanner/dashboard" };
      navigate(routes[role] || "/login", { replace: true });
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Varian animasi untuk kemunculan kartu
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative font-sans antialiased overflow-hidden">
      
      {/* Background Image dengan Animasi Zoom Pelan */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-[-2]"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Overlay Biru Gelap yang lebih dramatis */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-blue-900/40 to-slate-950/80 z-[-1]" />

      {/* Login Card */}
      <motion.div 
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[420px] mx-4 p-8 sm:p-10 backdrop-blur-xl bg-white/10 rounded-[32px] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20"
      >
        
        {/* Logo & Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-10">
          <div className="bg-white/10 p-4 rounded-2xl mb-6 backdrop-blur-sm border border-white/10 shadow-xl">
             <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
            Selamat Datang
          </h1>
          <p className="text-blue-100/70 text-sm mt-2 text-center font-light tracking-wide">
            Silakan masuk untuk mengakses dokumen Anda
          </p>
        </motion.div>

        {/* Form Section */}
        <form onSubmit={onSubmit} className="space-y-5">
          
          {/* Input Username */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-blue-400 transition-colors">
              <User size={20} />
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-12 py-4 text-white placeholder:text-white/40 outline-none transition-all
                         focus:border-blue-400/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 shadow-inner"
            />
          </motion.div>

          {/* Input Password */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-blue-400 transition-colors">
              <Lock size={20} />
            </div>
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-12 py-4 text-white placeholder:text-white/40 outline-none transition-all
                         focus:border-blue-400/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {err && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-[13px] font-medium text-center backdrop-blur-md"
              >
                {err}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-blue-600 hover:bg-blue-500 py-4 text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-70 mt-4"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Masuk ke Sistem</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer info (Opsional) */}
        <motion.p 
          variants={itemVariants}
          className="mt-8 text-center text-xs text-white/30 font-light"
        >
          &copy; 2026 Digitalisasi Arsip. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}