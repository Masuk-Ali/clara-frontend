/**
 * ErrorMessage Component
 * Reusable error display with optional retry button
 */
export default function ErrorMessage({ 
  title = 'Error', 
  message = 'Something went wrong', 
  onRetry = null,
  variant = 'error' 
}) {
  const variants = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`p-6 rounded-lg border text-center ${variants[variant]}`}>
      <p className="font-semibold">{title}</p>
      <p className="text-sm mt-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
