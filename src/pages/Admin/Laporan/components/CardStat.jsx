import { FiFileText, FiActivity, FiFolder, FiServer } from "react-icons/fi";

const icons = {
  "Total Seluruh Arsip": <FiFileText className="text-blue-500" />,
  "Scan Dokumen Bulan Ini": <FiActivity className="text-emerald-500" />,
  "Total Draft Tersimpan": <FiFolder className="text-amber-500" />,
  "Status Server": <FiServer className="text-purple-500" />,
};

export default function StatCard({ title, value }) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-500">{title}</div>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
          {icons[title] || <FiFileText />}
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {typeof value === 'number' && <span className="text-xs text-slate-400">Unit</span>}
      </div>
    </div>
  );
}