"use client";

import { useEffect, useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { QuizService } from "@/services/quiz.service";
import CustomPagination from "@/app/components/shared/CustomPagination";
import QuizResultModal from "./QuizResultModal";

interface QuizResult {
  _id: string;
  title: string;
  group: {
    name: string;
    members: number;
  };
  participants: number;
  date: string;
}

function QuizResultAccordion({ 
  result, 
  onView 
}: { 
  result: QuizResult; 
  onView: (result: QuizResult) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? contentRef.current.scrollHeight + 20 + "px" : "0px");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight + 20 + "px");
    }
  }, [result, isOpen]);

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-controls={`quiz-result-panel-${result._id}`}
      >
        <span className="font-semibold truncate pr-2">{result.title}</span>
        <div
          className={`text-orange-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          <FaChevronDown />
        </div>
      </button>

      <div
        id={`quiz-result-panel-${result._id}`}
        style={{
          maxHeight,
          transition: "max-height 0.4s ease, opacity 0.3s ease-in-out",
          overflow: "hidden",
        }}
        className="bg-gray-50"
      >
        <div
          ref={contentRef}
          className={`px-4 py-3 text-gray-700 space-y-2 ${isOpen ? "opacity-100" : "opacity-0"} transition-opacity`}
        >
          <p>
            <span className="font-semibold">Group name: </span>
            {result.group.name}
          </p>
          <p>
            <span className="font-semibold">No. of persons in group: </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {result.group.members} persons
            </span>
          </p>
          <p>
            <span className="font-semibold">Participants: </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {result.participants} participants
            </span>
          </p>
          <p>
            <span className="font-semibold">Date: </span>
            {result.date}
          </p>

          <div className="flex gap-4 mt-4 pt-2 border-t border-gray-200">
            <button
              className="cursor-pointer bg-[#9BBE3F] hover:bg-[#8AA835] text-white px-3 py-2 rounded font-medium"
              onClick={() => onView(result)}
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuizResultsTable() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [fade, setFade] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<{ id: string; title: string } | null>(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const fetchResults = async () => {
    try {
      const res = await QuizService.getResult();
      const formattedResults = res.data.map((item: any, index: number) => ({
        _id: item._id || `result-${index}`,
        title: item.quiz?.title || 'Untitled Quiz',
        group: { name: 'Group 1', members: 23 },
        participants: Array.isArray(item.participants) ? item.participants.length : 0,
        date: new Date(item.quiz?.createdAt || Date.now()).toLocaleDateString('en-GB')
      }));
      setResults(formattedResults);
    } catch (err) {
      console.error("Error fetching quiz results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleViewClick = (result: QuizResult) => {
    setSelectedQuiz({ id: result._id, title: result.title });
    setIsModalOpen(true);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="ml-3 text-gray-600">Loading quiz results...</p>
      </div>
    );
  }

  const currentData = results.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <h2 className="text-xl font-bold mb-6">Quiz results</h2>

      {/* Responsive Cards for all screen sizes */}
      <div className="block lg:hidden space-y-3">
        {currentData.map((result) => (
          <QuizResultAccordion 
            key={result._id} 
            result={result} 
            onView={handleViewClick} 
          />
        ))}
      </div>

      {/* Responsive Table for large screens only */}
      <div className="hidden lg:block border rounded-lg shadow-sm bg-white">
        <div className="w-full">
          <div className="bg-[#0D1321] text-white grid grid-cols-6 gap-4 px-4 py-3 rounded-t-lg font-semibold">
            <div className="truncate">Title</div>
            <div className="truncate">Group name</div>
            <div className="truncate">Persons</div>
            <div className="truncate">Participants</div>
            <div className="truncate">Date</div>
            <div className="truncate">Actions</div>
          </div>
          <div className={`${fade ? "opacity-100" : "opacity-0"} transition-all`}>
            {currentData.map((result, index) => (
              <div 
                key={result._id} 
                className={`grid grid-cols-6 gap-4 px-4 py-3 hover:bg-gray-50 ${index !== currentData.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <div className="truncate" title={result.title}>{result.title}</div>
                <div className="truncate" title={result.group.name}>{result.group.name}</div>
                <div className="truncate">{result.group.members} persons</div>
                <div className="truncate">{result.participants} participants</div>
                <div className="truncate">{result.date}</div>
                <div className="truncate">
                  <button
                    className="cursor-pointer bg-[#9BBE3F] hover:bg-[#8AA835] text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleViewClick(result)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alternative: Responsive Grid Layout */}
      {/*
      <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-4">
        {currentData.map((result) => (
          <div key={result._id} className="border border-gray-300 rounded-lg shadow-sm bg-white p-4">
            <h3 className="font-semibold text-lg mb-3 truncate" title={result.title}>
              {result.title}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Group:</span>
                <p className="truncate">{result.group.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Members:</span>
                <p>{result.group.members} persons</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Participants:</span>
                <p>{result.participants} participants</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Date:</span>
                <p>{result.date}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-[#9BBE3F] hover:bg-[#8AA835] text-white px-4 py-2 rounded text-sm font-medium"
                onClick={() => handleViewClick(result)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
      */}
<div className="mt-6 w-full overflow-x-auto">
  <CustomPagination 
    totalPages={totalPages} 
    page={page} 
    setPage={handlePageChange} 
  />
</div>


      {/* Modal */}
      {selectedQuiz && (
        <QuizResultModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedQuiz(null);
          }}
          quizId={selectedQuiz.id}
          quizTitle={selectedQuiz.title}
        />
      )}
    </div>
  );
}