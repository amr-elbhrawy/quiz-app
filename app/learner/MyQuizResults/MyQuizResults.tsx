"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import QuizResultModal from "@/app/instructor/Results/QuizResultModal";
import CustomPagination from "@/app/components/shared/CustomPagination";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";
import { MdQuiz, MdGroups } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { fetchCompletedQuizzes, fetchQuizResult } from "@/store/features/quiz/quizSlice";

interface QuizResult {
  _id: string;
  title: string;
  group: {
    name: string;
    members: number;
  };
  participants: number;
  date: string;
  score?: number;
}

export default function MyQuizResults() {
  const dispatch = useDispatch<any>();
  const { user } = useSelector((state: any) => state.auth);

  const { completed, result: resultsFromStore, loading } = useAppSelector((state) => state.quiz);

  const [page, setPage] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState<{ id: string; title: string } | null>(null);

  const itemsPerPage = 12;

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCompletedQuizzes());
      dispatch(fetchQuizResult());
    }
  }, [dispatch, user?._id]);

  const myResults: QuizResult[] = useMemo(() => {
    if (!user?._id) return [];

    let studentResults: QuizResult[] = [];

    if (completed?.length > 0) {
      studentResults = completed.map((quiz: any) => ({
        _id: quiz._id,
        title: quiz.title || "Untitled Quiz",
        group: {
          name: quiz.group?.name || "My Group",
          members: quiz.group?.members || 0,
        },
        participants: 1,
        date: new Date(quiz.createdAt || Date.now()).toLocaleDateString("en-GB"),
        score: quiz.score || quiz.finalScore || 0,
      }));
    }

    if (studentResults.length === 0 && Array.isArray(resultsFromStore)) {
      studentResults = resultsFromStore
        .filter((result: any) =>
          result.participants?.some(
            (p: any) =>
              p.studentId === user._id || p.student === user._id || p.student?._id === user._id
          )
        )
        .map((result: any) => {
          const studentParticipant = result.participants?.find(
            (p: any) =>
              p.studentId === user._id || p.student === user._id || p.student?._id === user._id
          );

          return {
            _id: result.quiz?._id || result._id,
            title: result.quiz?.title || result.title || "Untitled Quiz",
            group: {
              name: result.quiz?.group?.name || result.group?.name || "My Group",
              members: result.quiz?.group?.members || result.group?.members || 0,
            },
            participants: Array.isArray(result.participants) ? result.participants.length : 0,
            date: new Date(result.quiz?.createdAt || result.createdAt || Date.now()).toLocaleDateString("en-GB"),
            score: studentParticipant?.score || studentParticipant?.finalScore || 0,
          };
        });
    }

    return studentResults;
  }, [completed, resultsFromStore, user]);

  const currentData = myResults.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(myResults.length / itemsPerPage);

  if (loading && myResults.length === 0) {
    return (
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <LoadingSkeletonCard key={i} height="120px" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-4">
            <MdQuiz className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Quiz Results ({myResults.length})
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Here you can review your past quizzes and scores.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentData.map((quiz, index) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onView={() => setSelectedQuiz({ id: quiz._id, title: quiz.title })}
              index={index}
            />
          ))}
        </div>

        {myResults.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="mx-auto w-24 h-24 flex items-center justify-center bg-indigo-100 rounded-full mb-4">
              <MdQuiz className="text-3xl text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No quiz results found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't completed any quizzes yet. Check your completed quizzes or contact your instructor.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 bg-white rounded-2xl shadow-md p-4">
            <CustomPagination totalPages={totalPages} page={page} setPage={setPage} />
          </div>
        )}

        {selectedQuiz && (
          <QuizResultModal
            isOpen={!!selectedQuiz}
            onClose={() => setSelectedQuiz(null)}
            quizId={selectedQuiz.id}
            quizTitle={selectedQuiz.title}
          />
        )}
      </div>
    </div>
  );
}

function QuizCard({
  quiz,
  onView,
  index,
}: {
  quiz: QuizResult;
  onView: () => void;
  index: number;
}) {
  return (
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200"
      style={{
        animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                <MdQuiz />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 truncate">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MdGroups className="text-xs" />
                {quiz.group.name}
              </p>
            </div>
          </div>

          <button
            onClick={onView}
            className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <FaEye className="text-lg" />
          </button>
        </div>

        <div className="space-y-3 mb-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Score:</span>
            <span
              className={`font-medium ${
                quiz.score && quiz.score >= 70
                  ? "text-green-600"
                  : quiz.score && quiz.score >= 50
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {quiz.score || 0}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="text-gray-800">{quiz.date}</span>
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
}

const styles = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
