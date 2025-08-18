// UpcomingQuizzes.tsx - Redux Version
"use client";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import { fetchIncomingQuizzes } from "@/store/features/quiz/quizSlice";
import type { RootState, AppDispatch } from "@/store/store";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

interface UpcomingQuizzesProps {
  onOpenQuiz: (id: string) => void;
  onJoin?: (quizId: string) => void;
  refreshTrigger?: number;
}

// Quiz images as constants
const QUIZ_IMAGES = {
  FE: "/icons/fe-quiz.svg",
  BE: "/icons/be-quiz.svg", 
  default: "/icons/default-quiz.svg"
} as const;

// Memoized Quiz Card Component
const QuizCard = memo(({ quiz, role, onAction }: {
  quiz: any;
  role: string;
  onAction: (quizId: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onAction(quiz._id);
  }, [quiz._id, onAction]);

  const isStudent = role?.toLowerCase() === "student";
  const buttonColor = isStudent ? "text-blue-600" : "text-green-600";
  const buttonText = isStudent ? "Join" : "Open";
  
  const getQuizImage = (type: string): string => {
    return QUIZ_IMAGES[type as keyof typeof QUIZ_IMAGES] || QUIZ_IMAGES.default;
  };
  
  const displayDate = quiz.schadule ? new Date(quiz.schadule).toLocaleDateString("en-US") : "No Date";
  const displayTime = quiz.schadule ? new Date(quiz.schadule).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }) : "No Time";

  return (
    <div className="flex items-center gap-4 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 hover:shadow-sm transition-all duration-200">
      <div className="w-20 h-20 bg-orange-100 rounded-lg flex items-center justify-center overflow-hidden relative">
        <Image
          src={getQuizImage(quiz.type)}
          alt={quiz.title}
          width={80}
          height={80}
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{quiz.title}</h3>
        <p className="text-sm text-gray-500">
          {displayDate} │ {displayTime}
        </p>
        <p className="text-sm text-gray-500">
          Students: {quiz.participants ?? 0}
        </p>
        <p className="text-xs text-blue-600 font-medium">
          Status: {quiz.status || "active"}
        </p>
      </div>
      <button
        onClick={handleClick}
        className={`flex items-center font-medium hover:underline hover:scale-105 transition-all ${buttonColor}`}
      >
        {buttonText}
        <FaArrowRight className="ml-1" />
      </button>
    </div>
  );
});

QuizCard.displayName = "QuizCard";

export const UpcomingQuizzes = memo(({ onOpenQuiz, onJoin, refreshTrigger }: UpcomingQuizzesProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((state: RootState) => state.auth.user?.role, shallowEqual);
  const { incoming: quizzes, loading } = useSelector((state: RootState) => state.quiz, shallowEqual);
  
  const [showAll, setShowAll] = useState(false);

  // Fetch quizzes on mount and when refreshTrigger changes
  useEffect(() => {
    dispatch(fetchIncomingQuizzes());
  }, [dispatch, refreshTrigger]);

  // Helper function to check if quiz is incoming/upcoming
  const isIncomingQuiz = useCallback((quiz: any): boolean => {
    if (!quiz.schadule) return true;
    
    const scheduleDate = new Date(quiz.schadule);
    const now = new Date();
    
    if (isNaN(scheduleDate.getTime())) return true;
    
    return scheduleDate >= now;
  }, []);

  // Filter and process quizzes
  const processedQuizzes = useMemo(() => {
    if (!Array.isArray(quizzes)) return [];
    
    return quizzes
      .filter(isIncomingQuiz)
      .sort((a: any, b: any) => {
        const dateA = new Date(a.schadule || a.createdAt || 0);
        const dateB = new Date(b.schadule || b.createdAt || 0);
        return dateA.getTime() - dateB.getTime();
      });
  }, [quizzes, isIncomingQuiz]);

  // Memoized displayed quizzes
  const displayedQuizzes = useMemo(() => 
    showAll ? processedQuizzes : processedQuizzes.slice(0, 5), 
    [processedQuizzes, showAll]
  );

  const hasMoreQuizzes = processedQuizzes.length > 5;

  // Action handlers
  const handleAction = useCallback((quizId: string) => {
    if (role?.toLowerCase() === "student") {
      onJoin?.(quizId);
    } else {
      onOpenQuiz(quizId);
    }
  }, [role, onJoin, onOpenQuiz]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchIncomingQuizzes());
  }, [dispatch]);

  const toggleShowAll = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  if (loading) {
    return <LoadingSkeletonCard variant="list" count={3} />;
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Upcoming Quizzes</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {displayedQuizzes.length} of {processedQuizzes.length}
          </span>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Refresh"
          >
           </button>
        </div>
      </div>

      {processedQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📝</div>
          <p className="text-gray-500">No upcoming quizzes found</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {displayedQuizzes.map((quiz, i) => (
              <QuizCard
                key={`${quiz._id}-${i}`}
                quiz={quiz}
                role={role}
                onAction={handleAction}
              />
            ))}
          </div>

          {hasMoreQuizzes && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <button
                onClick={toggleShowAll}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
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

UpcomingQuizzes.displayName = 'UpcomingQuizzes';