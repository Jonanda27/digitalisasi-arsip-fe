import React, { useEffect } from "react";

function FieldLabel({ children }) {
  return (
    <div className="mt-4 text-[12px] font-semibold text-slate-700">
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder = "",
  disabled = false,
  type = "text",
}) {
  return (
    <input
      type={type}
      disabled={disabled}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={[
        "h-[36px] w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none transition",
        "focus:border-[#1F5EFF] focus:ring-4 focus:ring-blue-100",
        disabled ? "bg-slate-50 text-slate-400" : "",
      ].join(" ")}
    />
  );
}

function Select({ value, onChange, children, placeholder = "" }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="
        h-[36px] w-full rounded-lg border border-slate-200 bg-white px-3
        text-[12px] text-slate-700 outline-none transition
        focus:border-[#1F5EFF] focus:ring-4 focus:ring-blue-100
      "
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
}

export default function RightPanel({
  icons,
  form,
  setForm,
  onUpload,
  activeScanner, // Data scanner yang dipilih
  onReset,
  isScanning, // Status loading dari parent
  onStartScan, // Fungsi untuk memicu API Scan
  folderPath = [],
}) {
  const set = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  // ========================
  // AUTO PREVIEW NOMOR DOKUMEN
  // ========================
  useEffect(() => {
    const preview = [form.bidang, form.noUrut, form.unitKerja, form.tahun]
      .filter(Boolean)
      .join("/");

    setForm((s) => ({
      ...s,
      noDokumenPreview: preview,
    }));
  }, [form.unitKerja, form.bidang, form.noUrut, form.tahun]);

  // ========================
  // AUTO PREVIEW NOMOR ARSIP
  // ========================
  useEffect(() => {
    if (!form.tahun) {
      setForm((s) => ({ ...s, noArsipPreview: "", noArsip: "" }));
      return;
    }

    // Menghasilkan 6 digit angka acak (000000 - 999999)
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    
    // Format: [TAHUN][ANGKA ACAK] -> Contoh: 2026827391
    const uniqueArsip = `${form.tahun}${randomDigits}`;

    setForm((s) => ({ 
      ...s, 
      noArsipPreview: uniqueArsip, 
      noArsip: uniqueArsip 
    }));
  }, [form.tahun]);

  return (
    <aside className="min-w-0">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* ================= SCANNER STATUS (DINAMIS) ================= */}
        {activeScanner ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 mb-4 transition-all">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-white border border-blue-100">
                  <img src={icons.scanner} className="h-5 w-5" alt="scanner" />
                </div>
                <div>
                  <div className="text-[12px] font-bold text-slate-900 uppercase">
                    {activeScanner.name}
                  </div>
                  <div className="text-[11px] text-blue-600 font-medium italic">
                    Ready to Scan
                  </div>
                </div>
              </div>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-200">
                <img
                  src={icons.file}
                  className="h-5 w-5 opacity-40"
                  alt="file"
                />
              </div>
              <div className="text-[11px] text-slate-500 italic font-medium">
                Mode: Unggah File Lokal (Tanpa Scanner)
              </div>
            </div>
          </div>
        )}

        {/* ================= FORM PENOMORAN ================= */}
        <div className="mt-4">
          <div className="text-[13px] font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
            Penomoran Dokumen
          </div>

          <FieldLabel>Nama File (Auto Generate)</FieldLabel>
          <Input
            value={form.namaFile || ""}
            onChange={set("namaFile")}
            placeholder="Masukkan nama file"
          />

          <FieldLabel>Bidang (Otomatis Terisi)</FieldLabel>
          <Input
            value={form.bidang || ""}
            disabled
            placeholder="Bidang otomatis"
          />

          <FieldLabel>Nomor Urut Arsip (Otomatis)</FieldLabel>
          <Input
            value={form.noUrut || ""}
            disabled
            placeholder="Nomor urut otomatis"
          />

          <FieldLabel>Unit Kerja (Default)</FieldLabel>
          <Input
            value={form.unitKerja || ""}
            onChange={set("unitKerja")}
            placeholder="Masukkan unit kerja"
          />

          <FieldLabel>Tahun Arsip</FieldLabel>
          <Select
            value={form.tahun || ""}
            onChange={set("tahun")}
            placeholder="Pilih tahun"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </Select>

          {/* Preview nomor dokumen */}
          <div className="mt-3 rounded-xl bg-[#1D4ED8] px-3 py-3 text-center shadow-lg shadow-blue-100">
            <div className="text-[9px] text-white/70 uppercase tracking-widest font-bold">
              Nomor Dokumen yang akan terbentuk
            </div>
            <div className="mt-1 text-[12px] font-semibold text-white break-all leading-tight font-mono">
              {form.noDokumenPreview || "-"}
            </div>
          </div>

          {/* ================= LOKASI DOKUMEN ================= */}
          <div className="mt-6 text-[12px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
            Lokasi Fisik
          </div>

          <FieldLabel>Kantor Bidang</FieldLabel>
          <Input
            value={form.kantorBidang || ""}
            onChange={set("kantorBidang")}
            placeholder="Masukkan kantor bidang"
          />

          <FieldLabel>Nomor Rak</FieldLabel>
          <Input
            value={form.noRak || ""}
            onChange={set("noRak")}
            placeholder="Masukkan nomor rak"
          />

          <FieldLabel>Lokasi</FieldLabel>
          <Input
            value={form.lokasi || ""}
            onChange={set("lokasi")}
            placeholder="Masukkan lokasi spesifik"
          />

          {/* ================= KLASIFIKASI ================= */}
          <div className="mt-6 text-[12px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
            Klasifikasi & Metadata
          </div>

          <FieldLabel>Kategori Dokumen</FieldLabel>
          <Select
            value={form.kategori || ""}
            onChange={set("kategori")}
            placeholder="Pilih kategori"
          >
            <option value="SOP">SOP</option>
            <option value="Surat">Surat</option>
            <option value="Laporan">Laporan</option>
            <option value="Keuangan">Keuangan</option>
          </Select>

          <FieldLabel>Nama Orang/Instansi/Dinas</FieldLabel>
          <Input
            value={form.namaInstansi || ""}
            onChange={set("namaInstansi")}
            placeholder="Masukkan nama instansi"
          />

          <FieldLabel>Nomor Surat</FieldLabel>
          <Input
            value={form.nomorSurat || ""}
            onChange={set("nomorSurat")}
            placeholder="Masukkan nomor surat"
          />

          <FieldLabel>Perihal</FieldLabel>
          <Input
            value={form.perihal || ""}
            onChange={set("perihal")}
            placeholder="Masukkan perihal"
          />

          {/* ================= KERAHASIAAN & TIPE ================= */}
          <FieldLabel>Tingkat Kerahasiaan Dokumen</FieldLabel>
          <Select
            value={form.kerahasiaan || ""}
            onChange={set("kerahasiaan")}
            placeholder="Pilih kerahasiaan"
          >
            <option value="Umum">Umum</option>
            <option value="Terbatas">Terbatas</option>
            <option value="Rahasia">Rahasia</option>
          </Select>

          <FieldLabel>Tipe Dokumen</FieldLabel>
          <Select
            value={form.tipeDokumen || ""}
            onChange={set("tipeDokumen")}
            placeholder="Pilih tipe"
          >
            <option value="Analog">Analog</option>
            <option value="Digital">Digital</option>
          </Select>

          {/* ================= NOMOR ARSIP ================= */}
          <div className="mt-6 rounded-xl bg-slate-900 px-3 py-4 text-center">
            <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              Nomor Arsip Tergenerate
            </div>
            <div className="mt-1 text-[13px] font-mono font-bold text-white tracking-wider">
              {form.noArsipPreview || "-"}
            </div>
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="mt-6 space-y-2 pb-4">
            {/* Tombol Utama Scan (Hanya Muncul Jika Mode Scan Aktif) */}

            <button
              onClick={onUpload}
              className="h-[38px] w-full rounded-lg bg-emerald-600 text-[12px] font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Simpan & Upload Dokumen
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpload("draft")}
                className="h-[36px] w-full rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Simpan Draft
              </button>
              <button
                type="button"
                onClick={onReset}
                className="h-[36px] w-full rounded-lg border border-red-100 bg-red-50 text-[11px] font-semibold text-red-600 hover:bg-red-100 transition-colors"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
