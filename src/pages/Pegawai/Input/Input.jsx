import { useContext, useEffect, useMemo, useState } from "react";
import { TopbarContext } from "../../../layouts/AppLayout";

import SegmentedType from "./components/SegmentedType";
import EmptyState from "./components/EmptyState";
import UploadModal from "./components/UploadModal";
import RightPanel from "./components/RightPanel";

// icons (sesuai folder lu)
import iconScanner from "./icons/scanner.svg";
import iconTips from "./icons/tips.svg";
import iconFile from "./icons/file.svg";

// ✅ chevron custom
import chevronDown from "./icons/chevron-down.svg";
import chevronUp from "./icons/chevron-up.svg";

export default function PegawaiInput() {
  const topbarCtx = useContext(TopbarContext);

  useEffect(() => {
    if (!topbarCtx?.setTopbar) return;
    topbarCtx.setTopbar((p) => ({
      ...p,
      title: "Input Dokumen",
      showSearch: false,
      onSearch: null,
    }));
  }, [topbarCtx]);

  const [docType, setDocType] = useState("single");
  const [openUpload, setOpenUpload] = useState(false);
  const [pickedFile, setPickedFile] = useState(null);

  // ✅ open state untuk icon chevron select
  const [bidangOpen, setBidangOpen] = useState(false);
  const [subBidangOpen, setSubBidangOpen] = useState(false);

  const [form, setForm] = useState({
    namaFile: "",
    bidang: "001",
    noUrut: "045",
    unitKerja: "BAPENDA",
    tahun: "2024",
    kantorBidang: "",
    noRak: "",
    lokasi: "",
    noDokumenPreview: "973 / 045 / BAPENDA / 2024",
  });

  const icons = useMemo(
    () => ({
      scanner: iconScanner,
      tips: iconTips,
      file: iconFile,
    }),
    []
  );

  const onPickLocal = () => setOpenUpload(true);

  const onPicked = (file) => {
    setPickedFile(file);
    setOpenUpload(false);

    setForm((s) => ({
      ...s,
      namaFile: s.namaFile || file.name.replace(/\.[^/.]+$/, ""),
    }));
  };

  return (
    <div className="w-full">
      {/* Grid: kiri + kanan */}
      <div className="mt-0 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        {/* LEFT */}
        <main className="min-w-0">
          {/* Top section kiri atas (sesuai desain) */}
          <div className="w-full max-w-[520px]">
            {/* NOTE: judul dari topbar */}

            <div className="mt-0 space-y-1 text-[12px] leading-5 text-slate-400">
              <div>
                *Pilih Bidang (Wajib) dan Sub Bidang (Opsional) sebelum
                melakukan scan dokumen dan upload file.
              </div>
              <div>
                *Pilih jenis dokumen yang akan discan atau di upload apakah
                single dokumen atau bundle.
              </div>
            </div>

            {/* Filters: kanan–kiri (lebih compact seperti desain kanan) */}
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* ✅ Select: Bidang (custom chevron) */}
              <div className="relative">
                <select
                  onMouseDown={(e) => {
                    // kalau select sedang fokus dan diklik lagi,
                    // kita paksa blur supaya icon balik down
                    if (document.activeElement === e.currentTarget) {
                      e.currentTarget.blur();
                      setBidangOpen(false);
                    } else {
                      setBidangOpen(true);
                    }
                  }}
                  onBlur={() => setBidangOpen(false)}
                  onChange={() => setBidangOpen(false)}
                  className="
                    h-[40px] w-full appearance-none rounded-xl
                    border border-slate-200 bg-white
                    px-4 pr-10 text-[12px] text-slate-700
                    outline-none transition
                    focus:border-[#1F5EFF]
                    focus:ring-4 focus:ring-blue-100
                  "
                >
                  <option>Pilih Bidang</option>
                  <option>Bidang PBB</option>
                  <option>Bidang Retribusi</option>
                </select>

                <img
                  src={bidangOpen ? chevronUp : chevronDown}
                  alt=""
                  draggable="false"
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                />
              </div>

              {/* ✅ Select: Sub Bidang (custom chevron) */}
              <div className="relative">
                <select
                  onMouseDown={(e) => {
                    if (document.activeElement === e.currentTarget) {
                      e.currentTarget.blur();
                      setSubBidangOpen(false);
                    } else {
                      setSubBidangOpen(true);
                    }
                  }}
                  onBlur={() => setSubBidangOpen(false)}
                  onChange={() => setSubBidangOpen(false)}
                  className="
                    h-[40px] w-full appearance-none rounded-xl
                    border border-slate-200 bg-white
                    px-4 pr-10 text-[12px] text-slate-700
                    outline-none transition
                    focus:border-[#1F5EFF]
                    focus:ring-4 focus:ring-blue-100
                  "
                >
                  <option>Pilih Sub Bidang</option>
                  <option>Sub Bidang A</option>
                  <option>Sub Bidang B</option>
                </select>

                <img
                  src={subBidangOpen ? chevronUp : chevronDown}
                  alt=""
                  draggable="false"
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                />
              </div>
            </div>

            {/* Segmented (diperkecil) */}
            <div className="mt-3">
              <SegmentedType value={docType} onChange={setDocType} size="sm" />
            </div>
          </div>

          {/* Empty / Selected */}
          <div className="mt-12">
            {!pickedFile ? (
              <EmptyState
                icon={icons.scanner}
                onScan={() => alert("Mulai Scanning (demo)")}
                onPickFile={onPickLocal}
              />
            ) : (
              <div className="max-w-[720px] rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-[14px] font-semibold text-slate-900">
                  Dokumen Terpilih
                </div>
                <div className="mt-2 text-[12px] text-slate-500">
                  {pickedFile.name} •{" "}
                  {(pickedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenUpload(true)}
                    className="h-[40px] rounded-xl border border-slate-200 px-5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Ganti File
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Upload ke server (demo)")}
                    className="h-[40px] rounded-xl bg-[#16A34A] px-5 text-[13px] font-semibold text-white hover:brightness-95 transition"
                  >
                    Upload Dokumen
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT */}
        <RightPanel icons={icons} form={form} setForm={setForm} />
      </div>

      {/* Modal Upload */}
      <UploadModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onPicked={onPicked}
      />
    </div>
  );
}
