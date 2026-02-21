import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { TopbarContext } from "../../../layouts/AppLayout";
import { jsPDF } from "jspdf";
import { API } from "../../../global/api";
import { motion } from "framer-motion";

import SegmentedType from "./components/SegmentedType";
import EmptyState from "./components/EmptyState";
import UploadModal from "./components/UploadModal";
import RightPanel from "./components/RightPanel";
import FolderPickerModal from "./components/FolderPickerModal";
import LoadingOverlay from "./components/LoadingOverlay";
import SuccessModal from "./components/SuccessModal";
import DraftModal from "./components/draftModal";
import Welcomebanner from "./components/welcomePage";
import SuccessNotification from "./components/SuccessNotification";

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
  const [errorShake, setErrorShake] = useState(0);

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
      // Kita tidak perlu alert di sini karena EmptyState sudah menangani feedback-nya
      console.warn("Scanner hardware not found");
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
          prev.map((it, i) => (i === idx ? { ...it, ocrDone: true } : it)),
        );
      } else {
        setPreviewUrls((prev) =>
          prev.map((it, i) => (i === source ? { ...it, ocrDone: true } : it)),
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
        // Cek apakah file sudah dipilih (Upload / Scan / Draft)
        const isFileMissing = !hasPickedFile && !scannedImages.length && !isDraftActive;
        // Cek apakah folder sudah dipilih
        const isFolderMissing = !selectedFolderId;

        if (isFileMissing || isFolderMissing) {
          // --- PERBAIKAN UTAMA DI SINI ---
          // Hapus alert lama, ganti dengan trigger shake
          setErrorShake((prev) => prev + 1);
          
          // Opsional: Log ke console untuk debugging
          console.log("Validasi Gagal: File/Folder kosong. Trigger Shake!");
          return; // Stop eksekusi
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
        setErrorShake(prev => prev + 1);
        return;
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

  const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Jeda waktu antar elemen muncul
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
};

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-4 md:p-0">
      {/* 3. Bungkus konten utama dengan motion.div stagger */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1600px] mx-auto" // Optional: membatasi lebar agar rapi di layar ultra-wide
      >
        {/* Banner */}
        <motion.div variants={itemVariants}>
          <Welcomebanner />
        </motion.div>

        {/* Modal Scanner List */}
        {showScannerList && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all">
            {/* Modal logic tetap sama */}
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Pilih Scanner</h3>
              <div className="space-y-2">
                {availableScanners.map((device, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveScanner(device)}
                    className="block w-full text-left p-3 border rounded-xl hover:bg-blue-50"
                  >
                    {device.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowScannerList(false)}
                className="mt-4 text-slate-500 w-full text-center"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px] mt-8">
          {/* Kolom Kiri: Header & Action Area */}
          <div className="space-y-6">
            {/* Header Section: Konfigurasi */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
                    Konfigurasi Penyimpanan
                  </h2>
                  <p className="text-xs text-slate-400 italic">
                    *Wajib pilih folder & jenis dokumen
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setOpenFolderPicker(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm"
                  >
                    📁 {selectedFolderId ? "Ubah Folder" : "Pilih Folder "}
                  </button>

                  <button
                    onClick={fetchDrafts} // Pastikan function fetchDrafts ada di logic asli
                    disabled={loadingDrafts}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-100 transition-all shadow-sm"
                  >
                    {loadingDrafts ? "..." : "📝 Lihat Draft"}
                  </button>
                </div>
              </div>

              {/* Breadcrumb */}
              {selectedFolderPath.length > 0 && (
                <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-t border-slate-50 pt-4">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mr-2">
                    Lokasi:
                  </span>
                  {selectedFolderPath.map((folder, index) => (
                    <div
                      key={folder.id || index}
                      className="flex items-center gap-2"
                    >
                      {index > 0 && <span className="text-slate-300">/</span>}
                      <span
                        className={`whitespace-nowrap px-3 py-1 rounded-full text-[12px] font-medium ${index === selectedFolderPath.length - 1 ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-slate-100 text-slate-500"}`}
                      >
                        {folder.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 border-t pt-6">
                <SegmentedType
                  value={docType}
                  onChange={(val) => {
                    setDocType(val);
                    setPickedFile(null);
                    setFocusedIndex(null);
                    setScannedImages([]);
                    setFocusedScanIndex(0);
                    setDraftFileUrl(null);
                    setDraftFileType(null);
                    setIsDraftActive(false);
                  }}
                />
              </div>
            </motion.div>

            {/* Action Area (Upload / Scan / Preview) */}
            <motion.div variants={itemVariants} className="min-h-[500px]">
              {hasPickedFile ? (
                <div className="space-y-6">
                  {/* Preview Window */}
                 {/* Preview Window - Landscape Mode (16:9 Ratio) */}
<div className="relative group w-full h-full">
  {/* Glow Effect */}
  <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2rem] blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>

  <div className="relative bg-slate-100 rounded-[1.5rem] p-3 border border-white/50 shadow-xl overflow-hidden">
    
    {/* Background Dot Pattern */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
         style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
    </div>

    {/* Main Container - ASPECT VIDEO (LANDSCAPE) */}
    <div className="relative w-full aspect-video bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden flex flex-col">
      
      {/* 1. Slim Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between shrink-0 z-10 h-10">
        {/* Controls */}
        <div className="flex items-center gap-1.5 w-16">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 opacity-70">
           <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wide truncate max-w-[300px]">
            {form.namaFile || (pickedFile?.name) || "Landscape Preview"}
          </span>
        </div>
      </div>

      {/* 2. Content Canvas (Full Height & Width) */}
      <div className="flex-1 bg-slate-50/50 p-4 relative overflow-hidden flex items-center justify-center">
        {/* Container Render Preview */}
        <div className="w-full h-full shadow-lg rounded-lg overflow-hidden transition-transform duration-500 group-hover:scale-[1.01]">
           {renderPreview()}
        </div>
      </div>

    </div>
  </div>
</div>

                  {/* Queue Section */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-800">
                        {docType === "bundle"
                          ? "Antrean Dokumen (Bundle)"
                          : "Detail File Terpilih"}
                      </h3>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {previewUrls.length || scannedImages.length} Item
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Logic Preview Items (Copy Paste dari kode asli Anda di sini) */}
                      {previewUrls.map((item, idx) => {
                        const isFocused = focusedIndex === idx;
                        return (
                          <div
                            key={idx}
                            onClick={() =>
                              docType === "bundle" && setFocusedIndex(idx)
                            }
                            className={`group relative flex flex-col p-4 rounded-2xl border transition-all cursor-pointer ${isFocused ? "bg-blue-50 border-blue-400 ring-4 ring-blue-50" : "bg-white border-slate-100 hover:border-blue-200"}`}
                          >
                            <div className="flex items-start gap-3 mb-4">
                              <div
                                className={`p-2 rounded-xl shrink-0 ${isFocused ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}
                              >
                                <img
                                  src={icons.file}
                                  className="w-5 h-5 brightness-0 invert"
                                  alt=""
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-700 truncate">
                                  {isFocused ? "👉 " : ""} {item.file?.name}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                  {(item.file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleScanOCR(idx);
                                }}
                                className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all ${item.ocrDone ? "bg-emerald-100 text-emerald-700" : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100"}`}
                              >
                                {item.ocrDone
                                  ? "✓ Data Terisi"
                                  : "Scan OCR & Isi Form"}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); /* Logic delete */
                                }}
                                className="p-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {/* Logic Scanned Images List (Jika ada) */}
                      {scannedImages.length > 0 &&
                        previewUrls.length === 0 &&
                        scannedImages.map((s, idx) => (
                          /* Render scanned items here similar to your code */
                          <div
                            key={idx}
                            onClick={() => setFocusedScanIndex(idx)}
                            className={`p-4 border rounded-2xl ${focusedScanIndex === idx ? "bg-blue-50 border-blue-400" : "bg-white"}`}
                          >
                            <p className="font-bold text-xs">{s.name}</p>
                            {/* ... button OCR ... */}
                          </div>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-3 pt-6 border-t border-slate-100">
                      <button
                        onClick={() => setOpenUpload(true)}
                        className="flex-1 h-12 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95"
                      >
                        {docType === "single" ? "Ganti File" : "Tambah File"}
                      </button>
                      <button
                        onClick={() => {
                          setPickedFile(null);
                          setScannedImages([]);
                          setIsDraftActive(false);
                          setDraftFileUrl(null);
                        }}
                        className="px-6 h-12 bg-red-50 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-100 transition-all"
                      >
                        Batalkan
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeScanner ? (
                /* Ready to Scan State */
                <div className="h-[500px] flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-blue-200 bg-white shadow-xl shadow-blue-50/50 p-12 text-center transition-all">
                  {/* ... Kode Scanner Active Anda ... */}
                  <h3 className="text-2xl font-black text-slate-800">
                    Scanner Siap!
                  </h3>
                  <p className="mt-3 text-slate-500 mb-10">
                    {activeScanner.name || activeScanner}
                  </p>
                  <button
                    onClick={handleProcessScan}
                    disabled={isScanning}
                    className="bg-blue-600 text-white px-12 py-4 rounded-full font-bold shadow-xl"
                  >
                    {isScanning ? "Memproses..." : "Mulai Scan Sekarang"}
                  </button>
                  <button
                    onClick={() => setActiveScanner(null)}
                    className="mt-6 text-xs text-slate-400 hover:text-red-500 underline"
                  >
                    Ganti metode ke Upload File
                  </button>
                </div>
              ) : (
                /* Empty State */
                <div className="bg-white rounded-[3rem] p-1 shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/50">
                  <EmptyState
                    icon={icons.scanner}
                    onScannerFound={handleScannerFound}
                    onPickFile={handlePickFile}
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Panel - Sticky Form Input */}
          <aside className="relative">
            <motion.div
              variants={itemVariants}
              className="sticky top-8 bg-white rounded-3xl p-6 shadow-xl border border-slate-100 ring-1 ring-black/[0.02]"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Metadata Arsip</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                    Lengkapi Data Form
                  </p>
                </div>
              </div>

              <RightPanel
                icons={icons}
                form={form}
                setForm={setForm}
                onUpload={handleUpload}
                activeScanner={activeScanner}
                onReset={handleResetForm}
                isScanning={isScanning}
                onStartScan={handleProcessScan}
                errorShake={errorShake}
              />
            </motion.div>
          </aside>
        </div>
      </motion.div>

      {/* Components Modals & Notifications (Tidak perlu animasi entry halaman, hanya muncul saat dipanggil) */}
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
        onClose={() => setShowSuccess(false)}
        message="Dokumen berhasil diupload"
      />
      <DraftModal
        open={openDraftModal}
        onClose={() => setOpenDraftModal(false)}
        drafts={draftList}
        loading={loadingDrafts}
        onSelect={(draft) => {
          setForm({ ...initialFormState, ...draft });
          if (draft.folder) setSelectedFolderId(draft.folder);
          if (draft.filePath) {
            const fullUrl = `${API.replace("/api", "")}/${draft.filePath}`;
            setDraftFileUrl(fullUrl);
            setIsDraftActive(true);
            setDraftFileType(
              draft.filePath.toLowerCase().endsWith(".pdf") ? "pdf" : "image",
            );
          }
          setPickedFile(null);
          setPreviewUrls([]);
          setOpenDraftModal(false);
        }}
      />
    </div>
  );
}
