import { motion } from "framer-motion";
import { FiFileText, FiActivity, FiFolder, FiServer } from "react-icons/fi";

const icons = {
  "Total Seluruh Arsip": <FiFileText className="text-blue-500" />,
  "Scan Dokumen": <FiActivity className="text-emerald-500" />,
  "Total Draft": <FiFolder className="text-amber-500" />,
  "Status Server": <FiServer className="text-purple-500" />,
};

export default function StatCard({ title, value, subtitle, delay = 0, isStatus }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group rounded-2xl border border-slate-100 bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[120px] md:min-h-0"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-[9px] md:text-xs font-black uppercase tracking-tight text-slate-400 leading-tight">
          {title}
        </div>
        <div className="p-1.5 md:p-2 bg-slate-50 rounded-lg shrink-0">
          {icons[title] || <FiFileText size={14} className="text-blue-500" />}
        </div>
      </div>

      <div className="mt-2 md:mt-4">
        <div className={`text-xl md:text-3xl font-black tracking-tight ${isStatus ? 'text-emerald-500' : 'text-slate-900'}`}>
          {value}
        </div>
        <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter opacity-70">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}