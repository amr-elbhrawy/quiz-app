"use client";
import React, { useEffect, useState } from "react";
import { QuizService } from "@/services/quiz.service";
import { HiOutlineXMark } from "react-icons/hi2";
import CustomPagination from "@/app/components/shared/CustomPagination"; // تأكد من المسار

interface QuizResultModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}: QuizResultModalProps) {
  const [loading, setLoading] = useState(false);
  const [allResults, setAllResults] = useState<QuizResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isOpen && allResults.length === 0) { // فقط لو البيانات مش موجودة
      setLoading(true);
      QuizService.getResult()
        .then((res) => {
          const formattedResults = res.data.map((item: any) => {
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

          setAllResults(formattedResults);
        })
        .catch((err) => {
          console.error("❌ Error fetching quiz results:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, allResults.length]);

  // حساب البيانات للصفحة الحالية
  const totalPages = Math.ceil(allResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResults = allResults.slice(startIndex, startIndex + itemsPerPage);

  // إعادة تعيين الصفحة عند إغلاق وفتح المودال
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-lg p-6 relative max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 z-10 cursor-pointer"
          onClick={onClose}
        >
          <HiOutlineXMark className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Quiz Results ({allResults.length})</h2>

        {loading ? (
          <p className="text-gray-500">Loading results...</p>
        ) : allResults.length === 0 ? (
          <p className="text-gray-500">No quiz results found.</p>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Table */}
            <div className="flex-1 overflow-auto mb-4">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                      Title
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                      Score
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                      Percentage
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentResults.map((result, index) => (
                    <tr key={result._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        {result.title}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                        {result.score} / {result.totalScore}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                        {result.percentage}%
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                        {new Date(result.date).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <CustomPagination
                totalPages={totalPages}
                page={currentPage}
                setPage={setCurrentPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}