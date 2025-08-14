"use client";
import React from "react";
import { HiOutlineXMark } from "react-icons/hi2";

export default function ScoreModal({
  score,
  total,
  onClose,
}: {
  score: number;
  total: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[95%] sm:w-[400px] max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 p-4">
          <h2 className="text-lg font-bold">Your Score</h2>
          <button
            onClick={onClose}
            title="Close"
            className="cursor-pointer flex items-center justify-center w-10 h-10 border border-gray-300 hover:text-gray-800 transition-colors rounded"
          >
            <HiOutlineXMark size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-2xl font-bold text-green-600 mb-6">
            {score} / {total}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
