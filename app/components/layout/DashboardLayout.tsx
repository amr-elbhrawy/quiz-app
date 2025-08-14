"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import Students from "@/app/instructor/students/page";
import Groups from "@/app/instructor/group/GroupsList";
import Quizzes from "@/app/instructor/Quizzes/page";
import JoinQuiz from "@/app/learner/JoinQuiz/page";
import { UpcomingQuizzes } from "@/app/instructor/Quizzes/UpcomingQuizzes";
import QuizDetails from "@/app/instructor/Quizzes/QuizDetails";
import Questions from "@/app/instructor/Questions/page";
import SolveQuestionModal from "@/app/learner/JoinQuiz/SolveQuestionModal";
import ScoreModal from "@/app/learner/JoinQuiz/ScoreModal";

export default function DashboardLayout() {
  const [active, setActive] = useState("Dashboard");
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
const [solveQuizId, setSolveQuizId] = useState<string | null>(null);

const [finalScore, setFinalScore] = useState<number | null>(null);
const [finalTotal, setFinalTotal] = useState<number | null>(null);

  // النتيجة
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreData, setScoreData] = useState<{ score: number; total: number } | null>(null);

  const loadingUser = useSelector((state: any) => state.auth.loadingUser);
  const role = useSelector((state: any) => state.auth.user?.role?.toLowerCase());
  const user = useSelector((state: any) => state.auth.user);
const handleStartQuiz = (quizId: string) => {
  setSolveQuizId(quizId);
  setIsSolveModalOpen(true);
};

  useEffect(() => {
    if (role && !loadingUser) {
      setActive("Dashboard");
    }
  }, [role, loadingUser]);

  const renderInstructorContent = () => {
    switch (active) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">لوحة تحكم المدرس</h1>
            <UpcomingQuizzes
              onOpenQuiz={(quizId) => {
                setSelectedQuizId(quizId);
                setActive("QuizDetails");
              }}
            />
          </div>
        );
      case "QuizDetails":
        return (
          <QuizDetails
            quizId={selectedQuizId || ""}
            onBack={() => setActive("Dashboard")}
          />
        );
      case "Students": return <Students />;
      case "Groups": return <Groups />;
      case "Quizzes": return <Quizzes setActive={setActive} />;
      case "Questions": return <Questions />;
      default:
        return <div className="p-6 text-center text-gray-500">صفحة المدرس - {active}</div>;
    }
  };

  const renderStudentContent = () => {
    switch (active) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">لوحة تحكم الطالب</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UpcomingQuizzes onJoin={(quizId) => setActive("JoinQuiz")} />
              <div className="border border-gray-300 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">إحصائيات سريعة</h2>
                <p className="text-sm text-gray-600">مرحباً {user?.name || "طالب"}</p>
                <p className="text-sm text-gray-600">الصف: {user?.group?.name || "غير محدد"}</p>
              </div>
            </div>
          </div>
        );
      case "JoinQuiz":
        return (
          <JoinQuiz
            onSolveQuiz={(quizId) => {
              setSolveQuizId(quizId);
              setIsSolveModalOpen(true);
            }}
          />
        );
      case "MyCourses": return <div className="p-6 text-center text-gray-500">كورساتي</div>;
      case "MyGrades": return <div className="p-6 text-center text-gray-500">درجاتي</div>;
      default:
        return <div className="p-6 text-center text-gray-500">صفحة الطالب - {active}</div>;
    }
  };

  const renderContent = () => {
    if (loadingUser) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل بيانات المستخدم...</p>
          </div>
        </div>
      );
    }

    if (!user || !role) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-gray-600">ليس لديك صلاحية للدخول</p>
            <p className="text-sm text-gray-400 mt-2">يرجى تسجيل الدخول أولاً</p>
          </div>
        </div>
      );
    }

    if (role === "student") return renderStudentContent();
    if (["teacher", "instructor"].includes(role)) return renderInstructorContent();

    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-orange-500 text-4xl mb-4">🔒</div>
          <p className="text-gray-600">نوع المستخدم غير معروف: {role}</p>
          <p className="text-sm text-gray-400 mt-2">يرجى التواصل مع الإدارة</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full max-w-full overflow-hidden">
      <Sidebar
        active={active}
        setActive={setActive}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} active={active} />
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 bg-gray-50">
          {renderContent()}
        </main>
      </div>

      {/* مودال حل الاختبار */}
   {isSolveModalOpen && (
  <SolveQuestionModal
    quizId={solveQuizId || undefined}
    onClose={() => {
      setIsSolveModalOpen(false);
      setSolveQuizId(null);
    }}
    onFinish={(score, total) => {
      setFinalScore(score);
      setFinalTotal(total);
      setIsSolveModalOpen(false);
      setIsScoreModalOpen(true);
    }}
  />
)}

{isScoreModalOpen && finalScore !== null && finalTotal !== null && (
  <ScoreModal
    score={finalScore}
    total={finalTotal}
    onClose={() => setIsScoreModalOpen(false)}
    onReassign={() => {
      console.log("إعادة تعيين الكويز");
      setIsScoreModalOpen(false);
    }}
  />
)}

    </div>
  );
}
