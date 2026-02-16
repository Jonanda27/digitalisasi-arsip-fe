import { CheckCircle } from "lucide-react";

export default function SuccessModal({
  show,
  title = "Upload Berhasil",
  message = "Dokumen berhasil diunggah.",
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[380px] h-[260px] flex flex-col items-center justify-center text-center">
        <CheckCircle size={56} className="text-green-600" />

        <h3 className="mt-4 text-lg font-semibold">{title}</h3>

        <p className="mt-2 text-sm text-gray-500">{message}</p>

        <button
          onClick={onClose}
          className="mt-6 w-[240px] h-[42px] rounded-xl bg-green-600 text-white text-sm hover:bg-green-700"
        >
          OK
        </button>
      </div>
    </div>
  );
}
