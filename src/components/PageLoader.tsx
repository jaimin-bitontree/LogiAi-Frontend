interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({
  message = "Loading data...",
}: PageLoaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center gap-4 min-h-48">
      <div
        className="w-9 h-9 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
}
