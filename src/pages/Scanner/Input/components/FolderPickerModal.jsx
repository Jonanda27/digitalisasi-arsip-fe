import { useEffect, useState } from "react";
import axios from "axios";

export default function FolderPickerModal({ open, onClose, onSelect }) {
  const [stack, setStack] = useState([]); // breadcrumb path
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  // modal tambah folder
  const [showAdd, setShowAdd] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creating, setCreating] = useState(false);

  const parentId = stack.length ? stack[stack.length - 1]._id : null;

  useEffect(() => {
    if (open) fetchFolders();
  }, [open, parentId]);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        parentId
          ? "http://localhost:5000/api/folders/by-parent"
          : "http://localhost:5000/api/folders/root",
        parentId ? { params: { parent: parentId } } : {},
      );
      setFolders(res.data.folders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      setCreating(true);
      await axios.post("http://localhost:5000/api/folders/createFol", {
        name: newFolderName,
        parent: parentId,
      });

      setNewFolderName("");
      setShowAdd(false);
      fetchFolders(); // refresh list
    } catch (err) {
      alert("Gagal menambahkan folder");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleBack = () => {
    setStack((s) => s.slice(0, -1));
  };

  if (!open) return null;

  return (
    <>
      {/* ================= MODAL UTAMA ================= */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="text-[16px] font-semibold">Pilih Folder</div>

            {stack.length > 0 && (
              <button
                onClick={handleBack}
                className="text-[12px] text-slate-600 hover:underline"
              >
                ← Back
              </button>
            )}
          </div>

          {/* PATH / BREADCRUMB */}
          <div className="mt-2 text-[12px] text-slate-500">
            {stack.length === 0
              ? "Root"
              : stack.map((f, i) => (
                  <span key={f._id}>
                    <button
                      onClick={() => setStack((s) => s.slice(0, i + 1))}
                      className="hover:underline"
                    >
                      {f.name}
                    </button>
                    {i < stack.length - 1 && " → "}
                  </span>
                ))}
          </div>

          {/* LIST FOLDER */}
          <div className="mt-4 max-h-[280px] overflow-auto rounded-xl border">
            {loading ? (
              <div className="p-4 text-center text-[12px]">Memuat...</div>
            ) : folders.length === 0 ? (
              <div className="p-4 text-center text-[12px] text-slate-500">
                Folder kosong
              </div>
            ) : (
              folders.map((f) => (
                <button
                  key={f._id}
                  onClick={() => setStack((s) => [...s, f])}
                  className="flex w-full items-center justify-between border-b px-4 py-3 text-[12px] hover:bg-slate-50"
                >
                  <span>📁 {f.name}</span>
                  <span>›</span>
                </button>
              ))
            )}
          </div>

          {/* ACTION */}
          <div className="mt-5 flex justify-between">
            <button
              onClick={() => setShowAdd(true)}
              className="text-[12px] text-slate-600 hover:underline"
            >
              + Tambah Folder
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="h-[36px] rounded-lg border px-4 text-[12px]"
              >
                Batal
              </button>
              <button
                disabled={stack.length === 0}
                onClick={() => {
                  onSelect({
                    folderId: stack[stack.length - 1]._id,
                    path: stack,
                  });
                  onClose(); // ⬅️ TUTUP MODAL
                }}
                className="h-[36px] rounded-lg bg-slate-900 px-4 text-[12px] text-white disabled:opacity-50"
              >
                Pilih
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL TAMBAH FOLDER ================= */}
      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-5">
            <div className="text-[14px] font-semibold">Tambah Folder</div>

            <div className="mt-1 text-[11px] text-slate-500">
              Lokasi:{" "}
              {stack.length ? stack.map((s) => s.name).join(" → ") : "Root"}
            </div>

            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nama folder"
              className="mt-4 h-[36px] w-full rounded-lg border px-3 text-[12px]"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowAdd(false)}
                className="h-[34px] rounded-lg border px-4 text-[12px]"
              >
                Batal
              </button>
              <button
                disabled={creating}
                onClick={handleCreateFolder}
                className="h-[34px] rounded-lg bg-emerald-600 px-4 text-[12px] text-white disabled:opacity-50"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
