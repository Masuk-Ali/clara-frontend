/**
 * LoadingSpinner Component
 * Reusable loading indicator with optional message
 */
export default function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClass}`}></div>
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  );
}
