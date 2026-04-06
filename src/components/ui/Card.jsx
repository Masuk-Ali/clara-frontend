/**
 * Card Component
 * Reusable card wrapper with consistent styling
 */
export default function Card({
  children,
  title = null,
  subtitle = null,
  footer = null,
  onClick = null,
  variant = 'default',
  className = ''
}) {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    elevated: 'bg-white border border-gray-200 shadow-lg',
    outlined: 'bg-transparent border-2 border-gray-300',
  };

  const variantClasses = variants[variant] || variants.default;

  return (
    <div
      onClick={onClick}
      className={`rounded-lg p-6 transition-all ${variantClasses} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}
