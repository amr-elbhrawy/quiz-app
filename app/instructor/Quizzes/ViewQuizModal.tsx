"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { HiOutlineXMark } from "react-icons/hi2";
import { QuizService } from "@/services/quiz.service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaClock, FaUsers, FaQuestionCircle, FaStar, FaHashtag, FaCode, FaListAlt } from "react-icons/fa";
import { MdGroups, MdSchedule, MdTitle } from "react-icons/md";
import { TbTextPlus } from "react-icons/tb";
import { GiRank3 } from "react-icons/gi";

interface ViewQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
}

interface QuizData {
  title: string;
  description: string;
  code: string;
  duration: number;
  questions_number: number;
  score_per_question: number;
  type: string;
  difficulty: string;
  group: string;
  schadule: string;
  participants: number;
}

export default function ViewQuizModal({ isOpen, onClose, quizId }: ViewQuizModalProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await QuizService.getById(quizId);
        const data = res.data.data || res.data;
        setQuiz(data);
      } catch (err) {
        toast.error("Failed to fetch quiz details");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "hard": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onClose}
      hideCloseButton
      className="w-[95%] sm:w-[90%] md:w-[750px] max-w-full"
    >
      <ModalContent className="rounded-xl overflow-hidden shadow-xl">
        <ModalHeader className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-0">
          <h2 className="px-6 py-4 text-xl font-bold text-indigo-800 flex items-center gap-2">
            <FaListAlt className="text-indigo-600" />
            Quiz Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="cursor-pointer flex items-center justify-center w-12 h-12 border-l border-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <HiOutlineXMark size={24} />
          </button>
        </ModalHeader>

        <ModalBody className="p-6 space-y-6 bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500">Loading quiz details...</p>
            </div>
          ) : quiz ? (
            <div className="space-y-6">
              {/* Quiz Title and Description */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <MdTitle className="text-indigo-500 text-lg" />
                  <h3 className="font-bold text-gray-800 text-xl">{quiz.title}</h3>
                </div>
                <div className="flex items-start gap-2">
                  <TbTextPlus className="text-gray-400 mt-1 text-lg" />
                  <p className="text-gray-600 leading-relaxed">{quiz.description}</p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaCode className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quiz Code</p>
                    <p className="font-semibold text-gray-800">{quiz.code}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaQuestionCircle className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Number of Questions</p>
                    <p className="font-semibold text-gray-800">{quiz.questions_number}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <FaClock className="text-amber-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration (minutes)</p>
                    <p className="font-semibold text-gray-800">{quiz.duration}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaHashtag className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Points per Question</p>
                    <p className="font-semibold text-gray-800">{quiz.score_per_question}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <GiRank3 className="text-gray-400" />
                    Difficulty Level
                  </h4>
                  <span className={`font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <FaStar className="text-gray-400" />
                    Quiz Type
                  </h4>
                  <span className="font-semibold text-gray-800">{quiz.type}</span>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <MdGroups className="text-gray-400" />
                    Group
                  </h4>
                  <span className="font-semibold text-gray-800">{quiz.group}</span>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <MdSchedule className="text-gray-400" />
                    Schedule
                  </h4>
                  <span className="font-semibold text-gray-800">
                    {new Date(quiz.schadule).toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              {/* Participants Count */}
              <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                <div className="flex items-center justify-center gap-3">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <FaUsers className="text-indigo-600 text-xl" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-indigo-700">Participants</p>
                    <p className="font-bold text-indigo-900 text-2xl">{quiz.participants}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 inline-block p-4 rounded-full mb-4">
                <HiOutlineXMark size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500">Quiz details not available</p>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
