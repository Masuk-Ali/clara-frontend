export default function DashboardCard({
  title,
  description,
  icon,
  onClick,
  children,
  variant = "default",
}) {
  const variants = {
    default: "bg-white hover:shadow-lg",
    primary: "bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg",
    success: "bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg",
    warning: "bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg",
  };

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl shadow-md cursor-pointer transition transform hover:scale-105 ${variants[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {icon && (
            <div className="mb-3 p-2 bg-white rounded-lg w-fit text-3xl">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          )}
        </div>
        <span className="text-2xl text-gray-400">→</span>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
