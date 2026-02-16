import { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { TopbarContext } from "../../../layouts/AppLayout";
import { jsPDF } from "jspdf";
import { API } from "../../../global/api";

import SegmentedType from "./components/SegmentedType";
import EmptyState from "./components/EmptyState";
import UploadModal from "./components/UploadModal";
import RightPanel from "./components/RightPanel";
import FolderPickerModal from "./components/FolderPickerModal";
import LoadingOverlay from "./components/LoadingOverlay";
import SuccessModal from "./components/SuccessModal";
import DraftModal from "./components/draftModal";
import Welcomebanner from "./components/welcomePage";
import SuccessNotification from "./components/SuccessNotification"; // Sesuaikan path import

// icons
import iconScanner from "./icons/scanner.svg";
import iconTips from "./icons/tips.svg";
import iconFile from "./icons/file.svg";
import { getToken } from "../../../auth/auth";

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

export default function PegawaiInput() {
  const setTopbar = useContext(TopbarContext)?.setTopbar;

  useEffect(() => {
    setTopbar?.({
      title: "Input Dokumen",
      showSearch: false,
      onSearch: null,
    });
  }, [setTopbar]);

  const [docType, setDocType] = useState("single");
  const [openUpload, setOpenUpload] = useState(false);
  const [pickedFile, setPickedFile] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [openFolderPicker, setOpenFolderPicker] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [selectedFolderPath, setSelectedFolderPath] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const lastBidangRef = useRef(null);
  const [availableScanners, setAvailableScanners] = useState([]);
  const [showScannerList, setShowScannerList] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeScanner, setActiveScanner] = useState(null);
  const [openDraftModal, setOpenDraftModal] = useState(false);
  const [draftList, setDraftList] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [draftFileUrl, setDraftFileUrl] = useState(null);
  const [draftFileType, setDraftFileType] = useState(null); // pdf / image
  const [isDraftActive, setIsDraftActive] = useState(false);
  const [scannedImages, setScannedImages] = useState([]); // [{ url, name, createdAt }]
  const [focusedScanIndex, setFocusedScanIndex] = useState(0);
  const [userBidangId, setUserBidangId] = useState(null);
  const [showOcrSuccess, setShowOcrSuccess] = useState(false);
const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getToken();
        // Asumsi ada endpoint untuk mendapatkan profil user yang sedang login
        const res = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ambil ID folder dari field 'bidang' (sesuai relasi yang kita buat tadi)
        setUserBidangId(res.data.bidang?._id || res.data.bidang);
      } catch (err) {
        console.error("Gagal memuat profil user", err);
      }
    };
    fetchUserProfile();
  }, []);

  const getFileKey = (file) => {
    if (!file) return "";
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  const handleResetForm = () => {
    setForm(initialFormState);

    if (docType !== "bundle") {
      setPickedFile(null);
      setPreviewUrls([]);
      setFocusedIndex(null);
      setFocusedScanIndex(0);
    }

    // scanner
    setActiveScanner(null);

    // 🔥 DRAFT STATE (INI YANG KURANG)
    setDraftFileUrl(null);
    setDraftFileType(null);
    setIsDraftActive(false);

    // optional tapi aman
    setDocType("single");
  };

  const handleProcessScan = async () => {
    if (!activeScanner) return alert("Pilih scanner terlebih dahulu!");

    setIsScanning(true);
    try {
      const res = await axios.post("http://127.0.0.1:5001/scanner/scan", {
        device_id: activeScanner.id || activeScanner,
      });

      if (res.data.status === "success") {
        const newScan = {
          url: res.data.image_url,
          name: `Hasil Scan ${scannedImages.length + 1}`,
          createdAt: Date.now(),
        };

        setScannedImages((prev) => [...prev, newScan]);
        setFocusedScanIndex(scannedImages.length); // Fokuskan ke gambar yang baru dipindai
      }
    } catch (err) {
      // Tangkap pesan error lebih spesifik dari backend jika ada
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Detail Error Scan:", err.response?.data);
      alert("Proses scan gagal: " + errorMessage);
    } finally {
      setIsScanning(false);
    }
  };

  const fetchDrafts = async () => {
    try {
      setLoadingDrafts(true);
      const token = getToken();
      const res = await axios.get(`${API}/draft/drafts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDraftList(res.data);
      setOpenDraftModal(true);
    } catch (err) {
      alert("Gagal mengambil daftar draf");
    } finally {
      setLoadingDrafts(false);
    }
  };

  const handleApplyDraft = (draft) => {
    setForm({
      ...initialFormState,
      ...draft, // Mengisi metadata dari draf
    });
    // Jika draf memiliki folderId, set juga folder tujuannya
    if (draft.folder) {
      setSelectedFolderId(draft.folder);
    }
    setOpenDraftModal(false);
    alert("Draf berhasil dimuat ke form!");
  };

  const handleScannerFound = (data) => {
    if (data.available && data.devices.length > 0) {
      setAvailableScanners(data.devices);
      setShowScannerList(true);
    } else {
      alert(
        "API Terhubung (Port 5001), tetapi tidak ada hardware scanner yang terdeteksi.",
      );
    }
  };

  const handleSelectScanner = (scanner) => {
    setActiveScanner(scanner);
    setShowScannerList(false);
  };

  const handlePickFile = () => {
    setActiveScanner(null);
    setOpenUpload(true);
  };

  const sanitizeFileName = (name) => {
    return name.replace(/[<>:"/\\|?*]/g, "-"); // Ganti karakter terlarang dengan dash (-)
  };

  const icons = useMemo(
    () => ({
      scanner: iconScanner,
      tips: iconTips,
      file: iconFile,
    }),
    [],
  );

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
      // Pastikan selalu menyimpan array of Files
      setPickedFile((prev) => {
        const current = Array.isArray(prev) ? prev : [];
        return [...current, ...pickedArr];
      });
    }
    setOpenUpload(false);
  };

  useEffect(() => {
    // 1. Jika tidak ada file, bersihkan preview
    if (!pickedFile || (Array.isArray(pickedFile) && pickedFile.length === 0)) {
      setPreviewUrls([]);
      setFocusedIndex(null);
      return;
    }

    const files = Array.isArray(pickedFile) ? pickedFile : [pickedFile];

    // 2. Fungsi untuk konversi File ke Base64 (Promisified)
    const getBase64 = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    };

    // 3. Proses file secara asinkron
    const processFiles = async () => {
      const newPreviews = await Promise.all(
        files.map(async (file) => {
          // Jika input adalah File/Blob asli
          if (file instanceof Blob) {
            const base64 = await getBase64(file);
            return {
              file,
              url: base64,
              ocrDone: false,
              key: `${file.name}-${file.size}`, // identifier unik sederhana
            };
          }
          // Jika input sudah berupa objek preview (fallback bug state)
          if (file && file.url) return file;
          return null;
        }),
      );

      const validPreviews = newPreviews.filter(Boolean);

      setPreviewUrls((prevUrls) => {
        if (docType === "bundle") {
          // Gabungkan hanya yang belum ada di preview sebelumnya
          const existingKeys = new Set(prevUrls.map((p) => p.key));
          const toAdd = validPreviews.filter((p) => !existingKeys.has(p.key));
          return [...prevUrls, ...toAdd];
        }
        // Mode single: ganti total
        return validPreviews;
      });
    };

    processFiles();
  }, [pickedFile, docType]);

  const renderPreview = () => {
    if (draftFileUrl) {
      if (draftFileType === "pdf") {
        return (
          <iframe
            src={draftFileUrl}
            className="mt-4 h-[450px] w-full rounded-xl border"
            title="Draft PDF"
          />
        );
      }

      if (draftFileType === "image") {
        return (
          <img
            src={draftFileUrl}
            className="mt-4 max-h-[450px] w-full rounded-xl border object-contain"
            alt="Draft Image"
          />
        );
      }
    }

    if (scannedImages.length > 0) {
      const target = scannedImages[focusedScanIndex] || scannedImages[0];
      if (!target?.url) return null;

      return (
        <div>
          <img
            src={target.url}
            className="mt-4 max-h-[450px] w-full rounded-xl border object-contain shadow-sm"
            alt={target.name || `Hasil Scan ${focusedScanIndex + 1}`}
          />

          {/* Tombol Scan Lagi */}
          {activeScanner && (
            <button
              onClick={handleProcessScan}
              disabled={isScanning}
              className={`h-[34px] px-4 rounded-xl text-[12px] font-semibold transition ${
                isScanning
                  ? "bg-slate-300 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isScanning ? "Memproses..." : "Scan Lagi"}
            </button>
          )}
        </div>
      );
    }

    if (docType === "bundle" && focusedIndex === null) return null;

    let targetFileObj = null;

    if (docType === "single" && previewUrls.length > 0) {
      targetFileObj = previewUrls[0];
    } else if (
      docType === "bundle" &&
      focusedIndex !== null &&
      previewUrls[focusedIndex]
    ) {
      targetFileObj = previewUrls[focusedIndex];
    }

    if (!targetFileObj) return null;

    const { file, url } = targetFileObj;

    // Memeriksa tipe file dengan lebih cermat
    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");

    if (isPdf) {
      return (
        <iframe
          src={url}
          title={file.name}
          className="mt-4 h-[450px] w-full rounded-xl border"
        />
      );
    }

    if (isImage) {
      return (
        <img
          src={url}
          className="mt-4 max-h-[450px] w-full rounded-xl border object-contain"
          alt={file.name}
        />
      );
    }

    return (
      <div className="mt-4 text-sm text-slate-500">Preview tidak tersedia</div>
    );
  };

  const hasPickedFile =
    !!draftFileUrl ||
    isDraftActive ||
    (docType === "single"
      ? !!pickedFile
      : Array.isArray(pickedFile) && pickedFile.length > 0) ||
    (Array.isArray(scannedImages) && scannedImages.length > 0);

  useEffect(() => {
    if (!form.bidang || !form.tahun) return;
    if (lastBidangRef.current === `${form.bidang}-${form.tahun}`) return;
    lastBidangRef.current = `${form.bidang}-${form.tahun}`;
    const fetchNomorUrut = async () => {
      try {
        const res = await axios.get(`${API}/arsip/next-number`, {
          params: { bidang: form.bidang, tahun: form.tahun },
        });

        setForm((s) => ({ ...s, noUrut: res.data.noUrut }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchNomorUrut();
  }, [form.bidang, form.tahun]);

 const handleScanOCR = async (source) => {
  const formData = new FormData();
  let fileNameLog = "";

  try {
    setUploading(true);

    // OCR dari hasil scan hardware (multi)
    if (typeof source === "object" && source?.type === "scanned") {
      const idx = source.index ?? 0;
      const target = scannedImages[idx];
      if (!target?.url) return;

      const response = await fetch(target.url);
      const blob = await response.blob();
      const file = new File([blob], `scanned_document_${idx + 1}.png`, {
        type: blob.type || "image/png",
      });

      formData.append("file", file);
      fileNameLog = target.name || `Hasil Scan ${idx + 1}`;
      setFocusedScanIndex(idx);
    }
    // OCR dari file upload
    else {
      const files = Array.isArray(pickedFile) ? pickedFile : [pickedFile];
      const fileToScan = files[source];
      if (!fileToScan) return;
      setFocusedIndex(source);
      formData.append("file", fileToScan);
      fileNameLog = fileToScan.name;
    }

    const res = await axios.post(`${API}/scan-ocr`, formData);

    const text = res.data.text;
    const parsed = parseOCRText(text);

    setForm((s) => ({
      ...s,
      ...parsed,
      namaFile:
        s.namaFile ||
        (source?.type === "scanned"
          ? "Hasil Scan " + new Date().toLocaleTimeString()
          : fileNameLog.replace(/\.[^/.]+$/, "")),
    }));

    // Tandai item yang sudah di-OCR
    if (typeof source === "object" && source?.type === "scanned") {
      const idx = source.index ?? 0;
      setScannedImages((prev) =>
        prev.map((it, i) => (i === idx ? { ...it, ocrDone: true } : it))
      );
    } else {
      setPreviewUrls((prev) =>
        prev.map((it, i) => (i === source ? { ...it, ocrDone: true } : it))
      );
    }

    // --- PERUBAHAN DI SINI ---
    setShowOcrSuccess(true); 
    // alert diganti menjadi state agar SuccessNotification muncul
    
  } catch (err) {
    console.error(err);
    alert("OCR gagal memproses gambar.");
  } finally {
    setUploading(false);
  }
};

  function parseOCRText(text) {
    const cleanText = text
      .replace(/\r/g, "")
      .replace(/[ \t]+/g, " ")
      .trim();
    const lines = cleanText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const getByLabel = (labels) => {
      for (const label of labels) {
        const regex = new RegExp(`${label}\\s*[\\.\\:\\-]?\\s*(.+)`, "i");
        const match = cleanText.match(regex);
        if (match) return match[1].trim();
      }
      return null;
    };
    const data = {};
    data.nomorSurat =
      getByLabel(["Nomor Surat", "Nomor", "No"]) || "Tidak Terdeteksi";
    data.perihal =
      getByLabel(["Perihal", "Hal", "Mengenai"]) || "Tidak Terdeteksi";
    data.namaInstansi =
      lines
        .slice(0, 5)
        .find((l) =>
          /PENGADILAN|DINAS|BADAN|PEMERINTAH|KEMENTERIAN|PT\.|CV\.|YAYASAN/i.test(
            l,
          ),
        ) || "Tidak Terdeteksi";
    data.kantorBidang =
      lines.find((l) => /BIDANG|SEKSI|SUBBAG|BAGIAN|UNIT|BIRO/i.test(l)) ||
      "Tidak Terdeteksi";
    data.lokasi =
      lines.find((l) => /JL\.|JALAN|GEDUNG|LANTAI|KOTA|PROVINSI/i.test(l)) ||
      "Lokasi Tidak Tercantum";
    const rakManual = getByLabel([
      "Nomor Rak",
      "No Rak",
      "Rak",
      "Box",
      "Lokasi Simpan",
    ]);
    if (rakManual) {
      data.noRak = rakManual;
    } else {
      const rakPattern = cleanText.match(/RAK\s*([A-Z0-9\.]+)/i);
      data.noRak = rakPattern ? rakPattern[0] : "Belum Ditentukan";
    }
    const manualTahun = getByLabel([
      "Tahun",
      "Thn",
      "Tahun Anggaran",
      "Periode",
    ]);

    if (manualTahun) {
      const yearOnly = manualTahun.match(/\b(19|20)\d{2}\b/);
      data.tahun = yearOnly ? yearOnly[0] : manualTahun;
    } else {
      // PENYEMPURNAAN DI SINI:
      // Regex ini mencari angka (tgl), lalu nama bulan (teks), lalu tahun 4 digit
      // Dibuat lebih fleksibel untuk menangkap variasi spasi atau karakter OCR
      const dateMatch = cleanText.match(
        /(\d{1,2})\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)\s+(20\d{2}|19\d{2})/i,
      );

      if (dateMatch) {
        // Index [3] adalah grup penangkap tahun (20\d{2}|19\d{2})
        data.tahun = dateMatch[3];
      } else {
        // Fallback 1: Cari tahun di dalam Nomor Surat (misal: /2023 atau .2023)
        const nomorMatch = data.nomorSurat.match(/[\/\.\-](20\d{2}|19\d{2})\b/);
        if (nomorMatch) {
          data.tahun = nomorMatch[1];
        } else {
          // Fallback 2: Cari angka 4 digit sembarang yang dimulai dengan 19 atau 20
          const anyYear = cleanText.match(/\b(20\d{2}|19\d{2})\b/);
          data.tahun = anyYear ? anyYear[0] : "Tidak Terdeteksi";
        }
      }
    }
    const lowerText = cleanText.toLowerCase();
    const lowerPerihal = data.perihal.toLowerCase();
    if (
      lowerText.includes("sop") ||
      lowerText.includes("standar operasional")
    ) {
      data.kategori = "SOP";
    } else if (
      lowerText.includes("laporan") ||
      lowerText.includes("lpj") ||
      lowerPerihal.includes("lap.")
    ) {
      data.kategori = "Laporan";
    } else if (/kwitansi|invoice|tagihan|biaya/i.test(lowerText)) {
      data.kategori = "Keuangan";
    } else {
      data.kategori = "Surat";
    }
    return data;
  }

  const handleUpload = async (mode = "final") => {
    try {
      // 1. VALIDASI
      if (mode === "final") {
        if (!hasPickedFile && !scannedImages.length && !isDraftActive) {
          return alert("Pilih atau scan file terlebih dahulu!");
        }
        if (!selectedFolderId) {
          return alert("Pilih folder tujuan terlebih dahulu.");
        }
      }

      setUploading(true);
      const formData = new FormData();

      // 2. PENGAMBILAN FILE
      let fileToUpload = null;

      if (isDraftActive && draftFileUrl) {
        const response = await fetch(draftFileUrl);
        const blob = await response.blob();
        fileToUpload = new File(
          [blob],
          `${sanitizeFileName(form.namaFile || "draft")}.pdf`,
          {
            type: blob.type || "application/pdf",
          },
        );
      } else if (scannedImages.length > 0) {
        const target = scannedImages[focusedScanIndex] || scannedImages[0];
        const response = await fetch(target.url);
        const imgBlob = await response.blob();

        const img = await createImageBitmap(imgBlob);
        const pdf = new jsPDF({
          orientation: img.width > img.height ? "l" : "p",
          unit: "px",
          format: [img.width, img.height],
        });

        const base64Data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(imgBlob);
        });

        pdf.addImage(
          base64Data,
          imgBlob.type?.includes("jpeg") ? "JPEG" : "PNG",
          0,
          0,
          img.width,
          img.height,
        );
        fileToUpload = new File(
          [pdf.output("blob")],
          `${sanitizeFileName(form.namaFile || "scan")}.pdf`,
          {
            type: "application/pdf",
          },
        );
      } else if (hasPickedFile) {
        if (docType === "single") {
          fileToUpload = pickedFile;
        } else {
          fileToUpload = Array.isArray(pickedFile)
            ? pickedFile[focusedIndex]
            : pickedFile;
        }
      }

      if (!fileToUpload) {
        setUploading(false);
        return alert("File tidak ditemukan atau gagal diproses.");
      }

      // 3. MENYUSUN FORMDATA
      formData.append("files", fileToUpload);

      const allowedFields = [
        "_id",
        "namaFile",
        "bidang",
        "noUrut",
        "unitKerja",
        "tahun",
        "kantorBidang",
        "noRak",
        "lokasi",
        "kategori",
        "namaInstansi",
        "nomorSurat",
        "perihal",
        "kerahasiaan",
        "tipeDokumen",
        "noArsip",
        "noArsipPreview",
      ];

      allowedFields.forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      formData.append("folder", selectedFolderId);

      // 4. PROSES KIRIM
      if (mode === "draft") {
        // Menyimpan draft ke server
        await axios.post(
          `${API}/draft/save-draft`, // Ganti URL dengan menggunakan API
          formData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else if (isDraftActive) {
        await axios.post(
          `${API}/files/updateStatus`, // Ganti URL dengan menggunakan API
          {
            fileId: form._id,
            status: "final",
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "application/json",
            },
          },
        );
      } else {
        await axios.post(`${API}/files/createFile`, formData, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Reset state after successful upload or draft save
      if (scannedImages.length > 0) {
        setScannedImages((prev) => {
          const updatedScans = prev.filter(
            (_, idx) => idx !== focusedScanIndex,
          );
          return updatedScans;
        });

        setFocusedScanIndex(0);
        setForm((prev) => ({
          ...prev,
          namaFile: "",
          nomorSurat: "",
          perihal: "",
        }));

        if (scannedImages.length === 1) {
          setShowSuccess(true);
        }
      } else if (docType === "single") {
        setPickedFile(null);
        setPreviewUrls([]);
        setShowSuccess(true);
      }

      if (docType === "single" || mode === "final") {
        setForm(initialFormState);
        setPickedFile(null);
        setPreviewUrls([]);
        setFocusedIndex(null);
        setDraftFileUrl(null);
        setDraftFileType(null);
        setIsDraftActive(false);
        if (mode === "final" || mode === "draft") setShowSuccess(true);
      } else if (docType === "bundle") {
        setPickedFile((prev) => {
          const currentFiles = Array.isArray(prev) ? prev : [];
          const remainingFiles = currentFiles.filter(
            (_, index) => index !== focusedIndex,
          );
          return remainingFiles.length > 0 ? remainingFiles : null;
        });

        setPreviewUrls((prev) => {
          const remainingPreviews = prev.filter(
            (_, index) => index !== focusedIndex,
          );
          return remainingPreviews;
        });

        setForm((prev) => ({
          ...prev,
          namaFile: "",
          nomorSurat: "",
          kantorBidang: "",
          noRak: "",
          lokasi: "",
          tahun: "",
          noArsipPreview: "",
          kerahasiaan: "",
          tipeDokumen: "",
          namaInstansi: "",
          perihal: "",
        }));
        setFocusedIndex(null);
        
      }

      if (mode === "final") {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert(err.response?.data?.message || "Gagal upload dokumen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <Welcomebanner />
      {showScannerList && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold">Pilih Perangkat Scanner</h3>
            <div className="mt-4 space-y-2">
              {availableScanners.map((device, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectScanner(device)}
                  className="w-full rounded-xl border p-4 text-left hover:bg-blue-50 hover:border-blue-500 transition"
                >
                  <p className="font-medium text-slate-700">
                    {device.name || `Scanner ${idx + 1}`}
                  </p>
                  <p className="text-xs text-slate-400">
                    {device.id || "WIA Device"}
                  </p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowScannerList(false)}
              className="mt-4 w-full text-sm text-slate-500 underline"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        <main>
          <div className="max-w-[520px]">
            <div className="mt-0 space-y-1 text-[12px] text-slate-400">
              <div>
                *Pilih Bidang (Wajib) dan Sub Bidang (Opsional) sebelum scan.
              </div>
              <div>*Pilih jenis dokumen single atau bundle.</div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setOpenFolderPicker(true)}
                className="h-[40px] flex-1 rounded-xl border px-4 text-[12px] hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                📁 {selectedFolderId ? "Ubah Folder" : "Pilih Folder Tujuan"}
              </button>

              <button
                onClick={fetchDrafts}
                disabled={loadingDrafts}
                className="h-[40px] px-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-[12px] hover:bg-amber-100 transition flex items-center gap-2"
              >
                {loadingDrafts ? "..." : "📝 Lihat Draft"}
              </button>
            </div>

            {selectedFolderPath.length > 0 && (
              <div className="mt-4 flex items-center flex-wrap gap-2 rounded-xl bg-blue-50/50 p-3 border border-blue-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500 mr-1">
                  Lokasi Simpan:
                </span>
                <nav className="flex items-center text-[13px] font-medium overflow-hidden">
                  {selectedFolderPath.map((folder, index) => (
                    <div key={folder.id || index} className="flex items-center">
                      {index > 0 && (
                        <svg
                          className="mx-2 h-4 w-4 text-slate-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                      <span
                        className={`truncate max-w-[120px] ${index === selectedFolderPath.length - 1 ? "text-blue-700 font-bold" : "text-slate-500"}`}
                      >
                        {folder.name}
                      </span>
                    </div>
                  ))}
                </nav>
              </div>
            )}

            <SegmentedType
              value={docType}
              onChange={(val) => {
                setDocType(val);
                setPickedFile(null);
                setFocusedIndex(null);
                setScannedImages([]);
                setFocusedScanIndex(0);
                // 🔥 TAMBAHKAN
                setDraftFileUrl(null);
                setDraftFileType(null);
                setIsDraftActive(false);
              }}
            />

            <div className="mt-8">
              {/* KONDISI 1: SUDAH ADA FILE ATAU HASIL SCAN */}
              {hasPickedFile ? (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="text-sm font-semibold mb-2">
                    {draftFileUrl
                      ? "Preview Dokumen (Draft)"
                      : docType === "bundle"
                        ? focusedIndex !== null
                          ? `Preview: ${pickedFile[focusedIndex]?.name}`
                          : "Pilih File dari Antrean"
                        : "Preview Dokumen"}
                  </div>

                  {renderPreview()}

                  <div className="mt-8 rounded-2xl border bg-slate-50/50 p-6">
                    <div className="text-sm font-semibold mb-4">
                      {docType === "bundle"
                        ? "Antrean Dokumen (Bundle)"
                        : "Detail File"}
                    </div>
                    <div className="space-y-4">
                      {previewUrls.length > 0
                        ? previewUrls.map((item, idx) => {
                            const isFocused = focusedIndex === idx;
                            return (
                              <div
                                key={idx}
                                onClick={() =>
                                  docType === "bundle" && setFocusedIndex(idx)
                                }
                                className={`flex flex-col gap-2 p-3 border rounded-xl transition cursor-pointer ${isFocused ? "bg-white border-blue-500 ring-2 ring-blue-100" : "bg-white border-slate-200"}`}
                              >
                                <div className="flex justify-between items-center text-[12px]">
                                  <span className="font-medium truncate max-w-[200px] text-slate-700">
                                    {isFocused ? "👉 " : ""} 📄{" "}
                                    {item.file?.name}
                                  </span>
                                  <span className="text-slate-400">
                                    {(item.file.size / 1024).toFixed(2)} KB
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleScanOCR(idx);
                                    }}
                                    className="flex-1 h-[32px] rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold transition"
                                  >
                                    Scan OCR & Isi Form
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (docType === "single") {
                                        setPickedFile(null);
                                      } else {
                                        setPickedFile((prev) => {
                                          const n = [...prev];
                                          n.splice(idx, 1);
                                          return n;
                                        });
                                        if (focusedIndex === idx)
                                          setFocusedIndex(null);
                                      }
                                    }}
                                    className="h-[32px] px-3 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-[11px]"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        : scannedImages.length > 0 && (
                            <div className="space-y-3">
                              <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100 font-medium">
                                {scannedImages.length} Hasil scan tersedia.
                                Silakan proses satu per satu.
                              </div>

                              <div className="space-y-2">
                                {scannedImages.map((s, idx) => {
                                  const isFocused = focusedScanIndex === idx;
                                  return (
                                    <div
                                      key={s.createdAt || idx}
                                      onClick={() => setFocusedScanIndex(idx)}
                                      className={`flex flex-col gap-2 p-3 border rounded-xl transition cursor-pointer ${
                                        isFocused
                                          ? "bg-white border-blue-500 ring-2 ring-blue-100"
                                          : "bg-white border-slate-200 opacity-60"
                                      }`}
                                    >
                                      <div className="flex justify-between items-center text-[12px]">
                                        <span className="font-medium truncate">
                                          {isFocused ? "👉 " : ""}{" "}
                                          {s.name || `Hasil Scan ${idx + 1}`}
                                        </span>
                                        {s.ocrDone && (
                                          <span className="text-emerald-500 font-bold">
                                            ✓ Terisi
                                          </span>
                                        )}
                                      </div>

                                      {isFocused && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleScanOCR({
                                              type: "scanned",
                                              index: idx,
                                            });
                                          }}
                                          className="h-[32px] rounded-lg bg-emerald-500 text-white text-[11px] font-semibold"
                                        >
                                          Ambil Data OCR
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}{" "}
                    </div>
                    <div className="mt-6 flex gap-3 border-t pt-5">
                      <button
                        onClick={() => setOpenUpload(true)}
                        className="h-[40px] rounded-xl border bg-white px-5 text-[13px] hover:bg-slate-50 transition"
                      >
                        {docType === "single" ? "Ganti File" : "Tambah File"}
                      </button>
                      <button
                        onClick={() => {
                          setPickedFile(docType === "single" ? null : []);
                          setFocusedIndex(null);
                          setScannedImage(null);
                        }}
                        className="h-[40px] rounded-xl border bg-white px-5 text-[13px] text-red-500 hover:bg-red-50 transition"
                      >
                        Batalkan
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeScanner ? (
                /* KONDISI 2: SCANNER TERPILIH TAPI BELUM SCAN (READY STATE) */
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-12 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 animate-pulse">
                    <img
                      src={icons.scanner}
                      alt="Scanner"
                      className="h-10 w-10"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Scanner Siap!
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 max-w-[280px]">
                    Terhubung:{" "}
                    <span className="font-semibold text-blue-600">
                      {activeScanner.name || activeScanner}
                    </span>
                  </p>

                  <button
                    onClick={handleProcessScan}
                    disabled={isScanning}
                    className={`mt-6 flex items-center gap-3 rounded-xl px-10 py-4 font-bold text-white transition-all shadow-lg ${
                      isScanning
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-blue-200"
                    }`}
                  >
                    {isScanning ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Memproses...
                      </>
                    ) : (
                      "MULAI SCAN SEKARANG"
                    )}
                  </button>

                  <button
                    onClick={() => setActiveScanner(null)}
                    className="mt-6 text-xs text-slate-400 hover:text-red-500 underline"
                  >
                    Ganti metode ke Upload File
                  </button>
                </div>
              ) : (
                /* KONDISI 3: EMPTY STATE (AWAL) */
                <EmptyState
                  icon={icons.scanner}
                  onScannerFound={handleScannerFound}
                  onPickFile={handlePickFile}
                />
              )}
            </div>
          </div>
        </main>

        <RightPanel
          icons={icons}
          form={form}
          setForm={setForm}
          onUpload={handleUpload}
          activeScanner={activeScanner}
          onReset={handleResetForm}
          isScanning={isScanning}
          onStartScan={handleProcessScan}
        />
      </div>

      <UploadModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onPicked={onPicked}
        isBundle={docType === "bundle"}
      />

      <FolderPickerModal
        open={openFolderPicker}
        onClose={() => setOpenFolderPicker(false)}
        userBidangId={userBidangId}
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
      <SuccessNotification 
      show={showOcrSuccess} 
      onClose={() => setShowOcrSuccess(false)} 
      message="OCR Berhasil! Data otomatis dimasukkan ke dalam form."
    />

      <LoadingOverlay show={uploading} />
      <SuccessModal
        show={showSuccess}
        onClose={() => {
          setShowSuccess(false); // Tutup modal sukses
        }}
        message="Dokumen berhasil diupload"
      />

      <DraftModal
        open={openDraftModal}
        onClose={() => setOpenDraftModal(false)}
        drafts={draftList}
        loading={loadingDrafts}
        onSelect={(draft) => {
          // 1. Isi form dari draft
          setForm({
            ...initialFormState,
            ...draft,
          });

          // 2. Set folder tujuan
          if (draft.folder) {
            setSelectedFolderId(draft.folder);
          }

          // 3. SET FILE DRAFT SEBAGAI FILE AKTIF
          if (draft.filePath) {
            const fullUrl = `http://localhost:5000/${draft.filePath}`; // Ganti localhost dengan API

            setDraftFileUrl(fullUrl);
            setIsDraftActive(true);

            if (draft.filePath.toLowerCase().endsWith(".pdf")) {
              setDraftFileType("pdf");
            } else if (draft.filePath.match(/\.(jpg|jpeg|png)$/i)) {
              setDraftFileType("image");
            }
          } else {
            setDraftFileUrl(null);
            setDraftFileType(null);
            setIsDraftActive(false);
          }

          // 4. Bersihkan state upload lain
          setPickedFile(null);
          setScannedImage(null);
          setPreviewUrls([]);
          setFocusedIndex(null);

          setOpenDraftModal(false);
        }}
      />
    </div>
  );
}
