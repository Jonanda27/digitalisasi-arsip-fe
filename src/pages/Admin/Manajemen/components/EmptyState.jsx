import ArsipActions from "./ArsipActions";
import ilustrasi from "../icons/gambar.svg";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-20 space-y-5">
      {/* Ilustrasi */}
      <img
        src={ilustrasi}
        alt="Empty Arsip"
        className="w-72 max-w-full"
      />

      <p className="text-gray-600">
        Belum ada folder atau file apapun disini.
      </p>

      <ArsipActions />
    </div>
  );
}
