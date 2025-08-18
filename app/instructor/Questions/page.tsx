"use client";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
  import { FaEye, FaEdit, FaTrash, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { 
  fetchQuestions, 
  deleteQuestion, 
  createQuestion, 
  updateQuestion 
} from "@/store/features/question/questionSlice";
import CustomPagination from "@/app/components/shared/CustomPagination";
import CreateQuestionModal from "./CreateQuestionModal";
import ConfirmDeleteModal from "../../components/shared/ConfirmDeleteModal";
import EditQuestionModal from "./EditQuestionModal";
import ViewQuestionModal from "./ViewQuestionModal";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

// ✅ Memoized Question Accordion Component
const QuestionAccordion = React.memo(({ 
  question, 
  onDelete, 
  onEdit, 
  onView 
}: { 
  question: any; 
  onDelete: (question: any) => void; 
  onEdit: (question: any) => void; 
  onView: (question: any) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleView = useCallback(() => onView(question), [question, onView]);
  const handleEdit = useCallback(() => onEdit(question), [question, onEdit]);
  const handleDelete = useCallback(() => onDelete(question), [question, onDelete]);

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight + 20}px` : "0px");
    }
  }, [isOpen]);

  const difficultyStyles = useMemo(() => ({
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  }), []);

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none hover:bg-gray-50 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className="font-semibold truncate pr-2">{question.title}</span>
        <FaChevronDown className={`text-orange-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        style={{
          maxHeight,
          transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out",
        }}
        className="bg-gray-50 overflow-hidden"
      >
        <div
          ref={contentRef}
          className={`px-4 py-3 text-gray-700 space-y-2 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        >
          <div className="space-y-2">
            <p className="flex flex-wrap">
              <span className="font-semibold text-gray-800 min-w-fit">Right Answer: </span>
              <span className="ml-1">{question.answer}</span>
            </p>
            <p className="flex flex-wrap">
              <span className="font-semibold text-gray-800 min-w-fit">Difficulty: </span>
              <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${difficultyStyles[question.difficulty]}`}>
                {question.difficulty}
              </span>
            </p>
            <p className="flex flex-wrap">
              <span className="font-semibold text-gray-800 min-w-fit">Type: </span>
              <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {question.type}
              </span>
            </p>

            <div className="flex gap-4 mt-4 pt-2 border-t border-gray-200">
              <button onClick={handleView} className="action-btn text-orange-500 hover:text-orange-600">
                <FaEye /><span className="text-sm">View</span>
              </button>
              <button onClick={handleEdit} className="action-btn text-blue-500 hover:text-blue-600">
                <FaEdit /><span className="text-sm">Edit</span>
              </button>
              <button onClick={handleDelete} className="action-btn text-red-500 hover:text-red-600">
                <FaTrash /><span className="text-sm">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

QuestionAccordion.displayName = "QuestionAccordion";

// ✅ Memoized Table Row Component
const TableRow = React.memo(({ 
  question, 
  index, 
  fade, 
  onView, 
  onEdit, 
  onDelete 
}: {
  question: any;
  index: number;
  fade: boolean;
  onView: (q: any) => void;
  onEdit: (q: any) => void;
  onDelete: (q: any) => void;
}) => {
  const handleView = useCallback(() => onView(question), [question, onView]);
  const handleEdit = useCallback(() => onEdit(question), [question, onEdit]);
  const handleDelete = useCallback(() => onDelete(question), [question, onDelete]);

  const difficultyStyles = useMemo(() => ({
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  }), []);

  return (
    <tr 
      className="hover:bg-gray-50 transition-colors"
      style={{ transitionDelay: fade ? `${index * 50}ms` : "0ms" }}
    >
      <td className="px-4 py-3 border border-gray-300 truncate max-w-[150px]">{question.title}</td>
      <td className="px-4 py-3 border border-gray-300 truncate max-w-[100px]">{question.answer}</td>
      <td className="px-4 py-3 border border-gray-300">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyStyles[question.difficulty]}`}>
          {question.difficulty}
        </span>
      </td>
      <td className="px-4 py-3 border border-gray-300">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {question.type}
        </span>
      </td>
      <td className="px-4 py-3 border border-gray-300">
        <div className="flex gap-3 text-lg">
          <FaEye onClick={handleView} className="icon-btn text-orange-500 cursor-pointer" />
          <FaEdit onClick={handleEdit} className="icon-btn text-blue-500 cursor-pointer" />
          <FaTrash onClick={handleDelete} className="icon-btn text-red-500 cursor-pointer" />
        </div>
      </td>
    </tr>
  );
});

TableRow.displayName = "TableRow";

export default function QuestionsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { questions, loading, error } = useSelector((state: RootState) => state.questions);
  
  const [page, setPage] = useState(1);
  const [fade, setFade] = useState(true);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [questionToDelete, setQuestionToDelete] = useState<any>(null);
  const [questionToEdit, setQuestionToEdit] = useState<any>(null);
  const [questionToView, setQuestionToView] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 5;

  // ✅ Memoized calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(questions.length / itemsPerPage);
    const currentData = questions.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    return { totalPages, currentData };
  }, [questions, page, itemsPerPage]);

  // ✅ Load questions on mount
  useEffect(() => {
    if (questions.length === 0 && !loading) {
      dispatch(fetchQuestions());
    }
  }, [dispatch, questions.length, loading]);

  // ✅ Memoized callbacks
  const handlePageChange = useCallback((newPage: number) => {
    setFade(false);
    setTimeout(() => {
      setPage(newPage);
      setFade(true);
    }, 200);
  }, []);

  const handleCreateModalOpen = useCallback(() => setIsCreateModalOpen(true), []);
  const handleCreateModalClose = useCallback(() => setIsCreateModalOpen(false), []);

  const handleView = useCallback((question: any) => {
    setQuestionToView(question);
    setIsViewModalOpen(true);
  }, []);

  const handleEdit = useCallback((question: any) => {
    setQuestionToEdit(question);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((question: any) => {
    setQuestionToDelete(question);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!questionToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteQuestion(questionToDelete._id)).unwrap();
      setIsDeleteModalOpen(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error("Error deleting question:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [dispatch, questionToDelete]);

  const handleQuestionCreated = useCallback(() => {
    // Questions will be automatically updated via Redux state
    setIsCreateModalOpen(false);
  }, []);

  const handleQuestionUpdated = useCallback(() => {
    // Questions will be automatically updated via Redux state
    setIsEditModalOpen(false);
    setQuestionToEdit(null);
  }, []);

  // ✅ Memoized rendered components
  const memoizedTableRows = useMemo(() => 
    paginationData.currentData.map((q, index) => (
      <TableRow
        key={q._id}
        question={q}
        index={index}
        fade={fade}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    )), [paginationData.currentData, fade, handleView, handleEdit, handleDelete]);

  const memoizedAccordions = useMemo(() =>
    paginationData.currentData.map((q, index) => (
      <div 
        key={q._id}
        style={{ transitionDelay: fade ? `${index * 100}ms` : "0ms" }}
        className={`transition-all duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
      >
        <QuestionAccordion 
          question={q} 
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
        />
      </div>
    )), [paginationData.currentData, fade, handleDelete, handleEdit, handleView]);

  if (loading && questions.length === 0) {
    return (
      <div className="p-4 sm:p-6 w-full">
        <LoadingSkeletonCard 
          width="100%"
          height="60px"
          count={5}
          className="mx-auto max-w-4xl"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 w-full">
        <div className="text-red-500 text-center">
          Error loading questions: {error}
          <button 
            onClick={() => dispatch(fetchQuestions())}
            className="ml-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Question Bank ({questions.length})</h2>
        <button
          onClick={handleCreateModalOpen}
          className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-full shadow hover:bg-gray-100 transition-all"
        >
          <span className="font-medium">+ Add Question</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="w-full border border-gray-300 rounded-lg min-w-[600px]">
          <thead className="bg-[#0D1321] text-white">
            <tr>
              <th className="px-4 py-3 border border-gray-300 text-left min-w-[150px]">Title</th>
              <th className="px-4 py-3 border border-gray-300 text-left min-w-[100px]">Right Answer</th>
              <th className="px-4 py-3 border border-gray-300 text-left min-w-[100px]">Difficulty</th>
              <th className="px-4 py-3 border border-gray-300 text-left min-w-[100px]">Type</th>
              <th className="px-4 py-3 border border-gray-300 text-left min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className={`transition-all duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
            {memoizedTableRows}
          </tbody>
        </table>
      </div>

      {/* Mobile Accordion */}
      <div className="block sm:hidden space-y-3">
        {memoizedAccordions}
      </div>

      {/* Pagination */}
      <div className="mt-6 min-h-[40px]">
        <CustomPagination 
          totalPages={paginationData.totalPages} 
          page={page} 
          setPage={handlePageChange} 
        />
      </div>

      {/* Modals */}
      <CreateQuestionModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onCreated={handleQuestionCreated}
      />

      <ViewQuestionModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        question={questionToView}
      />

      <EditQuestionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={handleQuestionUpdated}
        question={questionToEdit}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Delete "${questionToDelete?.title}"?`}
        isLoading={isDeleting}
      />
    </div>
  );
}