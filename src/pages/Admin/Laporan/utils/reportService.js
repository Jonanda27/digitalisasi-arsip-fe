import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = (reportData, ocrStats, totalDrafts, userData) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('id-ID');
  const time = new Date().toLocaleTimeString('id-ID');
  const primaryColor = [37, 99, 235]; // Blue-600
  const secondaryColor = [71, 85, 105]; // Slate-600

  // --- HEADER SECTION ---
  // Judul Utama
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("LAPORAN REKAPITULASI ARSIP DIGITAL", 14, 22);
  
  // Garis Dekoratif Header
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.line(14, 26, 196, 26);

  // Info Metadata
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Tanggal Cetak: ${date} | Waktu: ${time}`, 14, 33);
  doc.text(`Status Sistem: Operasional / Online`, 14, 38);

  // --- SECTION 1: RINGKASAN EKSEKUTIF ---
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("1. Ringkasan Statistik", 14, 48);

  autoTable(doc, {
    startY: 52,
    head: [['Indikator', 'Kuantitas', 'Satuan']],
    body: [
      ['Total Seluruh Arsip', reportData.reduce((acc, curr) => acc + (curr.stats?.totalFiles || 0), 0), 'Dokumen'],
      ['Scan Dokumen (Bulan Ini)', ocrStats, 'Aktivitas'],
      ['Draft Tersimpan', totalDrafts, 'File'],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 10 },
    styles: { cellPadding: 3 }
  });

  // --- SECTION 2: REKAPITULASI PER BIDANG ---
  let finalY = doc.lastAutoTable.finalY;
  doc.setFont("helvetica", "bold");
  doc.text("2. Distribusi Arsip Per Bidang", 14, finalY + 15);

  autoTable(doc, {
    startY: finalY + 20,
    head: [['Nama Bidang', 'Total', 'Umum', 'Terbatas', 'Rahasia', 'Akses']],
    body: reportData.map(item => [
      item.name.toUpperCase(),
      item.stats?.totalFiles || 0,
      item.stats?.byKerahasiaan?.umum || 0,
      item.stats?.byKerahasiaan?.terbatas || 0,
      item.stats?.byKerahasiaan?.rahasia || 0,
      item.stats?.totalAccessRequests || 0
    ]),
    headStyles: { fillColor: secondaryColor, fontSize: 9 },
    columnStyles: {
      1: { halign: 'center', fontStyle: 'bold' },
      5: { halign: 'center' }
    },
  });

  // --- SECTION 3: DAFTAR PENGGUNA ---
  // Cek apakah muat di halaman yang sama, jika tidak buat halaman baru
  finalY = doc.lastAutoTable.finalY;
  if (finalY > 200) { doc.addPage(); finalY = 10; }

  doc.setFont("helvetica", "bold");
  doc.text("3. Daftar Pengguna Aktif", 14, finalY + 15);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [['Nama Lengkap', 'NIP', 'Email', 'Hak Akses']],
    body: userData.map(user => [
      user.nama,
      user.nip || "-",
      user.email,
      user.role?.toUpperCase() || "USER"
    ]),
    headStyles: { fillColor: [51, 65, 85], fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });

  // --- FOOTER ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Halaman ${i} dari ${pageCount} - Dokumen ini dihasilkan secara otomatis oleh Sistem Arsip`, 105, 285, { align: "center" });
  }

  doc.save(`Laporan_Arsip_${date.replace(/\//g, '-')}.pdf`);
};