"use client";

import { useEffect, useState, useRef } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronDown,
} from "react-icons/fa";
import { QuestionService } from "@/services/question.service";
import CustomPagination from "@/app/components/shared/CustomPagination";
import CreateQuestionModal from "./CreateQuestionModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EditQuestionModal from "./EditQuestionModal";
import ViewQuestionModal from "./ViewQuestionModal";

function QuestionAccordion({ question, onDelete, onEdit, onView }: { question: any; onDelete: (question: any) => void; onEdit: (question: any) => void; onView: (question: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setMaxHeight(contentRef.current.scrollHeight + 20 + "px");
      } else {
        setMaxHeight("0px");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight + 20 + "px");
    }
  }, [question, isOpen]);

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none hover:bg-gray-50 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-controls={`question-panel-${question._id}`}
      >
        <span className="font-semibold truncate pr-2">{question.title}</span>
        <div
          className={`text-orange-500 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <FaChevronDown />
        </div>
      </button>

      <div
        id={`question-panel-${question._id}`}
        style={{
          maxHeight: maxHeight,
          transition:
            "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out",
          overflow: "hidden",
        }}
        className="bg-gray-50"
      >
        <div
          ref={contentRef}
          className={`px-4 py-3 text-gray-700 space-y-2 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="space-y-2">
            <p className="flex flex-wrap">
              <span className="font-semibold text-gray-800 min-w-fit">
                Right Answer:{" "}
              </span>
              <span className="ml-1">{question.answer}</span>
            </p>
            <p className="flex flex-wrap">
              <span className="font-semibold text-gray-800 min-w-fit">
                Difficulty:{" "}
              </span>
              <span
                className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                  question.difficulty === "easy"
                    ? "bg-green-100 text-green-800"
                    : question.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
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
              <button
                className="flex items-center gap-1 text-orange-500 hover:text-orange-600 transition-colors duration-200 hover:bg-orange-50 px-2 py-1 rounded"
                title="View"
                onClick={() => onView(question)}
              >
                <FaEye />
                <span className="text-sm">View</span>
              </button>
              <button
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors duration-200 hover:bg-blue-50 px-2 py-1 rounded"
                title="Edit"
                onClick={() => onEdit(question)}
              >
                <FaEdit />
                <span className="text-sm">Edit</span>
              </button>
              <button
                className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors duration-200 hover:bg-red-50 px-2 py-1 rounded"
                title="Delete"
                onClick={() => onDelete(question)}
              >
                <FaTrash />
                <span className="text-sm">Delete</span>
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // حالات مودال الحذف
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // حالات مودال التعديل
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<any>(null);

  // حالات مودال العرض
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [questionToView, setQuestionToView] = useState<any>(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(questions.length / itemsPerPage);

  // دالة لتحميل الأسئلة
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

  useEffect(() => {
    fetchQuestions();
  }, []);

  // دالة لإعادة تحميل الأسئلة بعد الإنشاء
  const handleQuestionCreated = () => {
    fetchQuestions(); // إعادة تحميل كامل للأسئلة
    setIsCreateModalOpen(false);
  };

  // دالة فتح مودال الحذف
  const handleDeleteClick = (question: any) => {
    setQuestionToDelete(question);
    setIsDeleteModalOpen(true);
  };

  // دالة فتح مودال التعديل
  const handleEditClick = (question: any) => {
    setQuestionToEdit(question);
    setIsEditModalOpen(true);
  };

  // دالة فتح مودال العرض
  const handleViewClick = (question: any) => {
    setQuestionToView(question);
    setIsViewModalOpen(true);
  };

  // دالة لإعادة تحميل الأسئلة بعد التعديل
  const handleQuestionUpdated = () => {
    fetchQuestions();
    setIsEditModalOpen(false);
    setQuestionToEdit(null);
  };

  // دالة تأكيد الحذف
  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;

    setIsDeleting(true);
    try {
      await QuestionService.delete(questionToDelete._id);
      await fetchQuestions(); // إعادة تحميل الأسئلة
      setIsDeleteModalOpen(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error("Error deleting question:", error);
      // يمكنك إضافة toast للخطأ هنا
    } finally {
      setIsDeleting(false);
    }
  };

  // دالة إغلاق مودال الحذف
  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setQuestionToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFade(false);
    setTimeout(() => {
      setPage(newPage);
      setFade(true);
    }, 200);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  const currentData = questions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* العنوان وزر الإضافة */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Bank Of Questions</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-full shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200"
        >
          <span className="text-black font-medium">+ Add Question</span>
        </button>
      </div>

      {/* جدول على الشاشات المتوسطة والكبيرة */}
      <div className="hidden sm:block overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden min-w-[600px]">
          <thead className="bg-[#0D1321] text-white">
            <tr>
              <th className="px-4 py-3 border border-gray-300 text-left min-w-[150px] font-semibold">
                Title
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left min-w-[100px] font-semibold">
                Right Answer
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left min-w-[100px] font-semibold">
                Difficulty
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left min-w-[100px] font-semibold">
                Type
              </th>
              <th className="px-4 py-3 border border-gray-300 text-left min-w-[120px] font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={`transition-all duration-300 ${
              fade ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2"
            }`}
          >
            {currentData.map((q, index) => (
              <tr
                key={q._id}
                className="bg-white hover:bg-gray-50 transition-colors duration-200"
                style={{
                  transitionDelay: fade ? `${index * 50}ms` : "0ms",
                }}
              >
                <td className="px-4 py-3 border border-gray-300 truncate max-w-[150px]">
                  {q.title}
                </td>
                <td className="px-4 py-3 border border-gray-300 truncate max-w-[100px]">
                  {q.answer}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      q.difficulty === "easy"
                        ? "bg-green-100 text-green-800"
                        : q.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
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
                    <FaEye 
                      className="cursor-pointer text-orange-500 hover:text-orange-600 transition-colors duration-200" 
                      onClick={() => handleViewClick(q)}
                    />
                    <FaEdit 
                      className="cursor-pointer text-blue-500 hover:text-blue-600 transition-colors duration-200" 
                      onClick={() => handleEditClick(q)}
                    />
                    <FaTrash 
                      className="cursor-pointer text-red-500 hover:text-red-600 transition-colors duration-200" 
                      onClick={() => handleDeleteClick(q)}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {/* صفوف فارغة لتثبيت الطول */}
            {Array.from({ length: itemsPerPage - currentData.length }).map(
              (_, idx) => (
                <tr key={`empty-${idx}`} className="bg-white">
                  <td className="px-4 py-3 border border-gray-300">&nbsp;</td>
                  <td className="px-4 py-3 border border-gray-300">&nbsp;</td>
                  <td className="px-4 py-3 border border-gray-300">&nbsp;</td>
                  <td className="px-4 py-3 border border-gray-300">&nbsp;</td>
                  <td className="px-4 py-3 border border-gray-300">&nbsp;</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Accordion للشاشات الصغيرة */}
      <div className="block sm:hidden space-y-3">
        <div
          className={`transition-all duration-300 ${
            fade ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2"
          }`}
        >
          {currentData.map((q, index) => (
            <div
              key={q._id}
              style={{
                transitionDelay: fade ? `${index * 100}ms` : "0ms",
              }}
              className="transition-all duration-300"
            >
              <QuestionAccordion question={q} onDelete={handleDeleteClick} onEdit={handleEditClick} onView={handleViewClick} />
            </div>
          ))}
        </div>
      </div>

      {/* الباجينشن ثابت بمساحة محفوظة */}
      <div className="mt-6 min-h-[40px]">
        <CustomPagination
          totalPages={totalPages}
          page={page}
          setPage={handlePageChange}
        />
      </div>

      {/* مودال إنشاء السؤال */}
      <CreateQuestionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleQuestionCreated}
      />

      {/* مودال عرض السؤال */}
      <ViewQuestionModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setQuestionToView(null);
        }}
        question={questionToView}
      />

      {/* مودال تعديل السؤال */}
      <EditQuestionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setQuestionToEdit(null);
        }}
        onUpdated={handleQuestionUpdated}
        question={questionToEdit}
      />

      {/* مودال تأكيد الحذف */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete "${questionToDelete?.title}"?`}
        isLoading={isDeleting}
      />
    </div>
  );
}