export const ActionButtons = () => {
  return (
    <div className="flex flex-col gap-4">
      <button className="flex flex-col items-center justify-center w-48 h-40 border border-gray-300 rounded-lg hover:shadow-md">
        <div className="text-4xl">⏱️</div>
        <span className="mt-2 font-medium">Set up a new quiz</span>
      </button>

      <button className="flex flex-col items-center justify-center w-48 h-40 border border-gray-300 rounded-lg hover:shadow-md">
        <div className="text-4xl">📦</div>
        <span className="mt-2 font-medium">Question Bank</span>
      </button>
    </div>
  );
};
