import { FolderPlus, Upload } from "lucide-react";

export default function ArsipActions() {
  return (
    <div className="flex gap-4">
      <button className="flex items-center gap-2 bg-[#1D4ED8] text-white px-4 py-2 rounded-md hover:bg-blue-700">
        <FolderPlus size={18} />
        Buat Folder Baru
      </button>

      <button className="flex items-center gap-2 bg-[#F59E0B] text-white px-4 py-2 rounded-md hover:bg-orange-600">
        <Upload size={18} />
        Upload File
      </button>
    </div>
  );
}
