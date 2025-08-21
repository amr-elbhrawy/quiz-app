"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import dynamic from 'next/dynamic';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import HelpModal from "../Help/HelpModal";
import MyQuizResults from "@/app/learner/MyQuizResults/MyQuizResults";
import { Home } from "@/app/instructor/Quizzes/Home";

// Lazy load heavy components 
const Students = dynamic(() => import("@/app/instructor/students/page"), {
  loading: () => <OptimizedSkeleton />
});
const Groups = dynamic(() => import("@/app/instructor/group/GroupsList"), {
  loading: () => <OptimizedSkeleton />
});
const Quizzes = dynamic(() => import("@/app/instructor/Quizzes/page"), {
  loading: () => <OptimizedSkeleton />
});
const QuizzesTable = dynamic(() => import("@/app/instructor/Quizzes/QuizzesTable"), {
  loading: () => <OptimizedSkeleton />
});

const JoinQuiz = dynamic(() => import("@/app/learner/JoinQuiz/page"), {
  loading: () => <OptimizedSkeleton />
});
const UpcomingQuizzes = dynamic(() => 
  import("@/app/instructor/Quizzes/UpcomingQuizzes").then(mod => mod.UpcomingQuizzes), {
  loading: () => <OptimizedSkeleton />
});
const QuizDetails = dynamic(() => import("@/app/instructor/Quizzes/QuizDetails"), {
  loading: () => <OptimizedSkeleton />
});
const Questions = dynamic(() => import("@/app/instructor/Questions/page"), {
  loading: () => <OptimizedSkeleton />
});
const SolveQuestionModal = dynamic(() => import("@/app/learner/JoinQuiz/SolveQuestionModal"), {
  loading: () => null
});
const ScoreModal = dynamic(() => import("@/app/learner/JoinQuiz/ScoreModal"), {
  loading: () => null
});
const QuizResultsTable = dynamic(() => import("@/app/instructor/Results/page"), {
  loading: () => <OptimizedSkeleton />
});

// Optimized Skeleton Component
const OptimizedSkeleton = () => (
  <div className="animate-pulse space-y-4 p-6">
    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

interface DashboardState {
  loadingUser: boolean;
  role: string | undefined;
  user: any;
}

function DashboardLayout() {
  const [active, setActive] = useState("Dashboard");
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  const [solveQuizId, setSolveQuizId] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalTotal, setFinalTotal] = useState<number | null>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Optimized selectors - 
  const { loadingUser, role, user }: DashboardState = useSelector(
    (state: any) => ({
      loadingUser: state.auth.loadingUser,
      role: state.auth.user?.role?.toLowerCase(),
      user: state.auth.user
    }),
    shallowEqual  
  );

  const handleStartQuiz = useCallback((quizId: string) => {
    setSolveQuizId(quizId);
    setIsSolveModalOpen(true);
  }, []);

  const handleQuizSelect = useCallback((quizId: string) => {
    setSelectedQuizId(quizId);
    setActive("QuizDetails");
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setActive("Dashboard");
    setSelectedQuizId(null);
  }, []);

  const handleFinishQuiz = useCallback((score: number, total: number) => {
    setFinalScore(score);
    setFinalTotal(total);
    setIsSolveModalOpen(false);
    setIsScoreModalOpen(true);
  }, []);

  const handleHelp = useCallback(() => {
    setIsHelpModalOpen(true);
  }, []);

  const handleCloseHelpModal = useCallback(() => {
    setIsHelpModalOpen(false);
  }, []);

  useEffect(() => {
    if (role && !loadingUser) setActive("Dashboard");
  }, [role, loadingUser]);

  // Memoized instructor content
  const instructorContent = useMemo(() => {
    switch (active) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
            <UpcomingQuizzes onOpenQuiz={handleQuizSelect} />
          </div>
        );
      case "QuizDetails":
        return selectedQuizId ? (
          <QuizDetails quizId={selectedQuizId} onBack={handleBackToDashboard} />
        ) : null;
      case "Students":
        return <Students />;
      case "Groups":
        return <Groups />;
      case "Quizzes":
         return (
          <Home setActive={setActive} />
        );
      case "AllQuizzes":
         return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">All Quizzes</h1>
              <button
                onClick={() => setActive("Quizzes")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ← Back to Quizzes
              </button>
            </div>
            <QuizzesTable />
          </div>
        );

      case "Questions":
        return <Questions />;
      case "Results":
        return <QuizResultsTable />;
      default:
        return (
          <div className="p-6 text-center text-gray-500">
            Instructor Page - {active}
          </div>
        );
    }
  }, [active, selectedQuizId, handleQuizSelect, handleBackToDashboard]);


  // Memoized student content
  const studentContent = useMemo(() => {
    switch (active) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UpcomingQuizzes onJoin={handleStartQuiz} />
              <div className="border border-gray-300 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                <p className="text-sm text-gray-600">
                  Welcome {user?.name || "Student"}
                </p>
                <p className="text-sm text-gray-600">
                  Group: {user?.group?.name || "Not Assigned"}
                </p>
              </div>
            </div>
          </div>
        );
      case "JoinQuiz":
        return <JoinQuiz onSolveQuiz={handleStartQuiz} />;
        case "Results":
  return <MyQuizResults />;

      default:
        return (
          <div className="p-6 text-center text-gray-500">
            Student Page - {active}
          </div>
        );
    }
  }, [active, handleStartQuiz, user]);

  // Main content renderer
  const renderContent = useMemo(() => {
    if (loadingUser) {
      return (
        <div className="flex items-center justify-center h-64">
          <OptimizedSkeleton />
        </div>
      );
    }
    
    if (!user || !role) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-gray-600">Access Denied</p>
            <p className="text-sm text-gray-400 mt-2">Please log in first</p>
          </div>
        </div>
      );
    }

    if (role === "student") return studentContent;
    if (["teacher", "instructor"].includes(role)) return instructorContent;

    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-orange-500 text-4xl mb-4">🔒</div>
          <p className="text-gray-600">Unknown role: {role}</p>
          <p className="text-sm text-gray-400 mt-2">
            Please contact the administrator
          </p>
        </div>
      </div>
    );
  }, [loadingUser, user, role, instructorContent, studentContent]);

  return (
    <div className="flex h-screen w-full max-w-full overflow-hidden">
      <Sidebar
        active={active}
        setActive={setActive}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onHelp={handleHelp}
      />
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} active={active} />
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 bg-gray-50">
          {renderContent}
        </main>
      </div>

      {isSolveModalOpen && solveQuizId && (
        <SolveQuestionModal
          quizId={solveQuizId}
          onClose={() => {
            setIsSolveModalOpen(false);
            setSolveQuizId(null);
          }}
          onFinish={handleFinishQuiz}
        />
      )}

      {isScoreModalOpen && finalScore !== null && finalTotal !== null && (
        <ScoreModal
          score={finalScore}
          total={finalTotal}
          onClose={() => setIsScoreModalOpen(false)}
        />
      )}

      <HelpModal isOpen={isHelpModalOpen} onClose={handleCloseHelpModal} />
    </div>
  );
}

export default React.memo(DashboardLayout);