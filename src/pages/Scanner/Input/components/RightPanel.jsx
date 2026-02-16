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
  folderPath = [], // ← dari FolderPickerModal
}) {
  const set = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

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
    if (!form.tahun) return;

    const arsip = `${form.tahun}${Date.now().toString().slice(-6)}`;
    setForm((s) => ({ ...s, noArsipPreview: arsip }));
  }, [form.tahun]);

  return (
    <aside className="min-w-0">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        {/* Scanner status */}
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#EEF3FF]">
                <img src={icons.scanner} className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[12px] font-semibold text-slate-900">
                  EPSON DS-530
                </div>
                <div className="text-[11px] text-slate-400">
                  Terhubung lewat TWAIN
                </div>
              </div>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="mt-4">
          <div className="text-[13px] font-semibold text-slate-900">
            Nomor Dokumen
          </div>

          <FieldLabel>Nama File (Auto Generate)</FieldLabel>
          <Input
            value={form.namaFile}
            onChange={set("namaFile")}
            placeholder="Masukkan nama file"
          />

          <FieldLabel>Bidang (Otomatis Terisi)</FieldLabel>
          <Input value={form.bidang} disabled placeholder="Bidang otomatis" />

          <FieldLabel>Nomor Urut Arsip (Otomatis)</FieldLabel>
          <Input value={form.noUrut} disabled placeholder="Nomor urut otomatis" />

          <FieldLabel>Unit Kerja (Default)</FieldLabel>
          <Input
            value={form.unitKerja}
            onChange={set("unitKerja")}
            placeholder="Masukkan unit kerja"
          />

          <FieldLabel>Tahun Arsip</FieldLabel>
          <Select value={form.tahun} onChange={set("tahun")} placeholder="Pilih tahun">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </Select>

          {/* Preview nomor dokumen */}
          <div className="mt-3 rounded-xl bg-[#1D4ED8] px-3 py-3 text-center">
            <div className="text-[9px] text-white/70">
              NOMOR DOKUMEN YANG AKAN TERBENTUK
            </div>
            <div className="mt-1 text-[12px] font-semibold text-white">
              {form.noDokumenPreview}
            </div>
          </div>

          {/* ================= LOKASI DOKUMEN ================= */}
          <div className="mt-5 text-[12px] font-semibold text-slate-500">
            Lokasi Dokumen
          </div>

          <FieldLabel>Kantor Bidang</FieldLabel>
          <Input
            value={form.kantorBidang}
            onChange={set("kantorBidang")}
            placeholder="Masukkan kantor bidang"
          />

          <FieldLabel>Nomor Rak</FieldLabel>
          <Input
            value={form.noRak}
            onChange={set("noRak")}
            placeholder="Masukkan nomor rak"
          />

          <FieldLabel>Lokasi</FieldLabel>
          <Input
            value={form.lokasi}
            onChange={set("lokasi")}
            placeholder="Masukkan lokasi"
          />

          {/* ================= KLASIFIKASI ================= */}
          <div className="mt-5 text-[12px] font-semibold text-slate-500">
            Klasifikasi Dokumen
          </div>

          <FieldLabel>Kategori Dokumen</FieldLabel>
          <Select value={form.kategori || ""} onChange={set("kategori")} placeholder="Pilih kategori">
            <option value="SOP">SOP</option>
            <option value="Surat">Surat</option>
            <option value="Laporan">Laporan</option>
            <option value="Keuangan">Keuangan</option>
          </Select>

          {/* ================= METADATA ================= */}
          <div className="mt-5 text-[12px] font-semibold text-slate-500">
            Metadata Dokumen (Isi Manual)
          </div>

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

          {/* ================= KERAHASIAAN ================= */}
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

          {/* ================= TIPE ================= */}
          <FieldLabel>Tipe Dokumen</FieldLabel>
          <Select
            value={form.tipeDokumen || ""}
            onChange={set("tipeDokumen")}
            placeholder="Pilih tipe dokumen"
          >
            <option value="Analog">Analog</option>
            <option value="Digital">Digital</option>
          </Select>

          {/* ================= NOMOR ARSIP ================= */}
          <div className="mt-5 text-[13px] font-semibold text-slate-900">
            Nomor Arsip
          </div>

          <FieldLabel>Nomor Arsip (Otomatis)</FieldLabel>
          <Input value={form.noArsip || ""} disabled placeholder="Nomor arsip otomatis" />

          <div className="mt-3 rounded-xl bg-[#1D4ED8] px-3 py-3 text-center">
            <div className="text-[9px] text-white/70">
              NOMOR ARSIP YANG TERBENTUK
            </div>
            <div className="mt-1 text-[12px] font-semibold text-white">
              {form.noArsipPreview}
            </div>
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="mt-4 space-y-2">
            <button
              onClick={onUpload}
              className="h-[36px] w-full rounded-lg bg-emerald-600 text-[12px] font-semibold text-white"
            >
              Upload Dokumen
            </button>

            <button className="h-[36px] w-full rounded-lg bg-amber-500 text-[12px] font-semibold text-white">
              Simpan Draft
            </button>

            <button className="h-[36px] w-full rounded-lg bg-red-500 text-[12px] font-semibold text-white">
              Scan Ulang
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
