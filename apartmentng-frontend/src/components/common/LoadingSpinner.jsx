const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-600 font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;