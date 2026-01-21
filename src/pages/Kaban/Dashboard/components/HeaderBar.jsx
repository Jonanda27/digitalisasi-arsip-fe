import SearchBar from "./SearchBar";
import ProfileBadge from "./ProfileBadge";

export default function HeaderBar() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <div className="mt-4 max-w-[520px]">
          <SearchBar placeholder="Cari dokumen" />
        </div>
      </div>

      <div className="lg:pt-1">
        <ProfileBadge />
      </div>
    </div>
  );
}
