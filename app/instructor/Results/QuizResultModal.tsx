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

export default function QuizResultModal({ 
  isOpen, 
  onClose, 
  quizId, 
  quizTitle 
}: QuizResultModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ استخدام البيانات من Redux بدلاً من API call جديد
  const { result: resultsFromStore, loading } = useAppSelector(state => state.quiz);

  // ✅ تحويل البيانات مرة واحدة مع useMemo
  const allResults = useMemo((): QuizResult[] => {
    if (!resultsFromStore) return [];
    
    return resultsFromStore
      .filter((item: any) => item.quiz?._id === quizId) // تصفية للكويز المحدد
      .map((item: any) => {
        const totalScore = item.quiz.questions_number * item.quiz.score_per_question;
        const userScore = item.participants?.[0]?.score || 0;
        const percentage = totalScore > 0 ? Math.round((userScore / totalScore) * 100) : 0;
        
        return {
          _id: item.quiz._id,
          title: item.quiz.title,
          score: userScore,
          totalScore: totalScore,
          percentage: percentage,
          date: item.quiz.closed_at || item.quiz.createdAt
        };
      });
  }, [resultsFromStore, quizId]);

  // ✅ حساب البيانات الحالية مع useMemo
  const { currentResults, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return {
      currentResults: allResults.slice(startIndex, startIndex + itemsPerPage),
      totalPages: Math.ceil(allResults.length / itemsPerPage)
    };
  }, [allResults, currentPage, itemsPerPage]);

  // ✅ إعادة تعيين الصفحة عند فتح المودال
  useEffect(() => {
    if (isOpen) setCurrentPage(1);
  }, [isOpen]);

  // ✅ مemo للـ pagination handler
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-lg p-6 relative max-h-[90vh] overflow-hidden flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 z-10 cursor-pointer"
          onClick={onClose}
        >
          <HiOutlineXMark className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {quizTitle} Results ({allResults.length})
        </h2>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <LoadingSkeletonCard key={i} />
            ))}
          </div>
        ) : allResults.length === 0 ? (
          <p className="text-gray-500">No quiz results found for this quiz.</p>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto mb-4">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Title</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Score</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Percentage</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentResults.map((result, index) => (
                    <tr key={result._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{result.title}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                        {result.score} / {result.totalScore}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-sm ${
                          result.percentage >= 80 ? 'bg-green-100 text-green-800' :
                          result.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {result.percentage}%
                        </span>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                        {new Date(result.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <CustomPagination 
                totalPages={totalPages} 
                page={currentPage} 
                setPage={handlePageChange} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}