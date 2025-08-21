// Home.tsx - Fixed Props Type
"use client";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegClock, FaUsers } from "react-icons/fa";
import { GiSave } from "react-icons/gi";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { 
  fetchIncomingQuizzes, 
  clearError,
  clearSuccessMessage 
} from "@/store/features/quiz/quizSlice";
import type { RootState, AppDispatch } from "@/store/store";
import React from "react";

// Lazy load heavy components
const UpcomingQuizzes = dynamic(() => import("./UpcomingQuizzes").then(mod => ({ default: mod.UpcomingQuizzes })), {
  loading: () => <QuizListSkeleton />
});
const CompletedQuizzes = dynamic(() => import("./CompletedQuizzes").then(mod => ({ default: mod.CompletedQuizzes })), {
  loading: () => <QuizListSkeleton />
});
const CreateQuizModal = dynamic(() => import("./CreateQuizModal"), {
  loading: () => null
});
const QuizDetails = dynamic(() => import("./QuizDetails"), {
  loading: () => <QuizDetailsSkeleton />
});

//      Optimized skeletons
const QuizListSkeleton = memo(() => (
  <div className="border border-gray-300 rounded-lg p-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
));

const QuizDetailsSkeleton = memo(() => (
  <div className="p-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-32 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
));

//      Action Button Component
const ActionButton = memo(({ icon: Icon, title, onClick }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 hover:shadow-md hover:border-gray-400 transition-all duration-200 group"
  >
    <Icon className="text-4xl text-gray-800 group-hover:text-blue-600 transition-colors" />
    <span className="mt-2 font-medium text-lg text-center group-hover:text-blue-600 transition-colors">
      {title}
    </span>
  </button>
));

// FIXED: Updated type to match what's being passed from DashboardLayout
type HomeProps = {
  setActive: React.Dispatch<React.SetStateAction<string>>;
};

export default function Home({ setActive }: HomeProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const { 
    incoming: quizzes, 
    error, 
    successMessage 
  } = useSelector((state: RootState) => state.quiz);
  
  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  //      Fetch quizzes
  useEffect(() => {
    dispatch(fetchIncomingQuizzes());
  }, [dispatch]);

  //      Handle success messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, dispatch]);

  //      Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handlers
  const handleQuizCreated = useCallback(() => {
    toast.success("Quiz created successfully!");
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
    dispatch(fetchIncomingQuizzes());
  }, [dispatch]);

  const handleOpenQuiz = useCallback((id: string) => {
    setSelectedQuizId(id);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedQuizId(null);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleNavigateToQuestions = useCallback(() => {
    setActive("Questions");
  }, [setActive]);

  //      FIXED: Navigate to AllQuizzes instead of Quizzes
  const handleNavigateToQuizzes = useCallback(() => {
    setActive("AllQuizzes");
  }, [setActive]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchIncomingQuizzes());
    setRefreshTrigger(prev => prev + 1);
  }, [dispatch]);

  //      Action buttons
  const actionButtons = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <ActionButton
        icon={FaRegClock}
        title="Set up a new quiz"
        onClick={handleOpenModal}
      />
      <ActionButton
        icon={GiSave}
        title="Question Bank"
        onClick={handleNavigateToQuestions}
      />
      <ActionButton
        icon={FaUsers}
        title="All Quizzes"
        onClick={handleNavigateToQuizzes}
      />
    </div>
  ), [handleOpenModal, handleNavigateToQuestions, handleNavigateToQuizzes]);

  //      Quiz details view
  if (selectedQuizId) {
    return (
      <QuizDetails 
        quizId={selectedQuizId} 
        onBack={handleBackToList} 
      />
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/*      Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quiz Management</h1>
        <p className="text-gray-600 mt-1">Create, manage, and monitor your quizzes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {actionButtons}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <UpcomingQuizzes 
            onOpenQuiz={handleOpenQuiz}
            onJoin={handleOpenQuiz}
            refreshTrigger={refreshTrigger}
          />
          <CompletedQuizzes />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CreateQuizModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreated={handleQuizCreated}
        />
      )}
    </div>
  );
}