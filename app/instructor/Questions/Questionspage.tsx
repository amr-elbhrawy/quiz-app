"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FaEye, FaEdit, FaTrash, FaSearch, FaQuestionCircle, FaPlus, FaBrain, FaCheckCircle, FaClock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { 
  fetchQuestions, 
  deleteQuestion 
} from "@/store/features/question/questionSlice";
import CustomPagination from "@/app/components/shared/CustomPagination";
import CreateQuestionModal from "./CreateQuestionModal";
import ConfirmDeleteModal from "../../components/shared/ConfirmDeleteModal";
import EditQuestionModal from "./EditQuestionModal";
import ViewQuestionModal from "./ViewQuestionModal";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

export default function QuestionsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { questions, loading, error } = useSelector((state: RootState) => state.questions);
  
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [fade, setFade] = useState(true);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title_asc");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [questionToDelete, setQuestionToDelete] = useState<any>(null);
  const [questionToEdit, setQuestionToEdit] = useState<any>(null);
  const [questionToView, setQuestionToView] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 21;

  // Load questions on mount
  useEffect(() => {
    if (questions.length === 0 && !loading) {
      dispatch(fetchQuestions());
    }
  }, [dispatch, questions.length, loading]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...questions];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(question => 
        question.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.answer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply difficulty filter
    if (filterDifficulty !== "all") {
      result = result.filter(question => question.difficulty === filterDifficulty);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "title_asc":
          return (a.title || "").localeCompare(b.title || "");
        case "title_desc":
          return (b.title || "").localeCompare(a.title || "");
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
        default:
          return 0;
      }
    });
    
    setFilteredQuestions(result);
    setPage(1);
  }, [searchTerm, sortBy, filterDifficulty, questions]);

  const currentData = useMemo(() => 
    filteredQuestions.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filteredQuestions, page, itemsPerPage]
  );
  
  const totalPages = useMemo(() => 
    Math.ceil(filteredQuestions.length / itemsPerPage),
    [filteredQuestions.length, itemsPerPage]
  );

  const stats = useMemo(() => {
    const questionsCopy = [...filteredQuestions];
    return {
      total: questionsCopy.length,
      easy: questionsCopy.filter(q => q.difficulty === "easy").length,
      medium: questionsCopy.filter(q => q.difficulty === "medium").length,
      hard: questionsCopy.filter(q => q.difficulty === "hard").length,
    };
  }, [filteredQuestions]);

  const handlePageChange = useCallback((newPage: number) => {
    setFade(false);
    setTimeout(() => {
      setPage(newPage);
      setFade(true);
    }, 200);
  }, []);

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
    setIsCreateModalOpen(false);
  }, []);

  const handleQuestionUpdated = useCallback(() => {
    setIsEditModalOpen(false);
    setQuestionToEdit(null);
  }, []);

  if (loading && questions.length === 0) {
    return (
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <LoadingSkeletonCard key={i} height="140px" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <div className="mx-auto w-24 h-24 flex items-center justify-center bg-red-100 rounded-full mb-4">
            <FaQuestionCircle className="text-3xl text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error loading questions</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchQuestions())}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-4">
            <FaQuestionCircle className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Question Bank
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your question collection with advanced filtering and organization tools.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Questions" value={stats.total} icon={<FaQuestionCircle />} color="from-blue-500 to-blue-600" bgColor="from-blue-50 to-blue-100" />
          <StatCard title="Easy" value={stats.easy} icon={<FaCheckCircle />} color="from-green-500 to-green-600" bgColor="from-green-50 to-green-100" />
          <StatCard title="Medium" value={stats.medium} icon={<FaClock />} color="from-yellow-500 to-yellow-600" bgColor="from-yellow-50 to-yellow-100" />
          <StatCard title="Hard" value={stats.hard} icon={<FaBrain />} color="from-red-500 to-red-600" bgColor="from-red-50 to-red-100" />
        </div>

{/* Search and Filters + Add Button */}
<div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
    {/* Left: Search + Filters */}
    <div className="flex flex-col lg:flex-row gap-4 flex-1">
      {/* Search */}
      <div className="relative flex-1">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
      >
        <option value="title_asc">Title (A → Z)</option>
        <option value="title_desc">Title (Z → A)</option>
        <option value="difficulty">By Difficulty</option>
      </select>

      {/* Difficulty Filter */}
      <select
        value={filterDifficulty}
        onChange={(e) => setFilterDifficulty(e.target.value)}
        className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
      >
        <option value="all">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>

    {/* Right: Add Question Button */}
    <button
      onClick={() => setIsCreateModalOpen(true)}
      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      <FaPlus className="text-sm" />
      Add Question
    </button>
  </div>
</div>


        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            Showing {currentData.length} of {filteredQuestions.length} questions
          </p>
          {(searchTerm || filterDifficulty !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterDifficulty("all");
                setSortBy("title_asc");
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Questions Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 transition-all duration-300 ${
            fade ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
          }`}
        >
          {currentData.map((question, index) => (
            <QuestionCard 
              key={question._id}
              question={question}
              onView={() => handleView(question)}
              onEdit={() => handleEdit(question)}
              onDelete={() => handleDelete(question)}
              index={index}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="mx-auto w-24 h-24 flex items-center justify-center bg-indigo-100 rounded-full mb-4">
              <FaQuestionCircle className="text-3xl text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No questions found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Try adjusting your search or filter to find what you're looking for, or create a new question.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <FaPlus className="text-sm" />
              Create First Question
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 bg-white rounded-2xl shadow-md p-4">
            <CustomPagination
              totalPages={totalPages}
              page={page}
              setPage={handlePageChange}
            />
          </div>
        )}

        {/* Modals */}
        <CreateQuestionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
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
          message={`Are you sure you want to delete "${questionToDelete?.title}"? This action cannot be undone.`}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bgColor }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) {
  return (
    <div className={`bg-gradient-to-r ${bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`text-2xl bg-gradient-to-r ${color} text-white p-3 rounded-xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  onView,
  onEdit,
  onDelete,
  index
}: {
  question: any;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <FaCheckCircle className="text-green-500" />;
      case "medium":
        return <FaClock className="text-yellow-500" />;
      case "hard":
        return <FaBrain className="text-red-500" />;
      default:
        return <FaQuestionCircle className="text-gray-500" />;
    }
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200"
      style={{
        animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0">
              {getDifficultyIcon(question.difficulty)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2 mb-1">
                {question.title}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                Answer: {question.answer}
              </p>
            </div>
          </div>
          
          <div className="flex gap-1 ml-2">
            <button onClick={onView} className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition-all duration-200 hover:scale-110">
              <FaEye />
            </button>
            <button onClick={onEdit} className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 p-2 rounded-lg transition-all duration-200 hover:scale-110">
              <FaEdit />
            </button>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 hover:scale-110">
              <FaTrash />
            </button>
          </div>
        </div>
        
        <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </span>
      </div>
    </div>
  );
}
