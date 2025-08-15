"use client";

import { useEffect, useState, useRef } from "react";
import { FaEye, FaEdit, FaTrash, FaChevronDown } from "react-icons/fa";
import { QuestionService } from "@/services/question.service";
import CustomPagination from "@/app/components/shared/CustomPagination";
import CreateQuestionModal from "./CreateQuestionModal";
import ConfirmDeleteModal from "../../components/shared/ConfirmDeleteModal";
import EditQuestionModal from "./EditQuestionModal";
import ViewQuestionModal from "./ViewQuestionModal";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

function QuestionAccordion({ 
  question, 
  onDelete, 
  onEdit, 
  onView 
}: { 
  question: any; 
  onDelete: (question: any) => void; 
  onEdit: (question: any) => void; 
  onView: (question: any) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight + 20}px` : "0px");
    }
  }, [isOpen, question]);

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
              <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                question.difficulty === "easy" ? "bg-green-100 text-green-800" :
                question.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
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
              <button onClick={() => onView(question)} className="action-btn text-orange-500 hover:text-orange-600">
                <FaEye /><span className="text-sm">View</span>
              </button>
              <button onClick={() => onEdit(question)} className="action-btn text-blue-500 hover:text-blue-600">
                <FaEdit /><span className="text-sm">Edit</span>
              </button>
              <button onClick={() => onDelete(question)} className="action-btn text-red-500 hover:text-red-600">
                <FaTrash /><span className="text-sm">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuestionsTable() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const currentData = questions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const fetchQuestions = async () => {
    try {
      const res = await QuestionService.getAll();
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handlePageChange = (newPage: number) => {
    setFade(false);
    setTimeout(() => {
      setPage(newPage);
      setFade(true);
    }, 200);
  };

  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;
    setIsDeleting(true);
    try {
      await QuestionService.delete(questionToDelete._id);
      await fetchQuestions();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting question:", error);
    } finally {
      setIsDeleting(false);
    }
  };

if (loading) {
  return (
    <div className="p-4 sm:p-6 w-full"> {/* تغيير min-h-screen إلى w-full */}
      <LoadingSkeletonCard 
        width="100%"
        height="60px"
        count={5}
        className="mx-auto max-w-4xl" // إضافة className للتحكم في العرض
      />
    </div>
  );
}

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Question Bank</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
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
            {currentData.map((q, index) => (
              <tr 
                key={q._id}
                className="hover:bg-gray-50 transition-colors"
                style={{ transitionDelay: fade ? `${index * 50}ms` : "0ms" }}
              >
                <td className="px-4 py-3 border border-gray-300 truncate max-w-[150px]">{q.title}</td>
                <td className="px-4 py-3 border border-gray-300 truncate max-w-[100px]">{q.answer}</td>
                <td className="px-4 py-3 border border-gray-300">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    q.difficulty === "easy" ? "bg-green-100 text-green-800" :
                    q.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {q.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {q.type}
                  </span>
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <div className="flex gap-3 text-lg">
                    <FaEye onClick={() => setQuestionToView(q) || setIsViewModalOpen(true)} className="icon-btn text-orange-500" />
                    <FaEdit onClick={() => setQuestionToEdit(q) || setIsEditModalOpen(true)} className="icon-btn text-blue-500" />
                    <FaTrash onClick={() => setQuestionToDelete(q) || setIsDeleteModalOpen(true)} className="icon-btn text-red-500" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Accordion */}
      <div className="block sm:hidden space-y-3">
        {currentData.map((q, index) => (
          <div 
            key={q._id}
            style={{ transitionDelay: fade ? `${index * 100}ms` : "0ms" }}
            className={`transition-all duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
          >
            <QuestionAccordion 
              question={q} 
              onDelete={(q) => setQuestionToDelete(q) || setIsDeleteModalOpen(true)}
              onEdit={(q) => setQuestionToEdit(q) || setIsEditModalOpen(true)}
              onView={(q) => setQuestionToView(q) || setIsViewModalOpen(true)}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 min-h-[40px]">
        <CustomPagination 
          totalPages={totalPages} 
          page={page} 
          setPage={handlePageChange} 
        />
      </div>

      {/* Modals */}
      <CreateQuestionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={fetchQuestions}
      />

      <ViewQuestionModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        question={questionToView}
      />

      <EditQuestionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={fetchQuestions}
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

 