import { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { TopbarContext } from "../../../layouts/AppLayout";

import SegmentedType from "./components/SegmentedType";
import EmptyState from "./components/EmptyState";
import UploadModal from "./components/UploadModal";
import RightPanel from "./components/RightPanel";
import FolderPickerModal from "./components/FolderPickerModal";
import LoadingOverlay from "./components/LoadingOverlay";
import SuccessModal from "./components/SuccessModal";

// icons
import iconScanner from "./icons/scanner.svg";
import iconTips from "./icons/tips.svg";
import iconFile from "./icons/file.svg";

// =====================
// INITIAL FORM STATE
// =====================
const initialFormState = {
  namaFile: "",
  tahun: new Date().getFullYear().toString(),
  noUrut: "",
  bidang: "",
  unitKerja: "BAPENDA",
  kantorBidang: "",
  noRak: "",
  lokasi: "",
  kategori: "",
  namaInstansi: "",
  nomorSurat: "",
  perihal: "",
  kerahasiaan: "",
  tipeDokumen: "",
  noDokumenPreview: "",
  noArsip: "",
  noArsipPreview: "",
};

export default function InputDokumenScanner() {
  // =====================
  // TOPBAR
  // =====================
  const setTopbar = useContext(TopbarContext)?.setTopbar;

  useEffect(() => {
    setTopbar?.({
      title: "Input Dokumen",
      showSearch: false,
      onSearch: null,
    });
  }, [setTopbar]);

  // =====================
  // STATE
  // =====================
  const [docType, setDocType] = useState("single");
  const [openUpload, setOpenUpload] = useState(false);
  const [pickedFile, setPickedFile] = useState(null);

  const [openFolderPicker, setOpenFolderPicker] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [selectedFolderPath, setSelectedFolderPath] = useState([]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [previewUrls, setPreviewUrls] = useState([]);
  const [form, setForm] = useState(initialFormState);

  const lastBidangRef = useRef(null);

  // =====================
  // ICONS
  // =====================
  const icons = useMemo(
    () => ({
      scanner: iconScanner,
      tips: iconTips,
      file: iconFile,
    }),
    [],
  );

  // =====================
  // PICK FILE
  // =====================
  const onPicked = (files) => {
    const pickedArr = Array.isArray(files) ? files : [files];

    if (docType === "single") {
      const file = pickedArr[0];
      setPickedFile(file);
      setForm((s) => ({
        ...s,
        namaFile: s.namaFile || file.name.replace(/\.[^/.]+$/, ""),
      }));
    } else {
      setPickedFile((prev) => [
        ...(Array.isArray(prev) ? prev : prev ? [prev] : []),
        ...pickedArr,
      ]);
    }

    setOpenUpload(false);
  };

  // =====================
  // PREVIEW
  // =====================
  useEffect(() => {
    if (!pickedFile) {
      setPreviewUrls([]);
      return;
    }

    const files = Array.isArray(pickedFile) ? pickedFile : [pickedFile];

    const urls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviewUrls(urls);

    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u.url));
    };
  }, [pickedFile]);

  const renderPreview = () => {
    if (!previewUrls.length) return null;

    return previewUrls.map(({ file, url }, idx) => {
      if (file.type === "application/pdf") {
        return (
          <iframe
            key={idx}
            src={url}
            title={file.name}
            className="mt-4 h-[360px] w-full rounded-xl border"
          />
        );
      }

      if (file.type.startsWith("image/")) {
        return (
          <img
            key={idx}
            src={url}
            className="mt-4 max-h-[360px] w-full rounded-xl border object-contain"
          />
        );
      }

      return (
        <div key={idx} className="mt-4 text-sm text-slate-500">
          Preview tidak tersedia
        </div>
      );
    });
  };

  const hasPickedFile =
    docType === "single"
      ? !!pickedFile
      : Array.isArray(pickedFile) && pickedFile.length > 0;

  // =====================
  // NOMOR URUT
  // =====================
  useEffect(() => {
    if (!form.bidang || !form.tahun) return;
    if (lastBidangRef.current === `${form.bidang}-${form.tahun}`) return;

    lastBidangRef.current = `${form.bidang}-${form.tahun}`;

    const fetchNomorUrut = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/arsip/next-number",
          {
            params: {
              bidang: form.bidang,
              tahun: form.tahun,
            },
          },
        );

        setForm((s) => ({ ...s, noUrut: res.data.noUrut }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchNomorUrut();
  }, [form.bidang, form.tahun]);

  const handleScanOCR = async () => {
    if (!pickedFile) return alert("Pilih file dulu");

    const file = Array.isArray(pickedFile) ? pickedFile[0] : pickedFile;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const res = await axios.post(
        "http://localhost:5000/api/scan-ocr",
        formData,
      );

      const text = res.data.text;

      console.log("OCR RESULT:", text);

      // 👉 parsing hasil OCR
      const parsed = parseOCRText(text);

      // 👉 isi otomatis form
      setForm((s) => ({
        ...s,
        ...parsed,
      }));
    } catch (err) {
      console.error(err);
      alert("OCR gagal");
    } finally {
      setUploading(false);
    }
  };

  function parseOCRText(text) {
  console.log("PARSING OCR...");

  const data = {};

  // =====================
  // NORMALISASI
  // =====================
  const cleanText = text.replace(/\r/g, "");

  // =====================
  // NOMOR SURAT
  // =====================
  const nomorMatch = cleanText.match(/Nomor\s*:\s*(.+)/i);
  if (nomorMatch) data.nomorSurat = nomorMatch[1].trim();

  // =====================
  // PERIHAL
  // =====================
  const perihalMatch = cleanText.match(/Perihal\s*:\s*(.+)/i);
  if (perihalMatch) data.perihal = perihalMatch[1].trim();

  // =====================
  // INSTANSI
  // =====================
  const instansiMatch =
    cleanText.match(/PENGADILAN TINGGI[^\n]+/i) ||
    cleanText.match(/[A-Z\s]+PENGADILAN[^\n]+/);

  if (instansiMatch) {
    data.namaInstansi = instansiMatch[0].trim();
    data.kantorBidang = instansiMatch[0].trim(); // ← KANTOR BIDANG
  }

  // =====================
  // ALAMAT → LOKASI
  // =====================
  const alamatMatch =
    cleanText.match(/JL\.[^\n]+/i) ||
    cleanText.match(/JALAN[^\n]+/i);

  if (alamatMatch) {
    data.lokasi = alamatMatch[0].trim();
  }

  // Kota / Provinsi tambahan
  const kotaMatch = cleanText.match(/KOTA\s+[A-Z]+/i);
  if (kotaMatch) {
    data.lokasi = data.lokasi
      ? `${data.lokasi}, ${kotaMatch[0]}`
      : kotaMatch[0];
  }

  // =====================
  // NOMOR RAK
  // =====================
  const rakMatch = cleanText.match(/RAK\s*(\d+)/i);
  if (rakMatch) {
    data.noRak = rakMatch[1];
  } else {
    data.noRak = ""; // default kosong
  }

  // =====================
  // TAHUN
  // =====================
  const tahunMatch = cleanText.match(/20\d{2}/);
  if (tahunMatch) data.tahun = tahunMatch[0];

  return data;
}



  // =====================
  // UPLOAD
  // =====================
  const handleUpload = async () => {
    if (!pickedFile) return alert("Pilih file terlebih dahulu");
    if (!selectedFolderId) return alert("Pilih folder tujuan");

    try {
      setUploading(true);

      const formData = new FormData();

      if (Array.isArray(pickedFile)) {
        pickedFile.forEach((f) => formData.append("files", f));
      } else {
        formData.append("files", pickedFile);
      }

      formData.append("folder", selectedFolderId);
      Object.entries(form).forEach(([k, v]) => formData.append(k, v || ""));

      await axios.post("http://localhost:5000/api/files/createFile", formData);

      // =====================
      // RESET SETELAH SUKSES
      // =====================
      setShowSuccess(true);
      setPickedFile(null);
      setSelectedFolderId("");
      setSelectedFolderPath([]);
      setForm(initialFormState);
    } catch (err) {
      console.error(err);
      alert("Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  // =====================
  // RENDER
  // =====================
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        <main>
          <div className="max-w-[520px]">
            <div className="mt-0 space-y-1 text-[12px] text-slate-400">
              {" "}
              <div>
                {" "}
                *Pilih Bidang (Wajib) dan Sub Bidang (Opsional) sebelum
                melakukan scan dokumen dan upload file.{" "}
              </div>{" "}
              <div>
                {" "}
                *Pilih jenis dokumen yang akan discan atau di upload apakah
                single dokumen atau bundle.{" "}
              </div>{" "}
            </div>{" "}
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2"></div>
            <button
              onClick={() => setOpenFolderPicker(true)}
              className="mt-5 h-[40px] w-full rounded-xl border px-4 text-[12px]"
            >
              📁 Pilih Folder
            </button>
            {selectedFolderPath.length > 0 && (
              <div className="mt-2 text-[12px] text-slate-600">
                {selectedFolderPath.map((f) => f.name).join(" → ")}
              </div>
            )}
            <SegmentedType
              value={docType}
              onChange={(val) => {
                setDocType(val);
                setPickedFile(null);
              }}
            />
            <div className="mt-8">
              {!hasPickedFile ? (
                <EmptyState
                  icon={icons.scanner}
                  onScan={() => alert("Scan demo")}
                  onPickFile={() => setOpenUpload(true)}
                />
              ) : (
                <div className="rounded-2xl border bg-white p-6">
                  <div className="text-sm font-semibold">Dokumen Terpilih</div>
                  <div className="mt-4 text-[12px] text-slate-600">
                    {previewUrls.map(({ file }, idx) => (
                      <div key={idx} className="flex justify-between ">
                        <span>{file.name}</span>
                        <span>{(file.size / 1024).toFixed(2)} KB</span>
                      </div>
                    ))}
                  </div>

                  {renderPreview()}

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => setOpenUpload(true)}
                      className="h-[40px] rounded-xl border px-5 text-[13px]"
                    >
                      {docType === "single" ? "Ganti File" : "Tambah File"}
                    </button>

                    <button
                      onClick={() =>
                        setPickedFile(docType === "single" ? null : [])
                      }
                      className="h-[40px] rounded-xl border px-5 text-[13px]"
                    >
                      Batalkan
                    </button>

                    <button
                      onClick={handleScanOCR}
                      className="h-[40px] rounded-xl border px-5 bg-emerald-500 text-white text-[13px]"
                    >
                      Scan OCR
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <RightPanel
          icons={icons}
          form={form}
          setForm={setForm}
          onUpload={handleUpload}
        />
      </div>

      <UploadModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onPicked={onPicked}
        docType={docType}
      />

      <FolderPickerModal
        open={openFolderPicker}
        onClose={() => setOpenFolderPicker(false)}
        onSelect={({ folderId, path }) => {
          setSelectedFolderId(folderId);
          setSelectedFolderPath(path);
          setForm((s) => ({
            ...s,
            bidang: path[0]?.kode || path[0]?.name || "",
          }));
          setOpenFolderPicker(false);
        }}
      />

      <LoadingOverlay show={uploading} />
      <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
