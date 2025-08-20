"use client";
import React from "react";

const HelpModal = React.memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full relative cursor-pointer" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-lg font-semibold mb-3">Help Video</h2>
        <video className="w-full rounded-lg" controls autoPlay>
          <source src="/HELP.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
});

HelpModal.displayName = "HelpModal";

export default HelpModal;