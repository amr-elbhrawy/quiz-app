 "use client";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
  FaArrowLeft, FaEdit, FaTrash, FaClock, FaUsers, FaCheckCircle, 
  FaTimesCircle, FaCalendarAlt, FaQuestionCircle, FaTrophy
} from "react-icons/fa";
import { MdGroups, MdSettings, MdDescription } from "react-icons/md";
import dynamic from "next/dynamic";
import { 
  fetchQuizById, 
  deleteQuiz, 
  clearQuiz 
} from "@/store/features/quiz/quizSlice";
import type { RootState, AppDispatch } from "@/store/store";

// Lazy load modals
const EditQuizModal = dynamic(() => import("./EditQuizModal"), {
  loading: () => null
});
const ConfirmDeleteModal = dynamic(() => import("../../components/shared/ConfirmDeleteModal"), {
  loading: () => null
});

// Loading Skeleton Component
const QuizDetailsSkeleton = memo(() => (
  <div className="space-y-6 animate-pulse">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
        <div className="h-8 bg-gray-100 rounded w-64"></div>
      </div>
      <div className="flex gap-3">
        <div className="w-24 h-10 bg-gray-100 rounded-lg"></div>
        <div className="w-24 h-10 bg-gray-100 rounded-lg"></div>
      </div>
    </div>

    {/* Card Skeleton */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-100 rounded w-1/3"></div>
        <div className="w-16 h-6 bg-gray-100 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-16"></div>
            <div className="h-6 bg-gray-100 rounded w-20"></div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded w-20"></div>
        <div className="h-16 bg-gray-100 rounded w-full"></div>
      </div>
    </div>
  </div>
));

QuizDetailsSkeleton.displayName = "QuizDetailsSkeleton";

// Info Item Component
const InfoItem = memo(({ 
  icon: Icon, 
  label, 
  value, 
  color = "text-gray-500" 
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: any;
  color?: string;
}) => (
  <div className="space-y-1.5 p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2">
      <Icon className={`${color} text-sm`} />
      <span className="text-gray-600 text-xs font-medium">{label}</span>
    </div>
    <div className="font-medium text-gray-800 text-sm">{value}</div>
  </div>
));

InfoItem.displayName = "InfoItem";

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
    
    return () => {
      dispatch(clearQuiz());
    };
  }, [dispatch, quizId]);

  // Memoized computed values
  const formattedSchedule = useMemo(() => {
    if (!quiz?.schadule) return { date: "No date set", time: "No time set" };
    const scheduleDate = new Date(quiz.schadule);
    return {
      date: scheduleDate.toLocaleDateString("en-US", {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: scheduleDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    };
  }, [quiz?.schadule]);

  const totalScore = useMemo(() => {
    return (quiz?.questions_number || 0) * (quiz?.score_per_question || 0);
  }, [quiz?.questions_number, quiz?.score_per_question]);

  // Action handlers
  const handleOpenEdit = useCallback(() => setEditOpen(true), []);
  const handleCloseEdit = useCallback(() => setEditOpen(false), []);
  const handleOpenDelete = useCallback(() => setDeleteOpen(true), []);
  const handleCloseDelete = useCallback(() => setDeleteOpen(false), []);

  const handleQuizUpdated = useCallback((updatedQuiz: any) => {
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
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <QuizDetailsSkeleton />
      </div>
    );
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-300 mb-4 text-6xl">❓</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {error ? "Error Loading Quiz" : "Quiz Not Found"}
          </h3>
          <p className="text-gray-500 mb-6">
            {error || "The quiz you're looking for doesn't exist or has been deleted."}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Back to Quizzes"
          >
            <FaArrowLeft className="text-sm" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{quiz.title}</h1>
            <p className="text-gray-500 text-xs">Quiz Details</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors font-medium text-sm"
          >
            <FaEdit className="text-xs" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleOpenDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
          >
            <FaTrash className="text-xs" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Quiz Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5 relative">
        {/* Status Badge */}
        <div className={`absolute top-5 right-5 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          quiz.status === "open" 
            ? "bg-green-50 text-green-700" 
            : "bg-red-50 text-red-700"
        }`}>
          {quiz.status === "open" ? (
            <FaCheckCircle className="text-green-500 text-xs" />
          ) : (
            <FaTimesCircle className="text-red-500 text-xs" />
          )}
          {quiz.status === "open" ? "Active" : "Closed"}
        </div>

        {/* Quiz Code */}
        <div className="pr-20">
          <div className="bg-blue-50 text-blue-700 text-xs font-medium py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5">
            <span>Quiz Code:</span>
            <span className="font-semibold">{quiz.code || "No code assigned"}</span>
          </div>
        </div>

        {/* Quiz Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoItem
            icon={FaQuestionCircle}
            label="Questions"
            value={quiz.questions_number || 0}
            color="text-blue-500"
          />
          <InfoItem
            icon={FaClock}
            label="Duration"
            value={`${quiz.duration || 0} mins`}
            color="text-green-500"
          />
          <InfoItem
            icon={FaTrophy}
            label="Score per Q"
            value={quiz.score_per_question || 0}
            color="text-amber-500"
          />
          <InfoItem
            icon={FaTrophy}
            label="Total Score"
            value={totalScore}
            color="text-purple-500"
          />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoItem
            icon={FaUsers}
            label="Participants"
            value={quiz.participants || 0}
            color="text-indigo-500"
          />
          <InfoItem
            icon={MdGroups}
            label="Difficulty"
            value={quiz.difficulty || "Normal"}
            color="text-red-500"
          />
          <InfoItem
            icon={FaCalendarAlt}
            label="Date"
            value={formattedSchedule.date}
            color="text-blue-500"
          />
          <InfoItem
            icon={FaClock}
            label="Time"
            value={formattedSchedule.time}
            color="text-green-500"
          />
        </div>

        {/* Description Section */}
        {quiz.description && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <MdDescription className="text-gray-400 text-sm" />
              <span className="text-gray-600 text-xs font-medium">Description</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed">
              {quiz.description}
            </div>
          </div>
        )}

        {/* Quiz Settings */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <MdSettings className="text-gray-400 text-sm" />
            <span className="text-gray-600 text-xs font-medium">Settings</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs bg-gray-50 px-2.5 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full ${
                quiz.randomize_questions ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-gray-600">
                Randomize: {quiz.randomize_questions ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs bg-gray-50 px-2.5 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">
                Type: {quiz.type || 'Standard'}
              </span>
            </div>
          </div>
        </div>

        {/* Question Bank Info */}
        {quiz.question_bank && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <FaQuestionCircle className="text-gray-400 text-sm" />
              <span className="text-gray-600 text-xs font-medium">Question Bank</span>
            </div>
            <div className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
              {quiz.question_bank.name || 'Default Bank'}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
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