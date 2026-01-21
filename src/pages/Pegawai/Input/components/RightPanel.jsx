import React from "react";

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
  placeholder,
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

function Select({ value, onChange, children }) {
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
      {children}
    </select>
  );
}

export default function RightPanel({ icons, form, setForm }) {
  const set = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  return (
    <aside className="min-w-0">
      {/* ✅ SATU CARD BESAR (SESUAI DESAIN) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        {/* Scanner status mini */}
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#EEF3FF]">
                <img
                  src={icons.scanner}
                  alt=""
                  className="h-5 w-5"
                  draggable="false"
                />
              </div>
              <div className="leading-tight">
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

        {/* Tips */}
        <div className="mt-3 rounded-xl bg-amber-50 p-3">
          <div className="flex items-start gap-2">
            <div className="mt-[2px] grid h-6 w-6 place-items-center rounded-full bg-amber-100">
              <img
                src={icons.tips}
                alt=""
                className="h-4 w-4"
                draggable="false"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-amber-700">
                TIPS!
              </div>
              <div className="mt-1 text-[11px] leading-5 text-amber-700/80">
                Gunakan resolusi 300 DPI untuk hasil terbaik karena sistem ini
                menggunakan fitur pembacaan teks otomatis (OCR).
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="mt-4">
          <div className="text-[13px] font-semibold text-slate-900">
            Nomor Dokumen
          </div>

          <FieldLabel>Nama File (Auto Generate)</FieldLabel>
          <Input
            value={form.namaFile}
            onChange={set("namaFile")}
            placeholder="Nama File"
          />

          <FieldLabel>Bidang (Otomatis Terisi)</FieldLabel>
          <Input value={form.bidang} onChange={set("bidang")} placeholder="001" />

          <FieldLabel>Nomor Urut Arsip (Otomatis)</FieldLabel>
          <Input value={form.noUrut} onChange={set("noUrut")} placeholder="045" />

          <FieldLabel>Unit Kerja (Default)</FieldLabel>
          <Input
            value={form.unitKerja}
            onChange={set("unitKerja")}
            placeholder="BAPENDA"
          />

          <FieldLabel>Tahun Arsip</FieldLabel>
          <Select value={form.tahun} onChange={set("tahun")}>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </Select>

          {/* Preview Nomor Dokumen */}
          <div className="mt-3 rounded-xl bg-[#1D4ED8] px-3 py-3 text-center">
            <div className="text-[9px] font-semibold tracking-wide text-white/70">
              NOMOR DOKUMEN YANG AKAN TERBENTUK:
            </div>
            <div className="mt-1 text-[12px] font-semibold text-white">
              {form.noDokumenPreview}
            </div>
          </div>

          {/* Lokasi Dokumen */}
          <div className="mt-5 text-[12px] font-semibold text-slate-500">
            Lokasi Dokumen
          </div>

          <FieldLabel>Kantor Bidang</FieldLabel>
          <Input
            value={form.kantorBidang}
            onChange={set("kantorBidang")}
            placeholder="Kantor Bidang"
          />

          <FieldLabel>Nomor Rak</FieldLabel>
          <Input
            value={form.noRak}
            onChange={set("noRak")}
            placeholder="Nomor Rak"
          />

          <FieldLabel>Lokasi</FieldLabel>
          <Input value={form.lokasi} onChange={set("lokasi")} placeholder="Lokasi" />

          {/* Klasifikasi Dokumen */}
          <div className="mt-5 text-[12px] font-semibold text-slate-500">
            Klasifikasi Dokumen
          </div>

          <FieldLabel>Kategori Dokumen</FieldLabel>
          <Select value={form.kategori || ""} onChange={set("kategori")}>
            <option value="">Kategori Dokumen</option>
            <option value="SOP">SOP</option>
            <option value="Surat">Surat</option>
            <option value="Laporan">Laporan</option>
            <option value="Keuangan">Keuangan</option>
          </Select>

          {/* Metadata Dokumen */}
          <div className="mt-5 text-[12px] font-semibold text-slate-500">
            Metadata Dokumen (Isi Manual)
          </div>

          <FieldLabel>Nama Orang/Instansi/Dinas</FieldLabel>
          <Input
            value={form.namaInstansi || ""}
            onChange={set("namaInstansi")}
            placeholder="Nama Orang/Instansi/Dinas"
          />

          <FieldLabel>Nomor Surat</FieldLabel>
          <Input
            value={form.nomorSurat || ""}
            onChange={set("nomorSurat")}
            placeholder="Nomor Surat"
          />

          <FieldLabel>Perihal</FieldLabel>
          <Input
            value={form.perihal || ""}
            onChange={set("perihal")}
            placeholder="Perihal"
          />

          <button
            type="button"
            onClick={() => alert("Tambah field (demo)")}
            className="
              mt-3 inline-flex h-[30px] items-center rounded-lg
              bg-[#1D4ED8] px-3 text-[11px] font-semibold text-white
              hover:brightness-95 transition
            "
          >
            Tambah Field
          </button>

          {/* Tingkat Kerahasiaan */}
          <FieldLabel className="mt-4">Tingkat Kerahasiaan Dokumen</FieldLabel>
          <Select value={form.kerahasiaan || ""} onChange={set("kerahasiaan")}>
            <option value="">Pilih</option>
            <option value="Umum">Umum</option>
            <option value="Terbatas">Terbatas</option>
            <option value="Rahasia">Rahasia</option>
          </Select>

          {/* Tipe Dokumen */}
          <FieldLabel>Tipe Dokumen</FieldLabel>
          <Select value={form.tipeDokumen || ""} onChange={set("tipeDokumen")}>
            <option value="">Pilih</option>
            <option value="Analog">Analog</option>
            <option value="Digital">Digital</option>
          </Select>

          {/* Nomor Arsip */}
          <div className="mt-5 text-[13px] font-semibold text-slate-900">
            Nomor Arsip
          </div>

          <FieldLabel>Nomor Arsip (Otomatis)</FieldLabel>
          <Input
            value={form.noArsip || ""}
            onChange={set("noArsip")}
            placeholder="Nomor Arsip"
          />

          <div className="mt-3 rounded-xl bg-[#1D4ED8] px-3 py-3 text-center">
            <div className="text-[9px] font-semibold tracking-wide text-white/70">
              NOMOR ARSIP YANG TERBENTUK:
            </div>
            <div className="mt-1 text-[12px] font-semibold text-white">
              {form.noArsipPreview || "20240520-143005"}
            </div>
          </div>

          {/* Actions bottom */}
          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => alert("Upload Dokumen (demo)")}
              className="h-[36px] w-full rounded-lg bg-emerald-600 text-[12px] font-semibold text-white hover:brightness-95 transition"
            >
              Upload Dokumen
            </button>

            <button
              type="button"
              onClick={() => alert("Simpan Draft (demo)")}
              className="h-[36px] w-full rounded-lg bg-amber-500 text-[12px] font-semibold text-white hover:brightness-95 transition"
            >
              Simpan Draft
            </button>

            <button
              type="button"
              onClick={() => alert("Batal / Hapus (demo)")}
              className="h-[36px] w-full rounded-lg bg-red-500 text-[12px] font-semibold text-white hover:brightness-95 transition"
            >
              Scan Ulang
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
