"use client";

import { useEffect, useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { QuizService } from "@/services/quiz.service";
import CustomPagination from "@/app/components/shared/CustomPagination";
import QuizResultModal from "./QuizResultModal";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

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
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight + 20}px` : "0px");
    }
  }, [isOpen, result]);

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold truncate pr-2">{result.title}</span>
        <FaChevronDown className={`text-orange-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        style={{ 
          maxHeight,
          transition: "max-height 0.4s ease, opacity 0.3s ease-in-out"
        }}
        className="bg-gray-50 overflow-hidden"
      >
        <div className={`px-4 py-3 space-y-2 ${isOpen ? "opacity-100" : "opacity-0"}`}>
          <p><span className="font-semibold">Group: </span>{result.group.name}</p>
          <p>
            <span className="font-semibold">Members: </span>
            <span className="badge bg-blue-100 text-blue-800">
              {result.group.members} persons
            </span>
          </p>
          <p>
            <span className="font-semibold">Participants: </span>
            <span className="badge bg-green-100 text-green-800">
              {result.participants}
            </span>
          </p>
          <p><span className="font-semibold">Date: </span>{result.date}</p>

          <button
            className="btn-primary mt-4"
            onClick={() => onView(result)}
          >
            View Results
          </button>
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
  const [selectedQuiz, setSelectedQuiz] = useState<{ id: string; title: string } | null>(null);

  const itemsPerPage = 5;
  const currentData = results.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const fetchResults = async () => {
    try {
      const res = await QuizService.getResult();
      const formattedResults = res.data.map((item: any) => ({
        _id: item._id || `result-${Math.random().toString(36).substr(2, 9)}`,
        title: item.quiz?.title || 'Untitled Quiz',
        group: { 
          name: item.group?.name || 'Group 1', 
          members: item.group?.members || 0 
        },
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
      <div className="p-4 sm:p-6 space-y-4">
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <LoadingSkeletonCard key={i} height="80px" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl font-bold mb-6">Quiz Results</h2>

      {/* Mobile View */}
      <div className="block lg:hidden space-y-3">
        {currentData.map(result => (
          <QuizResultAccordion 
            key={result._id} 
            result={result} 
            onView={handleViewClick} 
          />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border rounded-lg shadow-sm">
          <thead className="bg-[#0D1321] text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Group</th>
              <th className="p-3 text-left">Members</th>
              <th className="p-3 text-left">Participants</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className={`${fade ? "opacity-100" : "opacity-0"}`}>
            {currentData.map(result => (
              <tr key={result._id} className="hover:bg-gray-50 border-b">
                <td className="p-3 truncate max-w-xs">{result.title}</td>
                <td className="p-3">{result.group.name}</td>
                <td className="p-3">{result.group.members}</td>
                <td className="p-3">{result.participants}</td>
                <td className="p-3">{result.date}</td>
                <td className="p-3">
                  <button className="cursor-pointer bg-[#9BBE3F] hover:bg-[#8AA835] text-white px-3 py-1 rounded text-sm" onClick={() => handleViewClick(result)}>View</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <CustomPagination 
        totalPages={totalPages} 
        page={page} 
        setPage={handlePageChange} 
        className="mt-6"
      />

      {/* Modal */}
      {selectedQuiz && (
        <QuizResultModal
          isOpen={!!selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          quizId={selectedQuiz.id}
          quizTitle={selectedQuiz.title}
        />
      )}
    </div>
  );
}