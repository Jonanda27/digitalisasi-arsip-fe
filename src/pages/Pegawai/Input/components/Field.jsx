import React from "react";

export default function Field({
  label,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  type = "text",
  rightSlot = null,
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[11px] font-semibold text-slate-700">
        {label}
      </div>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={[
            "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5",
            "text-[12px] text-slate-700 outline-none transition",
            disabled ? "bg-slate-50 text-slate-400" : "focus:border-[#1F5EFF] focus:ring-4 focus:ring-blue-100",
            rightSlot ? "pr-10" : "",
          ].join(" ")}
        />
        {rightSlot ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        ) : null}
      </div>
    </label>
  );
}
