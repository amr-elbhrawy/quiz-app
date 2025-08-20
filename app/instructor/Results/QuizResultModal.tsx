"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import CustomPagination from "@/app/components/shared/CustomPagination";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";
import { useAppSelector } from "@/store/hooks";

interface QuizResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  quizTitle: string;
}

interface QuizResult {
  _id: string;
  title: string;
  score: number;
  totalScore: number;
  percentage: number;
  date: string;
}

export default function QuizResultModal({ isOpen, onClose, quizId, quizTitle }: QuizResultModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { result: resultsFromStore, loading } = useAppSelector((state) => state.quiz);

  const allResults = useMemo<QuizResult[]>(() => {
    if (!resultsFromStore) return [];

    return resultsFromStore
      .filter((item: any) => item.quiz?._id === quizId)
      .map((item: any) => {
        const totalScore = item.quiz.questions_number * item.quiz.score_per_question;
        const userScore = item.participants?.[0]?.score ?? 0;
        const percentage = totalScore > 0 ? Math.round((userScore / totalScore) * 100) : 0;

        return {
          _id: item.quiz._id,
          title: item.quiz.title,
          score: userScore,
          totalScore,
          percentage,
          date: item.quiz.closed_at || item.quiz.createdAt,
        };
      });
  }, [resultsFromStore, quizId]);

  const { currentResults, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return {
      currentResults: allResults.slice(startIndex, startIndex + itemsPerPage),
      totalPages: Math.ceil(allResults.length / itemsPerPage),
    };
  }, [allResults, currentPage, itemsPerPage]);

  useEffect(() => {
    if (isOpen) setCurrentPage(1);
  }, [isOpen]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-results-title"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-5xl rounded-2xl shadow-xl p-6 relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close results modal"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
          onClick={onClose}
        >
          <HiOutlineXMark className="w-6 h-6" />
        </button>

        <h2 id="quiz-results-title" className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          {quizTitle} Results <span className="text-gray-500 text-lg ml-2">({allResults.length})</span>
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <LoadingSkeletonCard key={i} />
            ))}
          </div>
        ) : allResults.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No quiz results found for this quiz.</p>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full border-collapse text-sm sm:text-base">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-center">Score</th>
                    <th className="px-4 py-3 text-center">Percentage</th>
                    <th className="px-4 py-3 text-center">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentResults.map((result) => (
                    <tr key={result._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-2">{result.title}</td>
                      <td className="px-4 py-2 text-center">
                        {result.score} / {result.totalScore}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.percentage >= 80
                              ? "bg-green-100 text-green-800"
                              : result.percentage >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">{new Date(result.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 self-center">
                <CustomPagination totalPages={totalPages} page={currentPage} setPage={handlePageChange} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
