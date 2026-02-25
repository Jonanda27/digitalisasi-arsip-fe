import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../././global/api";
import { saveAuth } from "../auth/auth";

import { User, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

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

  // Varian animasi yang diperhalus
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", damping: 20, stiffness: 100 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative font-sans antialiased overflow-hidden bg-slate-950">
      
      {/* 1. Background Image dengan Ken Burns Effect */}
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-[-2]"
      >
        <motion.div 
           animate={{ scale: [1, 1.1, 1] }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="w-full h-full bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: `url(${bgImage})` }}
        />
      </motion.div>

      {/* 2. Dinamis Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-blue-900/40 z-[-1]" />

      {/* 3. Animasi Partikel Dekoratif (Floating Orbs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -100, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ y: [0, 100, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"
        />
      </div>

      {/* 4. Main Login Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[440px] px-6 py-10 md:px-0"
      >
        <motion.div 
          variants={cardVariants}
          className="backdrop-blur-2xl bg-white/[0.07] rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden"
        >
          {/* Efek kilauan garis pada kartu */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

          {/* Logo Section */}
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-10">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="bg-white/10 p-4 rounded-3xl mb-6 backdrop-blur-md border border-white/20 shadow-2xl"
            >
              <img src={logo} alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight text-center">
              Akses Sistem
            </h1>
            <p className="text-blue-100/50 text-xs md:text-sm mt-2 text-center font-medium max-w-[240px]">
              Masuk untuk mengelola arsip digital secara aman
            </p>
          </motion.div>

          {/* Form Section */}
          <form onSubmit={onSubmit} className="space-y-4 md:space-y-5">
            
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-2xl border border-white/5 bg-white/5 px-12 py-4 text-sm text-white placeholder:text-white/20 outline-none transition-all
                           focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-white/5 bg-white/5 px-12 py-4 text-sm text-white placeholder:text-white/20 outline-none transition-all
                           focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>

            <AnimatePresence>
              {err && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center backdrop-blur-md"
                >
                  {err}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: "#2563eb" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-blue-700 py-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Otorisasi Masuk</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">
              <ShieldCheck size={12} />
              Secure Authentication
            </div>
            <p className="text-[10px] text-white/20 font-medium">
              &copy; 2026 Digitalisasi Arsip Sistem
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}