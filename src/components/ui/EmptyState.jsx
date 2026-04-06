/**
 * EmptyState Component
 * Reusable component for displaying empty states
 */
export default function EmptyState({ 
  emoji = '📭', 
  title = 'Nothing here', 
  message = 'No items to display',
  action = null,
  actionLabel = 'Action'
}) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
      <div className="text-4xl mb-3">{emoji}</div>
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-gray-600 text-sm mt-2">{message}</p>
      {action && (
        <button
          onClick={action}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
