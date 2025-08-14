export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-auto">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        <span className="text-xl font-semibold text-white">Cargando...</span>
      </div>
    </div>
  );
}
