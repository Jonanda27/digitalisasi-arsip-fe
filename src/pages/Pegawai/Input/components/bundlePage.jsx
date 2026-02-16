// src/pages/BundlePage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { getToken } from "../../../auth/auth";
import EmptyState from "./components/EmptyState";
import { useHistory } from "react-router-dom"; // Menggunakan React Router untuk navigasi

const BundlePage = () => {
  const [pickedFiles, setPickedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    namaFile: "",
    tahun: new Date().getFullYear().toString(),
    // tambahkan state form lainnya sesuai kebutuhan
  });
  const history = useHistory(); // Untuk melakukan navigasi

  const handleUploadFiles = async () => {
    try {
      if (pickedFiles.length === 0) {
        alert("Pilih file terlebih dahulu!");
        return;
      }
      
      setUploading(true);
      const formData = new FormData();

      pickedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const token = getToken();
      await axios.post(`${API}/files/createFile`, formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
});

      alert("Dokumen berhasil diupload!");
    } catch (error) {
      alert("Gagal upload dokumen");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    // Tambahkan logika untuk mengelola file yang dipilih atau preview
  }, [pickedFiles]);

  const onFilePicked = (files) => {
    const pickedArr = Array.isArray(files) ? files : [files];
    setPickedFiles((prev) => [...prev, ...pickedArr]);
  };

  return (
    <div className="container">
      <h1>Halaman Input Dokumen Bundle</h1>

      <div>
        <button onClick={() => setShowUpload(true)}>Upload File</button>

        <div className="file-preview">
          {previewUrls.length > 0 ? (
            previewUrls.map((item, idx) => (
              <div key={idx} className="file-item">
                <span>{item.file.name}</span>
                <button onClick={() => setFocusedIndex(idx)}>Pilih</button>
              </div>
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <button onClick={handleUploadFiles} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Modal untuk upload */}
      {showUpload && (
        <UploadModal
          open={showUpload}
          onClose={() => setShowUpload(false)}
          onPicked={onFilePicked}
        />
      )}
    </div>
  );
};

export default BundlePage;
