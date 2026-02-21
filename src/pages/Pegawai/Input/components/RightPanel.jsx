import React, { useEffect, useState, useRef } from "react";
// 1. Import Framer Motion
import { motion, useAnimation } from "framer-motion";

// Helper Component untuk Label
function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 mt-4 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

// Input dengan styling modern
function Input({
  value,
  onChange,
  placeholder = "",
  disabled = false,
  type = "text",
}) {
  return (
    <div className="relative group">
      <input
        type={type}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          h-[40px] w-full rounded-xl border border-slate-200 bg-white px-3 
          text-[13px] text-slate-700 outline-none transition-all duration-200
          placeholder:text-slate-300
          focus:border-blue-500 focus:ring-4 focus:ring-blue-50
          ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-100" : "hover:border-slate-300"}
        `}
      />
    </div>
  );
}

/**
 * CUSTOM SELECT COMPONENT
 */
function CustomSelect({ value, onChange, options, placeholder = "Pilih..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex h-[40px] w-full items-center justify-between rounded-xl border px-3
          text-[13px] transition-all duration-200 cursor-pointer
          ${isOpen ? "border-blue-500 ring-4 ring-blue-50" : "border-slate-200 bg-white hover:border-slate-300"}
          ${!selectedOption ? "text-slate-300" : "text-slate-700"}
        `}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <svg 
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-[100] mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange({ target: { value: opt.value } });
                  setIsOpen(false);
                }}
                className={`
                  flex items-center px-3 py-2.5 text-[13px] transition-colors cursor-pointer
                  ${value === opt.value ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}
                `}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RightPanel({
  icons,
  form,
  setForm,
  onUpload,
  activeScanner,
  onReset,
  isScanning,
  onStartScan,
  folderPath = [],
  errorShake, // 2. TERIMA PROPS errorShake
}) {
  const set = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  // 3. SETUP ANIMASI KONTROL
  const controls = useAnimation();

  // 4. EFEK UNTUK MEMICU SHAKE
  useEffect(() => {
    if (errorShake > 0) {
      controls.start({
        x: [0, -10, 10, -10, 10, 0], // Gerakan kiri-kanan
        backgroundColor: ["#2563eb", "#ef4444", "#2563eb"], // Biru -> Merah -> Biru
        transition: { duration: 0.4, ease: "easeInOut" },
      });
    }
  }, [errorShake, controls]);

  useEffect(() => {
    const preview = [form.bidang, form.noUrut, form.unitKerja, form.tahun]
      .filter(Boolean)
      .join("/");
    setForm((s) => ({ ...s, noDokumenPreview: preview }));
  }, [form.unitKerja, form.bidang, form.noUrut, form.tahun]);

  useEffect(() => {
    if (!form.tahun) {
      setForm((s) => ({ ...s, noArsipPreview: "", noArsip: "" }));
      return;
    }
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const uniqueArsip = `${form.tahun}${randomDigits}`;
    setForm((s) => ({ ...s, noArsipPreview: uniqueArsip, noArsip: uniqueArsip }));
  }, [form.tahun]);

  // Options Data
  const tahunOptions = ["2026", "2025", "2024", "2023", "2022", "2021"].map(y => ({ label: y, value: y }));
  const kategoriOptions = [
    { label: "SOP", value: "SOP" },
    { label: "Surat", value: "Surat" },
    { label: "Laporan", value: "Laporan" },
    { label: "Keuangan", value: "Keuangan" },
  ];
  const kerahasiaanOptions = [
    { label: "Umum", value: "Umum" },
    { label: "Terbatas", value: "Terbatas" },
    { label: "Rahasia", value: "Rahasia" },
  ];
  const tipeOptions = [
    { label: "Analog", value: "Analog" },
    { label: "Digital", value: "Digital" },
  ];

  return (
    <aside className="w-full max-w-[420px]">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50">
        
        {/* ================= HEADER STATUS ================= */}
        <div className="mb-6">
          {activeScanner ? (
            <div className="group overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-blue-100">
                    <img src={icons.scanner} className="h-6 w-6" alt="scanner" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight truncate max-w-[150px]">
                      {activeScanner.name}
                    </h4>
                    <p className="text-[11px] font-bold text-blue-600/70 uppercase">Ready to Capture</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 grayscale">
                  <img src={icons.file} className="h-6 w-6 opacity-30" alt="file" />
                </div>
                <p className="text-[11px] leading-relaxed font-bold text-slate-400 uppercase tracking-wide">
                  Mode: Unggah File Manual<br/>
                  <span className="font-medium normal-case italic opacity-70">(Sistem scanner tidak aktif)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8 h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* ================= SECTION 1: PENOMORAN ================= */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-1.5 rounded-full bg-blue-600"></div>
              <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Data Penomoran</h3>
            </div>

            <div className="space-y-1">
              <FieldLabel required>Nama File</FieldLabel>
              <Input value={form.namaFile || ""} onChange={set("namaFile")} placeholder="Contoh: Surat Keputusan Direksi" />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Bidang</FieldLabel>
                  <Input value={form.bidang || ""} disabled placeholder="Otomatis" />
                </div>
                <div>
                  <FieldLabel>No. Urut</FieldLabel>
                  <Input value={form.noUrut || ""} disabled placeholder="Otomatis" />
                </div>
              </div>

              <FieldLabel>Unit Kerja</FieldLabel>
              <Input value={form.unitKerja || ""} onChange={set("unitKerja")} placeholder="BAPENDA" />

              <FieldLabel required>Tahun Arsip</FieldLabel>
              <CustomSelect 
                value={form.tahun || ""} 
                onChange={set("tahun")} 
                options={tahunOptions} 
                placeholder="Pilih Tahun" 
              />

              <div className="mt-5 rounded-2xl bg-slate-900 p-4 shadow-lg shadow-blue-900/10">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 text-center">Generated Document ID</p>
                <div className="rounded-lg bg-white/5 p-2 text-center border border-white/10">
                  <span className="font-mono text-[13px] font-bold text-white tracking-widest break-all">
                    {form.noDokumenPreview || "••••/••/••••/••••"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 2: LOKASI ================= */}
          <section className="pt-4 border-t border-slate-100">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Penyimpanan Fisik</h3>
            <div className="space-y-1">
              <FieldLabel>Kantor Bidang</FieldLabel>
              <Input value={form.kantorBidang || ""} onChange={set("kantorBidang")} placeholder="Masukkan kantor" />
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Nomor Rak</FieldLabel>
                  <Input value={form.noRak || ""} onChange={set("noRak")} placeholder="R-01" />
                </div>
                <div>
                  <FieldLabel>Lokasi Spesifik</FieldLabel>
                  <Input value={form.lokasi || ""} onChange={set("lokasi")} placeholder="Lantai 2" />
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 3: KLASIFIKASI ================= */}
          <section className="pt-4 border-t border-slate-100">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Metadata Dokumen</h3>
            <div className="space-y-1">
              <FieldLabel required>Kategori</FieldLabel>
              <CustomSelect 
                value={form.kategori || ""} 
                onChange={set("kategori")} 
                options={kategoriOptions} 
                placeholder="Pilih Kategori" 
              />

              <FieldLabel required>Instansi/Dinas</FieldLabel>
              <Input value={form.namaInstansi || ""} onChange={set("namaInstansi")} placeholder="Nama instansi terkait" />

              <FieldLabel>Nomor Surat</FieldLabel>
              <Input value={form.nomorSurat || ""} onChange={set("nomorSurat")} placeholder="Contoh: 001/SK/2023" />

              <FieldLabel required>Perihal</FieldLabel>
              <Input value={form.perihal || ""} onChange={set("perihal")} placeholder="Isi ringkas surat" />

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <FieldLabel>Kerahasiaan</FieldLabel>
                  <CustomSelect 
                    value={form.kerahasiaan || ""} 
                    onChange={set("kerahasiaan")} 
                    options={kerahasiaanOptions} 
                  />
                </div>
                <div>
                  <FieldLabel>Tipe</FieldLabel>
                  <CustomSelect 
                    value={form.tipeDokumen || ""} 
                    onChange={set("tipeDokumen")} 
                    options={tipeOptions} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ================= ARCHIVE ID ================= */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-4 text-center">
            <div className="absolute top-0 right-0 p-1 opacity-10">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 10H7v-2h7v2zm3-4H7V7h10v2zm0 8H7v-2h10v2z"/></svg>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Archive ID</p>
            <p className="mt-1 font-mono text-lg font-bold text-white tracking-[0.2em]">
              {form.noArsipPreview || "----------"}
            </p>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="mt-8 space-y-3">
          {/* 5. GANTI BUTTON DENGAN MOTION.BUTTON */}
          <motion.button
            animate={controls} // Hubungkan animasi di sini
            onClick={() => onUpload("final")}
            className="group relative flex h-[50px] w-full items-center justify-center overflow-hidden rounded-2xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Simpan & Publish Arsip
            </span>
          </motion.button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpload("draft")}
              className="flex h-[44px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[13px] font-bold text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300"
            >
              Simpan Draft
            </button>
            <button
              type="button"
              onClick={onReset}
              className="flex h-[44px] items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 text-[13px] font-bold text-red-600 transition-all hover:bg-red-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Reset
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}