// CompletedQuizzes.tsx - Redux Version
"use client";
import { useEffect, useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  FaCheck, FaUsers, FaTrophy } from "react-icons/fa";
import { fetchCompletedQuizzes } from "@/store/features/quiz/quizSlice";
import type { RootState, AppDispatch } from "@/store/store";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

interface CompletedQuiz {
  title: string;
  group: string;
  persons: number;
  date: string;
  score?: number;
}

// Memoized Table Row Component
const TableRow = memo(({ quiz, index }: { quiz: CompletedQuiz; index: number }) => (
  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
    <td className="p-2 truncate max-w-0">{quiz.title}</td>
    <td className="p-2 truncate max-w-0">{quiz.group}</td>
    <td className="p-2">{quiz.persons}</td>
    <td className="p-2">{quiz.date}</td>
    {quiz.score !== undefined && (
      <td className="p-2">
        <div className="flex items-center gap-1 text-green-600">
          <FaTrophy className="text-xs" />
          {quiz.score}%
        </div>
      </td>
    )}
  </tr>
));

TableRow.displayName = "TableRow";

export const CompletedQuizzes = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { completed: quizzes, loading } = useSelector((state: RootState) => state.quiz);
  const [showAll, setShowAll] = useState(false);

  // Process completed quiz data
  const processCompletedData = useCallback((data: any[]): CompletedQuiz[] => {
    if (!Array.isArray(data)) return [];
    
    return data.map((item: any, i: number) => ({
      title: item.title || `Quiz ${i + 1}`,
      group: typeof item.group === "string"
        ? item.group
        : item.group?.name || "No Group",
      persons: Array.isArray(item.participants)
        ? item.participants.length
        : item.participants || 0,
      date: item.closed_at
        ? new Date(item.closed_at).toLocaleDateString("en-US")
        : new Date(item.createdAt).toLocaleDateString("en-US"),
      score: item.score // If available
    }));
  }, []);

  const processedQuizzes = processCompletedData(quizzes || []);
  const displayedQuizzes = showAll ? processedQuizzes : processedQuizzes.slice(0, 5);
  const hasMoreQuizzes = processedQuizzes.length > 5;

  useEffect(() => {
    dispatch(fetchCompletedQuizzes());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchCompletedQuizzes());
  }, [dispatch]);

  const toggleShowAll = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  if (loading) {
    return <LoadingSkeletonCard variant="table" count={5} />;
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Completed Quizzes</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {displayedQuizzes.length} of {processedQuizzes.length}
          </span>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Refresh"
          >
           </button>
        </div>
      </div>
      
      {processedQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <FaCheck className="mx-auto text-4xl mb-2 text-gray-300" />
          <p className="text-gray-500">No completed quizzes found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Group name</th>
                  <th className="p-2 text-left">Persons</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {displayedQuizzes.map((quiz, index) => (
                  <TableRow key={index} quiz={quiz} index={index} />
                ))}
              </tbody>
            </table>
          </div>
          
          {hasMoreQuizzes && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <button
                onClick={toggleShowAll}
                className="px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
              >
                {showAll ? "Show Less" : `Show More (${processedQuizzes.length - 5} more)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

CompletedQuizzes.displayName = 'CompletedQuizzes';