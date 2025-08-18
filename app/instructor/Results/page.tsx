"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchQuizResult } from "@/store/features/quiz/quizSlice";
import CustomPagination from "@/app/components/shared/CustomPagination";
import QuizResultModal from "./QuizResultModal";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

interface QuizResult {
  _id: string;
  title: string;
  group: {
    name: string;
    members: number;
  };
  participants: number;
  date: string;
}

// ✅ memo مع تحسين أداء الأكورديون
const QuizResultAccordion = React.memo(function QuizResultAccordion({ 
  result, 
  onView 
}: { 
  result: QuizResult; 
  onView: (result: QuizResult) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);
  const handleViewClick = useCallback(() => onView(result), [result, onView]);

  // ✅ تحسين الأنيميشن
  const maxHeight = isOpen ? 'auto' : '0px';
  const opacity = isOpen ? 'opacity-100' : 'opacity-0';

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold truncate pr-2">{result.title}</span>
        <FaChevronDown className={`text-orange-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`bg-gray-50 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden`}
      >
        <div ref={contentRef} className={`px-4 py-3 space-y-2 transition-opacity duration-200 ${opacity}`}>
          <p><span className="font-semibold">Group: </span>{result.group.name}</p>
          <p>
            <span className="font-semibold">Members: </span>
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {result.group.members} persons
            </span>
          </p>
          <p>
            <span className="font-semibold">Participants: </span>
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              {result.participants}
            </span>
          </p>
          <p><span className="font-semibold">Date: </span>{result.date}</p>

          <button
            className="bg-[#9BBE3F] hover:bg-[#8AA835] text-white px-4 py-2 rounded text-sm transition-colors mt-4"
            onClick={handleViewClick}
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
});

export default function QuizResultsTable() {
  const dispatch = useAppDispatch();
  const { result: resultsFromStore, loading, error } = useAppSelector((state) => state.quiz);

  const [page, setPage] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState<{ id: string; title: string } | null>(null);

  const itemsPerPage = 5;

  // ✅ جلب البيانات مرة واحدة فقط
  useEffect(() => {
    if (!resultsFromStore && !loading) {
      dispatch(fetchQuizResult());
    }
  }, [dispatch, resultsFromStore, loading]);

  // ✅ تحويل البيانات مع useMemo لتجنب المعالجة المتكررة
  const formattedResults: QuizResult[] = useMemo(() => {
    if (!resultsFromStore) return [];
    
    // تجميع النتائج حسب الكويز لتجنب التكرار
    const uniqueQuizzes = new Map();
    
    resultsFromStore.forEach((item: any) => {
      const quizId = item.quiz?._id || item._id;
      if (!uniqueQuizzes.has(quizId)) {
        uniqueQuizzes.set(quizId, {
          _id: quizId,
          title: item.quiz?.title || "Untitled Quiz",
          group: { 
            name: item.group?.name || "Unknown Group", 
            members: item.group?.members || 0 
          },
          participants: Array.isArray(item.participants) ? item.participants.length : 0,
          date: new Date(item.quiz?.createdAt || Date.now()).toLocaleDateString("en-GB"),
        });
      }
    });
    
    return Array.from(uniqueQuizzes.values());
  }, [resultsFromStore]);

  // ✅ تحسين الـ pagination
  const { currentData, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      currentData: formattedResults.slice(startIndex, endIndex),
      totalPages: Math.ceil(formattedResults.length / itemsPerPage)
    };
  }, [formattedResults, page, itemsPerPage]);

  const handleViewClick = useCallback((result: QuizResult) => {
    setSelectedQuiz({ id: result._id, title: result.title });
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedQuiz(null);
  }, []);

  // ✅ تحسين معالجة حالات التحميل والخطأ
  if (loading && !resultsFromStore) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded mb-6"></div>
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <LoadingSkeletonCard key={i} height="80px" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          Error loading quiz results: {error}
        </div>
      </div>
    );
  }

  if (!formattedResults.length) {
    return (
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-6">Quiz Results</h2>
        <div className="text-gray-500 text-center py-8">
          No quiz results found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl font-bold mb-6">Quiz Results</h2>

      {/* Mobile View */}
      <div className="block lg:hidden space-y-3">
        {currentData.map(result => (
          <QuizResultAccordion 
            key={result._id} 
            result={result} 
            onView={handleViewClick} 
          />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border rounded-lg shadow-sm">
          <thead className="bg-[#0D1321] text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Group</th>
              <th className="p-3 text-left">Members</th>
              <th className="p-3 text-left">Participants</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(result => (
              <tr key={result._id} className="hover:bg-gray-50 border-b transition-colors">
                <td className="p-3 truncate max-w-xs">{result.title}</td>
                <td className="p-3">{result.group.name}</td>
                <td className="p-3">{result.group.members}</td>
                <td className="p-3">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {result.participants}
                  </span>
                </td>
                <td className="p-3">{result.date}</td>
                <td className="p-3">
                  <button 
                    className="bg-[#9BBE3F] hover:bg-[#8AA835] text-white px-3 py-1 rounded text-sm transition-colors" 
                    onClick={() => handleViewClick(result)}
                  >
                    View
                  </button>
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
          page={page} 
          setPage={handlePageChange} 
          className="mt-6"
        />
      )}

      {/* Modal */}
      {selectedQuiz && (
        <QuizResultModal
          isOpen={!!selectedQuiz}
          onClose={handleCloseModal}
          quizId={selectedQuiz.id}
          quizTitle={selectedQuiz.title}
        />
      )}
    </div>
  );
}