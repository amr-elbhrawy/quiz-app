"use client";
import { useEffect, useState } from "react";
import { QuizService } from "@/services/quiz.service";
import { toast } from "react-toastify";
import { FaRegClock, FaAngleDoubleRight, FaEdit, FaTrash } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import EditQuizModal from "./EditQuizModal";
import ConfirmDeleteModal from "../../components/shared/ConfirmDeleteModal";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

export default function QuizDetails({
  quizId,
  onBack
}: {
  quizId: string;
  onBack: () => void;
}) {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchQuiz = async () => {
    try {
      const res = await QuizService.getById(quizId);
      setQuiz(res.data?.data || res.data);
    } catch {
      toast.error("Failed to load quiz details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await QuizService.delete(quizId);
      toast.success("Quiz deleted successfully");
      setDeleteOpen(false);
      onBack();
    } catch {
      toast.error("Failed to delete quiz");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSkeletonCard width="100%" height="40px" count={5} />;
  if (!quiz) return <p>No quiz found.</p>;

  return (
    <div className="p-6 max-w-lg">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button
          onClick={onBack}
          className="hover:underline text-black font-medium"
        >
          Quizzes
        </button>
        <FaAngleDoubleRight className="text-orange-400" />
        <span className="text-black">{quiz.title}</span>
      </div>

      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>

        <div className="flex items-center gap-6 text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <BsCalendarDate />
            {new Date(quiz.schadule).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <FaRegClock />
            {new Date(quiz.schadule).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </div>
        </div>

        <Field label="Duration" value={`${quiz.duration} minutes`} />
        <Field label="Number of questions" value={quiz.questions_number} />
        <Field label="Score per question" value={quiz.score_per_question} />
        <Field label="Description" value={quiz.description} textarea />
        <Field
          label="Question bank used"
          value={quiz.question_bank?.name || "Bank One"}
        />

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={quiz.randomize_questions}
            readOnly
          />
          <label className="text-gray-700">Randomize questions</label>
        </div>

<div className="flex gap-3 mt-6">
  <button
    onClick={() => setEditOpen(true)}
    className="cursor-pointer flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
  >
    <FaEdit />
    <span>Edit</span>
  </button>

  <button
    onClick={() => setDeleteOpen(true)}
    className="cursor-pointer flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    <FaTrash />
    <span>Delete</span>
  </button>
</div>
      </div>

      {/* Edit Modal */}
      <EditQuizModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        quizId={quizId}
        onUpdated={(updatedQuiz) => {
          setQuiz((prev: any) => ({
            ...prev,
            ...updatedQuiz,
            questions_number:
              updatedQuiz.noOfQuestions ?? prev.questions_number
          }));
          setEditOpen(false);
        }}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete "${quiz.title}"?`}
        isLoading={deleting}
      />
    </div>
  );
}

function Field({
  label,
  value,
  textarea
}: {
  label: string;
  value: any;
  textarea?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value || ""}
          disabled
          rows={3}
          className="w-full border rounded px-3 py-2 bg-orange-50 outline-none"
        />
      ) : (
        <input
          value={value || ""}
          disabled
          className="w-full border rounded px-3 py-2 bg-orange-50 outline-none"
        />
      )}
    </div>
  );
}
