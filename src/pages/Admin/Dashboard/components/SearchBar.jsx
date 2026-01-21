import searchSvg from "../icons/pencarian.svg";

export default function SearchBar({ placeholder = "Cari dokumen" }) {
  return (
    <div className="relative w-full">
      <input
        placeholder={placeholder}
        className="
          w-full
          h-[36px]
          rounded-[32px]
          bg-white
          pl-6 pr-[84px]
          text-sm
          leading-[36px]        
          py-0                    
          text-slate-700
          placeholder:text-slate-400
          shadow-sm
          outline-none
          ring-1 ring-slate-200
          focus:ring-2 focus:ring-blue-200
        "
      />

      <button
        type="button"
        aria-label="Search"
        className="
          absolute right-0 top-0
          h-[36px]
          w-[80px]
          rounded-full
          overflow-hidden
          flex items-center justify-center
        "
      >
        <img
          src={searchSvg}
          alt=""
          draggable="false"
          className="h-full w-full object-contain"
        />
      </button>
    </div>
  );
}
