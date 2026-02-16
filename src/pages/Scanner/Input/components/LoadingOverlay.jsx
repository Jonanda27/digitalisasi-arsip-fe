export default function LoadingOverlay({
  show,
  text = "Mengupload dokumen...",
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[380px] h-[260px] flex flex-col items-center justify-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />

        {/* Text */}
        <p className="text-sm font-medium text-gray-600 text-center">
          {text}
        </p>
      </div>
    </div>
  );
}
