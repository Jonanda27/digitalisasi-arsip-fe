import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../../auth/auth";
import { API } from "../../../../global/api";


// Komponen Ikon Sederhana (Inline SVG)
const Icons = {
  Folder: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-yellow-500 fill-yellow-100"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  Plus: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  ),
  Close: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  Home: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
};

export default function FolderPickerModal({
  open,
  onClose,
  onSelect,
  userBidangId,
}) {
  const [stack, setStack] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creating, setCreating] = useState(false);

  // 2. Helper untuk mendapatkan konfigurasi Header Authorization
  const getAuthConfig = () => {
    const token = getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const parentId = stack.length ? stack[stack.length - 1]._id : null;

  useEffect(() => {
    if (open) fetchFolders();
  }, [open, parentId, userBidangId]);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      let res;

      // 3. Tambahkan getAuthConfig() pada setiap request GET
      if (parentId) {
        res = await axios.get(`${API}/folders/by-parent`, {
          params: { parent: parentId },
          ...getAuthConfig(),
        });
      } else if (userBidangId) {
        res = await axios.get(
          `${API}/folders/user-root/${userBidangId}`,
          getAuthConfig(),
        );
      } else {
        res = await axios.get(`${API}/folders/root`, getAuthConfig());
      }

      setFolders(res.data.folders || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 401) {
        alert("Sesi telah habis, silakan login kembali.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      setCreating(true);
      // 4. Tambahkan getAuthConfig() pada request POST
      await axios.post(
        `${API}/folders/createFol`,
        {
          name: newFolderName,
          parent: parentId || userBidangId,
        },
        getAuthConfig(),
      );

      setNewFolderName("");
      setShowAdd(false);
      fetchFolders();
    } catch (err) {
      alert("Gagal menambahkan folder. Pastikan Anda memiliki akses.");
    } finally {
      setCreating(false);
    }
  };

  if (!open) return null;

  const handleBack = () => {
    setStack((s) => s.slice(0, -1));
  };

  if (!open) return null;

  return (
    <>
      {/* ================= MODAL UTAMA ================= */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-300">
        <div className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Pilih Folder Tujuan
              </h2>
              <p className="text-xs text-slate-500">
                Navigasi ke folder yang diinginkan
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <Icons.Close />
            </button>
          </div>

          {/* BREADCRUMB / NAVIGASI */}
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-600 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <button
                onClick={() => setStack([])}
                className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${stack.length === 0 ? "font-semibold text-blue-600" : ""}`}
              >
                <Icons.Home />
                <span>Root</span>
              </button>

              {stack.map((f, i) => (
                <div key={f._id} className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs">/</span>
                  <button
                    onClick={() => setStack((s) => s.slice(0, i + 1))}
                    className={`hover:text-blue-600 transition-colors ${
                      i === stack.length - 1
                        ? "font-semibold text-blue-600"
                        : ""
                    }`}
                  >
                    {f.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* LIST FOLDER */}
          <div className="h-[320px] overflow-y-auto bg-white p-2">
            {/* Tombol Back jika bukan di Root */}
            {stack.length > 0 && (
              <button
                onClick={handleBack}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-lg text-sm mb-1 transition-colors"
              >
                <div className="w-8 flex justify-center">
                  <Icons.ArrowLeft />
                </div>
                <span className="font-medium">Kembali</span>
              </button>
            )}

            {loading ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"></div>
                <span className="text-xs">Memuat folder...</span>
              </div>
            ) : folders.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
                <div className="rounded-full bg-slate-50 p-4">
                  <Icons.Folder />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600">
                    Folder Kosong
                  </p>
                  <p className="text-xs">
                    Tidak ada folder di dalam direktori ini.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {folders.map((f) => (
                  <button
                    key={f._id}
                    onClick={() => setStack((s) => [...s, f])}
                    className="group flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-all hover:bg-blue-50 hover:pl-5"
                  >
                    <div className="flex items-center gap-3">
                      <Icons.Folder />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                        {f.name}
                      </span>
                    </div>
                    <div className="text-slate-300 group-hover:text-blue-400">
                      <Icons.ChevronRight />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FOOTER ACTION */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              <Icons.Plus /> Buat Folder Baru
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onSelect({
                    folderId: stack.length ? stack[stack.length - 1]._id : null,
                    path: stack,
                  });
                  onClose();
                }}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all"
              >
                Pilih Folder Ini
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL TAMBAH FOLDER ================= */}
      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-slate-800">
              Buat Folder Baru
            </h3>

            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <Icons.Folder />
              <span>
                Lokasi:{" "}
                <span className="font-medium text-slate-700">
                  {stack.length ? stack[stack.length - 1].name : "Root"}
                </span>
              </span>
            </p>

            <div className="mt-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Folder
              </label>
              <input
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Contoh: Dokumen Keuangan"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                }}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                disabled={creating || !newFolderName.trim()}
                onClick={handleCreateFolder}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {creating ? "Membuat..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
