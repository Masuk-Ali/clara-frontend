/**
 * TabNavigation Component
 * Reusable tab navigation component
 */
export default function TabNavigation({ 
  tabs = [], 
  activeTab = null, 
  onTabChange = () => {},
  variant = 'default'
}) {
  const variants = {
    default: 'border-blue-500 text-blue-600',
    underline: 'border-gray-600 text-gray-900',
  };

  const activeVariant = variants[variant] || variants.default;

  return (
    <div className="bg-white border-b">
      <div className="flex space-x-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.available === false;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              disabled={isDisabled}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                isActive && !isDisabled
                  ? `border-b-2 ${activeVariant}`
                  : isDisabled
                  ? 'border-transparent text-gray-300 cursor-not-allowed'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
