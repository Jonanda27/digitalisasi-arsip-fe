import { FiMoreVertical, FiFileText } from "react-icons/fi";
import { API } from "../../../../global/api";

export default function FileCard({ file, onPreview }) {
  const getFileIcon = (mimeType) => {
    if (mimeType?.includes("pdf")) return <span className="bg-rose-500 px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] text-white font-black">PDF</span>;
    return <FiFileText className="text-blue-500" />;
  };

  return (
    <div className="group relative bg-white sm:bg-slate-50 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-100/50 border border-slate-100 sm:border-transparent cursor-pointer">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 scale-90 sm:scale-100">{getFileIcon(file.mimeType)}</div>
          <h4 className="text-[11px] sm:text-sm font-bold text-slate-700 truncate uppercase tracking-tight">
            {file.originalName}
          </h4>
        </div>
        <button className="text-slate-300 p-1"><FiMoreVertical size={14} /></button>
      </div>

      <div onClick={() => onPreview(file)} className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-[1.5rem] bg-white border border-slate-100">
        <iframe
          src={`${API}/files/${file._id}/preview#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full pointer-events-none scale-100 sm:scale-110 origin-top"
          title={file.originalName}
          loading="lazy"
        />
        <div className="absolute inset-0 z-10 bg-transparent" />
      </div>
    </div>
  );
}