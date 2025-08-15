"use client";
import React, { useState, useEffect } from "react";
import { QuizService } from "@/services/quiz.service";
import { toast } from "react-toastify";
import { HiOutlineXMark } from "react-icons/hi2";

interface Question {
  _id: string;
  title: string;
  options: { [key: string]: string };
  type: string;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

interface SolveQuestionModalProps {
  quizId?: string;
  onClose: () => void;
  onFinish: (score: number, total: number) => void;
}

export default function SolveQuestionModal({
  quizId,
  onClose,
  onFinish,
}: SolveQuestionModalProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (quizId) fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    if (!quizId) return;
    try {
      const res = await QuizService.getWithoutAnswers(quizId);
      setQuiz(res.data.data);
    } catch {
      toast.error("Failed to load quiz");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerKey: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerKey }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        question: questionId,
        answer,
      })
    );

    setSubmitting(true);
    try {
      const res = await QuizService.submit(quiz._id, {
        answers: formattedAnswers,
      });

      const score = res.data?.data?.score;
      const total = res.data?.data?.questions?.length;
      const totalScore = score * total;

      if (typeof score === "number") {
        toast.success("Quiz submitted successfully!");
        onClose();
        onFinish(totalScore, totalScore);
      } else {
        toast.error("Score or total not found in response!");
      }
    } catch {
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !quiz || !quiz.questions?.length) {
    return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center">Loading quiz...</div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden w-[95%] sm:w-[90%] md:w-[800px] max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 p-4">
          <h2 className="text-lg font-bold">{quiz.title}</h2>
          <button
            onClick={onClose}
            title="Close"
            className="cursor-pointer flex items-center justify-center w-10 h-10 border border-gray-300 hover:text-gray-800 transition-colors rounded"
          >
            <HiOutlineXMark size={22} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4">
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span>Duration: {quiz.duration} minutes</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) / quiz.questions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        {currentQ && (
          <div className="px-6 pb-6">
            <h3 className="text-xl font-semibold mb-4">{currentQ.title}</h3>
            <div className="space-y-3">
 {currentQ.options &&
  Object.entries(currentQ.options)
    .filter(([key]) => !key.startsWith("_"))  
    .map(([key, value]) => (
      <button
        key={key}
        onClick={() => handleAnswerSelect(currentQ._id, key)}
        className={`w-full text-left p-4 rounded-lg border transition-all ${
          answers[currentQ._id] === key
            ? "bg-blue-50 border-blue-500 text-blue-700 font-medium"
            : "bg-gray-50 border-gray-300 hover:bg-gray-100"
        }`}
      >
        <span className="font-medium mr-3">{key}.</span>
        {value}
      </button>
    ))
}
            </div>
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex justify-between px-6 pb-6">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-5 py-2 bg-orange-100 text-orange-700 rounded border border-orange-300 hover:bg-orange-200 disabled:opacity-50"
          >
            Previous
          </button>
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                Object.keys(answers).length !== quiz.questions.length
              }
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(quiz.questions.length - 1, prev + 1)
                )
              }
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
