const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-400 font-medium">Loading profile...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
