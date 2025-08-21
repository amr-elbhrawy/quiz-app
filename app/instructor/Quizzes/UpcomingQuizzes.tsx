 
"use client";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { FaArrowRight, FaSync, FaCalendarAlt, FaUsers, FaClock } from "react-icons/fa";
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
  // FE: "/icons/fe-quiz.svg",
  // BE: "/icons/be-quiz.svg", 
  default: "/QUIZ.png"
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
  const buttonColor = isStudent ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700";
  const buttonText = isStudent ? "Join Quiz" : "Open Quiz";
  
  const getQuizImage = (type: string): string => {
    return QUIZ_IMAGES[type as keyof typeof QUIZ_IMAGES] || QUIZ_IMAGES.default;
  };
  
  const displayDate = quiz.schadule ? new Date(quiz.schadule).toLocaleDateString("en-US", {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }) : "No Date";
  
  const displayTime = quiz.schadule ? new Date(quiz.schadule).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }) : "No Time";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:shadow-md transition-all duration-300">
      <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
        <Image
          src={getQuizImage(quiz.type)}
          alt={quiz.title}
          width={64}
          height={64}
          className="object-contain"
          loading="lazy"
        />
      </div>
      
      <div className="flex-1 min-w-0 w-full">
        <h3 className="font-semibold text-lg mb-1 truncate">{quiz.title}</h3>
        
        <div className="flex flex-wrap gap-3 mb-2">
          <div className="flex items-center text-sm text-gray-500">
            <FaCalendarAlt className="mr-1 text-blue-500" />
            <span>{displayDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaClock className="mr-1 text-blue-500" />
            <span>{displayTime}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaUsers className="mr-1 text-blue-500" />
            <span>{quiz.participants ?? 0} Students</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${
            (quiz.status === 'active' || !quiz.status) 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {quiz.status || "Active"}
          </span>
        </div>
      </div>
      
      <button
        onClick={handleClick}
        className={`flex items-center justify-center font-medium text-white px-4 py-2 rounded-lg transition-all ${buttonColor} self-center sm:self-auto w-full sm:w-auto`}
      >
        <span className="mr-2">{buttonText}</span>
        <FaArrowRight className="text-sm" />
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
    <div className="border border-gray-300 rounded-xl p-5 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <h2 className="text-xl font-bold text-gray-800">Upcoming Quizzes</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            Showing {displayedQuizzes.length} of {processedQuizzes.length}
          </span>
          <button
            onClick={handleRefresh}
            className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Refresh quizzes"
          >
            <FaSync />
          </button>
        </div>
      </div>

      {processedQuizzes.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-gray-300 text-5xl mb-3">📝</div>
          <p className="text-gray-500 font-medium">No upcoming quizzes scheduled</p>
          <p className="text-sm text-gray-400 mt-1">Check back later for new quizzes</p>
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
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <button
                onClick={toggleShowAll}
                className="px-5 py-2.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors font-medium inline-flex items-center"
              >
                {showAll ? (
                  <>Show Less</>
                ) : (
                  <>View All Quizzes ({processedQuizzes.length - 5} more)</>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

UpcomingQuizzes.displayName = 'UpcomingQuizzes';