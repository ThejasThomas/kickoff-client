const OwnerEarnings = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-10 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Owner Earnings
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Earnings data is not available yet.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 font-medium">
            Earnings will be updated soon
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Please check back later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerEarnings;
