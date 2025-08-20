"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { 
  FaEye, FaEdit, FaTrash, FaSearch, FaSortAlphaDown, FaSortAlphaUp, 
  FaClock, FaUsers, FaCheckCircle, FaTimesCircle 
} from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import CustomPagination from "@/app/components/shared/CustomPagination";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";
import { QuizService } from "@/services/quiz.service";
import { GroupService } from "@/services/group.service";
import { toast } from "react-toastify";

import EditQuizModal from "./EditQuizModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ViewQuizModal from "./ViewQuizModal";

interface Quiz {
  _id: string;
  code: string;
  title: string;
  description: string;
  status: "open" | "closed";
  instructor: string;
  group: string;
  questions_number: number;
  schadule: string;
  duration: number;
  score_per_question: number;
  type: string;
  difficulty: string;
  updatedAt: string;
  createdAt: string;
  closed_at?: string;
  participants: number;
}

const QuizzesTable: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [groupMap, setGroupMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [viewQuizId, setViewQuizId] = useState<string | null>(null);

  // filters & search
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed">("all");
  const [sortAsc, setSortAsc] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // modals
  const [editQuizId, setEditQuizId] = useState<string | null>(null);
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // fetch quizzes & groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [quizRes, groupRes] = await Promise.all([
          QuizService.getAll(),
          GroupService.getAll(),
        ]);

        setQuizzes(quizRes.data || []);

        // group map (id → name)
        const gMap: Record<string, string> = {};
        groupRes.data.forEach((g: any) => (gMap[g._id] = g.name));
        setGroupMap(gMap);

      } catch (err: any) {
        console.error(err);
        setError("Failed to load quizzes.");
        toast.error("Error loading quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // filtering + searching + sorting
  const filteredQuizzes = useMemo(() => {
    let result = [...quizzes];

    if (search) {
      result = result.filter((q) =>
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase()) ||
        q.code.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((q) => q.status === filterStatus);
    }

    result.sort((a, b) =>
      sortAsc
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

    return result;
  }, [quizzes, search, filterStatus, sortAsc]);

  // pagination
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const currentData = filteredQuizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, sortAsc]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // handle modals
  const handleDelete = useCallback((id: string) => setDeleteQuizId(id), []);
  const handleEdit = useCallback((id: string) => setEditQuizId(id), []);

  const confirmDelete = async () => {
    if (!deleteQuizId) return;
    try {
      setIsDeleting(true);
      await QuizService.delete(deleteQuizId);
      toast.success("Quiz deleted successfully!");
      setQuizzes(prev => prev.filter(q => q._id !== deleteQuizId));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete quiz");
    } finally {
      setIsDeleting(false);
      setDeleteQuizId(null);
    }
  };

  const handleUpdatedQuiz = (updated: any) => {
    if (!editQuizId) return;
    setQuizzes(prev =>
      prev.map(q => (q._id === editQuizId ? { ...q, ...updated } : q))
    );
    setEditQuizId(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: itemsPerPage }).map((_, idx) => (
          <LoadingSkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-8 bg-red-50 rounded-lg">{error}</p>;
  }

  return (
    <div className="space-y-8">
      {/* 🔍 Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
        {/* Search */}
        <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 w-full md:w-2/5 bg-gray-50 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200">
          <FaSearch className="text-gray-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by title, description, or code..."
            className="flex-1 outline-none bg-transparent placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-600 hidden md:block">Filter by:</span>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filterStatus === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
              onClick={() => setFilterStatus("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filterStatus === "open" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
              onClick={() => setFilterStatus("open")}
            >
              Open
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filterStatus === "closed" ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
              onClick={() => setFilterStatus("closed")}
            >
              Closed
            </button>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => setSortAsc(!sortAsc)}
          >
            {sortAsc ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
            <span className="text-sm font-medium">Sort {sortAsc ? "A-Z" : "Z-A"}</span>
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">
          {filteredQuizzes.length} Quiz{filteredQuizzes.length !== 1 ? "zes" : ""} Found
        </h2>
        {search && (
          <button 
            onClick={() => setSearch("")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear search
          </button>
        )}
      </div>

      {/* 📊 Grid of Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentData.length > 0 ? (
          currentData.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 relative transition-all hover:shadow-md hover:border-blue-100 group"
            >
              {/* Status Badge */}
              <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${quiz.status === "open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {quiz.status === "open" ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
                {quiz.status === "open" ? "Open" : "Closed"}
              </div>

              {/* Header */}
              <div className="pr-16">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{quiz.title}</h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{quiz.description}</p>
              </div>

              {/* Code */}
              <div className="bg-blue-50 text-blue-700 text-xs font-medium py-1.5 px-3 rounded-lg inline-block">
                Code: {quiz.code}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 block">Questions</span>
                    <span className="font-medium text-gray-800">{quiz.questions_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Duration</span>
                    <span className="font-medium text-gray-800">{quiz.duration} mins</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Type</span>
                    <span className="font-medium text-gray-800 capitalize">{quiz.type}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 block">Score per Q</span>
                    <span className="font-medium text-gray-800">{quiz.score_per_question}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Difficulty</span>
                    <span className="font-medium text-gray-800 capitalize">{quiz.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Participants</span>
                    <span className="font-medium text-gray-800 flex items-center gap-1">
                      <FaUsers className="text-gray-400" /> {quiz.participants}
                    </span>
                  </div>
                </div>
              </div>

              {/* Group and Schedule */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdGroups className="text-gray-400" />
                  <span>{groupMap[quiz.group] || "Unknown Group"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="text-gray-400" />
                  <span>{new Date(quiz.schadule).toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3">
<button 
  className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors tooltip"
  title="View quiz details"
  onClick={() => setViewQuizId(quiz._id)}
>
  <FaEye className="text-lg" />
</button>

                <button 
                  className="p-2.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors tooltip"
                  title="Edit quiz"
                  onClick={() => handleEdit(quiz._id)}
                >
                  <FaEdit className="text-lg" />
                </button>
                <button
                  className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors tooltip"
                  title="Delete quiz"
                  onClick={() => handleDelete(quiz._id)}
                >
                  <FaTrash className="text-lg" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="text-gray-400 mb-3 text-5xl">📝</div>
            <h3 className="text-lg font-medium text-gray-600 mb-1">No quizzes found</h3>
            <p className="text-gray-500 text-sm">
              {search || filterStatus !== "all" 
                ? "Try adjusting your search or filter to find what you're looking for." 
                : "There are no quizzes available at the moment."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 bg-white rounded-2xl shadow-md p-4">
          <CustomPagination
            totalPages={totalPages}
            page={currentPage}
            setPage={setCurrentPage}
          />
        </div>
      )}

      {/* Edit Modal */}
      {editQuizId && (
        <EditQuizModal
          isOpen={!!editQuizId}
          quizId={editQuizId}
          onClose={() => setEditQuizId(null)}
          onUpdated={handleUpdatedQuiz}
        />
      )}

      {/* Delete Modal */}
      {deleteQuizId && (
        <ConfirmDeleteModal
          isOpen={!!deleteQuizId}
          onClose={() => setDeleteQuizId(null)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this quiz?"
          isLoading={isDeleting}
        />
      )}
      {viewQuizId && (
  <ViewQuizModal
    isOpen={!!viewQuizId}
    quizId={viewQuizId}
    onClose={() => setViewQuizId(null)}
  />
)}

    </div>
  );
};

export default QuizzesTable;
