"use client";

import { useState, useEffect } from "react";
import { FaRegClock } from "react-icons/fa";
import { GiSave } from "react-icons/gi";
import { UpcomingQuizzes } from "./UpcomingQuizzes";
import { CompletedQuizzes } from "./CompletedQuizzes";
import CreateQuizModal from "./CreateQuizModal";
import { QuizService } from "@/services/quiz.service";
import { toast } from "react-toastify";

type HomeProps = {
  setActive: (key: string) => void;
};

export default function Home({ setActive }: HomeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleQuizCreated = () => {
    toast.success("Quiz created successfully!");
    setIsModalOpen(false);
    fetchQuizzes(); // تحديث اللائحة بعد الإنشاء
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 hover:shadow-md transition"
            >
              <FaRegClock className="text-4xl text-gray-800" />
              <span className="mt-2 font-medium text-lg text-center">
                Set up a new quiz
              </span>
            </button>

            <button
              onClick={() => setActive("Questions")}
              className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 hover:shadow-md transition"
            >
              <GiSave className="text-4xl text-gray-800" />
              Question Bank
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <UpcomingQuizzes quizzes={quizzes} loading={loading} />
          <CompletedQuizzes />
        </div>
      </div>

      <CreateQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleQuizCreated}
      />
    </div>
  );
}
