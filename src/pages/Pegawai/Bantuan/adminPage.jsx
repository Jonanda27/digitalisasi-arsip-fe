import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { TopbarContext } from "../../../layouts/AppLayout";
import { API } from "../../../global/api"; // Pastikan path API benar
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineClock, 
  HiChatAlt2 
} from "react-icons/hi";

export default function AdminContactPage() {
  const { setTopbar } = useContext(TopbarContext);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTopbar({ title: "Bantuan Admin" });
    fetchAdmins();
  }, [setTopbar]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/auth/fetchAdmins`);
      // Sesuaikan dengan struktur response backend: { admins: [...] }
      setAdmins(response.data.admins);
    } catch (error) {
      console.error("Gagal memuat data admin:", error);
    } finally {
      setLoading(false);
    }
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
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <span className="bg-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase">
            Hubungi Kami
          </span>
          <h1 className="text-4xl font-extrabold text-slate-800 mt-4">Tim Administrasi</h1>
          <p className="text-slate-500 mt-3 text-lg">Punya kendala teknis atau butuh akses? Kami siap membantu.</p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          /* Admin Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {admins.length > 0 ? (
              admins.map((admin, index) => (
                <motion.div
                  key={admin._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -10 }}
                  className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full transition-all group-hover:bg-indigo-500/10" />

                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
                        {admin.nama.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{admin.nama}</h3>
                        <p className="text-indigo-600 font-medium text-sm uppercase tracking-wider">
                          {admin.nip || "Administrator"}
                        </p>
                      </div>
                    </div>
                    {/* Status Dot (Statik karena tidak ada field online di DB, bisa disesuaikan) */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                      <span className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
                      Aktif
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
                        <HiOutlineMail className="w-5 h-5 text-indigo-500" />
                      </div>
                      <span className="text-sm font-medium">{admin.email}</span>
                    </div>
                    
                    {admin.no_hp && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
                          <HiOutlinePhone className="w-5 h-5 text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium">{admin.no_hp}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
                        <HiOutlineClock className="w-5 h-5 text-indigo-500" />
                      </div>
                      <span className="text-sm font-medium">Senin - Jumat (08:00 - 17:00)</span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <motion.a
                      whileTap={{ scale: 0.95 }}
                      href={`https://wa.me/${admin.no_hp?.replace(/^0/, "62")}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex-1 ${admin.no_hp ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-300 pointer-events-none'} text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all`}
                    >
                      <HiChatAlt2 className="text-xl" />
                      WhatsApp
                    </motion.a>
                    <motion.a
                      whileTap={{ scale: 0.95 }}
                      href={`mailto:${admin.email}`}
                      className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                    >
                      <HiOutlineMail className="text-xl" />
                    </motion.a>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 text-slate-400 font-medium">
                Belum ada data admin yang terdaftar.
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-slate-400 text-sm"
        >
          <p>Butuh bantuan cepat? Tiket bantuan Anda akan diproses dalam maksimal 1x24 jam.</p>
        </motion.div>
      </div>
    </div>
  );
}