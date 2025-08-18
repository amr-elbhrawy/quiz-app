// QuizDetails.tsx - Redux Version
"use client";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaRegClock, FaAngleDoubleRight, FaEdit, FaTrash } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import dynamic from "next/dynamic";
import { 
  fetchQuizById, 
  deleteQuiz, 
  clearQuiz 
} from "@/store/features/quiz/quizSlice";
import type { RootState, AppDispatch } from "@/store/store";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

// Lazy load modals - will only load when user needs them
const EditQuizModal = dynamic(() => import("./EditQuizModal"), {
  loading: () => null
});
const ConfirmDeleteModal = dynamic(() => import("../../components/shared/ConfirmDeleteModal"), {
  loading: () => null
});

// Memoized Field Component
const Field = memo(({ label, value, textarea = false }: {
  label: string;
  value: any;
  textarea?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {textarea ? (
      <textarea
        value={value || ""}
        readOnly
        rows={3}
        className="w-full border border-gray-300 rounded px-3 py-2 bg-orange-50 text-gray-700 resize-none focus:outline-none"
      />
    ) : (
      <input
        type="text"
        value={value || ""}
        readOnly
        className="w-full border border-gray-300 rounded px-3 py-2 bg-orange-50 text-gray-700 focus:outline-none"
      />
    )}
  </div>
));

Field.displayName = "Field";

// Memoized Action Button Component
const ActionButton = memo(({ 
  onClick, 
  icon: Icon, 
  text, 
  variant = "primary",
  disabled = false 
}: {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  variant?: "primary" | "danger";
  disabled?: boolean;
}) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = variant === "danger" 
    ? "bg-red-600 text-white hover:bg-red-700" 
    : "bg-gray-900 text-white hover:bg-gray-800";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      <Icon className="text-sm" />
      <span>{text}</span>
    </button>
  );
});

ActionButton.displayName = "ActionButton";

// Memoized Breadcrumb Component
const Breadcrumb = memo(({ onBack, title }: { onBack: () => void; title: string }) => (
  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
    <button
      onClick={onBack}
      className="hover:underline text-black font-medium transition-colors"
    >
      Quizzes
    </button>
    <FaAngleDoubleRight className="text-orange-400" />
    <span className="text-black truncate">{title}</span>
  </div>
));

Breadcrumb.displayName = "Breadcrumb";

// Main Component
export default function QuizDetails({
  quizId,
  onBack
}: {
  quizId: string;
  onBack: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { quiz, loading, error } = useSelector((state: RootState) => state.quiz);
  
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch quiz on mount
  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizById(quizId));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearQuiz());
    };
  }, [dispatch, quizId]);

  // Memoized date formatting
  const formattedDate = useMemo(() => {
    if (!quiz?.schadule) return "No date set";
    return new Date(quiz.schadule).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }, [quiz?.schadule]);

  const formattedTime = useMemo(() => {
    if (!quiz?.schadule) return "No time set";
    return new Date(quiz.schadule).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  }, [quiz?.schadule]);

  // Action handlers
  const handleOpenEdit = useCallback(() => {
    setEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditOpen(false);
  }, []);

  const handleOpenDelete = useCallback(() => {
    setDeleteOpen(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteOpen(false);
  }, []);

  const handleQuizUpdated = useCallback((updatedQuiz: any) => {
    // Quiz will be updated in Redux store automatically
    setEditOpen(false);
    toast.success("Quiz updated successfully!");
  }, []);

  const handleDelete = useCallback(async () => {
    if (!quizId) return;

    setDeleting(true);
    try {
      const resultAction = await dispatch(deleteQuiz(quizId));
      
      if (deleteQuiz.fulfilled.match(resultAction)) {
        toast.success("Quiz deleted successfully");
        setDeleteOpen(false);
        onBack();
      } else {
        const error = resultAction.payload as string;
        toast.error(error || "Failed to delete quiz");
      }
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      toast.error("Failed to delete quiz");
    } finally {
      setDeleting(false);
    }
  }, [dispatch, quizId, onBack]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl">
        <LoadingSkeletonCard variant="card" width="100%" height="60px" count={8} />
      </div>
    );
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="p-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">❓</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {error ? "Error Loading Quiz" : "Quiz Not Found"}
          </h3>
          <p className="text-gray-500 mb-4">
            {error || "The quiz you're looking for doesn't exist or has been deleted."}
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <Breadcrumb onBack={onBack} title={quiz.title} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h2>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <BsCalendarDate className="text-blue-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaRegClock className="text-green-500" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Quiz Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Field 
              label="Duration" 
              value={`${quiz.duration || 0} minutes`} 
            />
            <Field 
              label="Number of questions" 
              value={quiz.questions_number || 0} 
            />
            <Field 
              label="Score per question" 
              value={quiz.score_per_question || 0} 
            />
          </div>
          <div>
            <Field 
              label="Question bank used" 
              value={quiz.question_bank?.name || "No bank assigned"} 
            />
            <Field 
              label="Status" 
              value={quiz.status || "Active"} 
            />
            <Field 
              label="Total Score" 
              value={(quiz.questions_number || 0) * (quiz.score_per_question || 0)} 
            />
          </div>
        </div>

        <Field 
          label="Description" 
          value={quiz.description || "No description provided"} 
          textarea 
        />

        {/* Settings */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quiz Settings</h3>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="randomize"
              checked={Boolean(quiz.randomize_questions)}
              readOnly
              className="rounded border-gray-300"
            />
            <label htmlFor="randomize" className="text-sm text-gray-700">
              Randomize questions order
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <ActionButton
            onClick={handleOpenEdit}
            icon={FaEdit}
            text="Edit Quiz"
            variant="primary"
          />
          <ActionButton
            onClick={handleOpenDelete}
            icon={FaTrash}
            text="Delete Quiz"
            variant="danger"
            disabled={deleting}
          />
        </div>
      </div>

      {/* Modals - will only load when needed */}
      {editOpen && (
        <EditQuizModal
          isOpen={editOpen}
          onClose={handleCloseEdit}
          quizId={quizId}
          onUpdated={handleQuizUpdated}
        />
      )}

      {deleteOpen && (
        <ConfirmDeleteModal
          isOpen={deleteOpen}
          onClose={handleCloseDelete}
          onConfirm={handleDelete}
          message={`Are you sure you want to delete "${quiz.title}"? This action cannot be undone.`}
          isLoading={deleting}
        />
      )}
    </div>
  );
}