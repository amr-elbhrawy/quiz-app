"use client";

import { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { UpcomingQuizzes } from "@/app/instructor/Quizzes/UpcomingQuizzes";
import { CompletedQuizzes } from "@/app/instructor/Quizzes/CompletedQuizzes";
import JoinQuizModal from "./joinCodeModal";
import { QuizService } from "@/services/quiz.service";
import { toast } from "react-toastify";

interface JoinQuizProps {
  onSolveQuiz: (quizId: string) => void;
}

export default function JoinQuiz({ onSolveQuiz }: JoinQuizProps) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await QuizService.getIncoming();
      setQuizzes(res.data);
    } catch (error) {
      toast.error("Failed to load upcoming quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleJoinClick = (quizId: string) => {
    setSelectedQuizId(quizId);
    setIsJoinModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 hover:shadow-md transition"
            >
              <FaSignInAlt className="text-4xl text-gray-800" />
              <span className="mt-2 font-medium text-lg text-center">
                Join Quiz
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <UpcomingQuizzes
            quizzes={quizzes}
            loading={loading}
            onJoin={handleJoinClick}
          />
          <CompletedQuizzes />
        </div>
      </div>

      <JoinQuizModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinSuccess={(quizId) => {
          setIsJoinModalOpen(false);
          onSolveQuiz(quizId);
        }}
      />
    </div>
  );
}