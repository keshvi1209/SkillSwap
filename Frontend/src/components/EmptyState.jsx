const EmptyState = ({ icon, title, description }) => {
  return (
    <div className="text-center py-16 text-gray-400">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-700/30 rounded-2xl mb-4">
        {icon}
      </div>
      <p className="text-lg font-semibold text-gray-300">{title}</p>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default EmptyState;