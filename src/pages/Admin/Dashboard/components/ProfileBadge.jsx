export default function ProfileBadge() {
  return (
    <div className="flex items-center justify-end gap-3">
      <img
        src="https://i.pravatar.cc/80?img=12"
        alt="Profile"
        className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow"
      />
      <div className="text-left">
        <div className="text-sm font-semibold text-slate-900">
          Fahrizal Mudzaqi Maulana
        </div>
        <div className="text-xs text-slate-500">199203222019032005</div>
        <div className="text-xs text-slate-500">Kepala Badan</div>
      </div>
    </div>
  );
}
