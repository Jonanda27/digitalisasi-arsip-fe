import React from "react";

export default function SegmentedType({ value, onChange }) {
  return (
    <div className="mt-4 flex gap-3">
      <button
        type="button"
        onClick={() => onChange("single")}
        className={[
          "h-[40px] rounded-xl px-5 text-[13px] font-semibold transition",
          value === "single"
            ? "bg-[#16A3A3] text-white"
            : "border border-[#16A3A3] text-[#16A3A3] hover:bg-[#16A3A3]/10",
        ].join(" ")}
      >
        Dokumen Tunggal
      </button>

      <button
        type="button"
        onClick={() => onChange("bundle")}
        className={[
          "h-[40px] rounded-xl px-5 text-[13px] font-semibold transition",
          value === "bundle"
            ? "bg-[#16A3A3] text-white"
            : "border border-[#16A3A3] text-[#16A3A3] hover:bg-[#16A3A3]/10",
        ].join(" ")}
      >
        Dokumen Bundel
      </button>
    </div>
  );
}
