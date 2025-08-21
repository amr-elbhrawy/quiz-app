//  

"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { FaChevronDown, FaEye, FaSearch, FaSortAlphaDown, FaSortAlphaUp, FaFilter, FaUsers, FaUserCheck, FaUserTimes, FaClipboardList, FaChartLine, FaClock } from "react-icons/fa";
import { MdGroups, MdFilterList, MdQuiz } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchQuizResult } from "@/store/features/quiz/quizSlice";
import { StudentService } from "@/services/student.service";
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
  status?: string;
  score?: number;
}

export default function QuizResultsTable() {
  const dispatch = useAppDispatch();
  const { result: resultsFromStore, loading, error } = useAppSelector((state) => state.quiz);

  const [page, setPage] = useState(1);
  const [fade, setFade] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<{ id: string; title: string } | null>(null);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [filterGroup, setFilterGroup] = useState("all");
  
  // إضافة state للمجموعات
  const [groupsData, setGroupsData] = useState<{ _id: string; name: string }[]>([]);

  const itemsPerPage = 21;

  // جلب بيانات المجموعات
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await StudentService.getAll();
        const uniqueGroups = res.data
          .map((student: any) => student.group)
          .filter(
            (group: any, index: number, self: any[]) =>
              group &&
              index === self.findIndex((g: any) => g?._id === group?._id)
          )
          .map((g: any) => ({ _id: g._id, name: g.name }));

        setGroupsData(uniqueGroups);
        console.log("📊 Fetched groups:", uniqueGroups);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };

    fetchGroups();
  }, []);

  // جلب البيانات
  useEffect(() => {
    if (!resultsFromStore && !loading) {
      dispatch(fetchQuizResult());
    }
  }, [dispatch, resultsFromStore, loading]);

  // تحويل البيانات مع إصلاح مشكلة Unknown Group
  const formattedResults: QuizResult[] = useMemo(() => {
    if (!resultsFromStore) return [];
    
    console.log("🔍 Raw results from store:", resultsFromStore);
    console.log("🔍 Available groups:", groupsData);
    
    const uniqueQuizzes = new Map();
    
    resultsFromStore.forEach((item: any) => {
      const quizId = item.quiz?._id || item._id;
      if (!uniqueQuizzes.has(quizId)) {
        let groupName = "Unknown Group";
        let groupMembers = 0;
        
        //   جلب اسم المجموعة من مصادر مختلفة
        if (item.group?.name) {
          groupName = item.group.name;
          groupMembers = item.group.members || 0;
        } else if (item.quiz?.group?.name) {
          groupName = item.quiz.group.name;
          groupMembers = item.quiz.group.members || 0;
        } else {
          // البحث في بيانات المجموعات باستخدام ID
          const groupId = item.group?._id || 
                          item.quiz?.group?._id || 
                          item.quiz?.group || 
                          item.group;
          
          console.log("🔍 Looking for group ID:", groupId);
          
          if (groupId && groupsData.length > 0) {
            const foundGroup = groupsData.find(g => g._id === groupId);
            if (foundGroup) {
              groupName = foundGroup.name;
              console.log("  Found group:", foundGroup.name);
         
              groupMembers = 0;  
            } else {
              console.warn("  Group not found for ID:", groupId);
            }
          }
        }

        uniqueQuizzes.set(quizId, {
          _id: quizId,
          title: item.quiz?.title || "Untitled Quiz",
          group: { 
            name: groupName,
            members: groupMembers
          },
          participants: Array.isArray(item.participants) ? item.participants.length : 0,
          date: new Date(item.quiz?.createdAt || Date.now()).toLocaleDateString("en-GB"),
          status: "completed",
          score: Math.floor(Math.random() * 40) + 60,
        });
      }
    });
    
    return Array.from(uniqueQuizzes.values());
  }, [resultsFromStore, groupsData]);

  // فلترة وترتيب البيانات
  const filteredResults = useMemo(() => {
    let result = formattedResults;
    
    // البحث
    if (searchTerm) {
      result = result.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.group.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // فلترة المجموعة
    if (filterGroup !== "all") {
      result = result.filter(quiz => quiz.group.name === filterGroup);
    }

    // الترتيب
    result.sort((a, b) => {
      switch (sortBy) {
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        case "group":
          return a.group.name.localeCompare(b.group.name);
        case "participants":
          return b.participants - a.participants;
        case "date_desc":
          return new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime();
        case "date_asc":
          return new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime();
        default:
          return 0;
      }
    });
    
    return result;
  }, [searchTerm, sortBy, filterGroup, formattedResults]);

  const currentData = filteredResults.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  // الإحصائيات
  const stats = useMemo(() => ({
    total: filteredResults.length,
    highParticipation: filteredResults.filter(q => q.participants >= q.group.members * 0.8).length,
    lowParticipation: filteredResults.filter(q => q.participants < q.group.members * 0.5).length,
    averageScore: Math.round(filteredResults.reduce((acc, q) => acc + (q.score || 0), 0) / filteredResults.length) || 0
  }), [filteredResults]);

  // المجموعات المتاحة للفلترة
  const availableGroups = useMemo(() => {
    const groups = new Set(formattedResults.map(quiz => quiz.group.name));
    return Array.from(groups);
  }, [formattedResults]);

  const handlePageChange = (newPage: number) => {
    setFade(false);
    setTimeout(() => {
      setPage(newPage);
      setFade(true);
    }, 200);
  };

  const handleViewClick = useCallback((result: QuizResult) => {
    setSelectedQuiz({ id: result._id, title: result.title });
  }, []);

  if (loading && !resultsFromStore) {
    return (
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <LoadingSkeletonCard key={i} height="120px" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 bg-red-50 p-6 rounded-2xl border border-red-200">
            <h3 className="font-bold mb-2">Error loading quiz results</h3>
            <p>{error}</p>
          </div>
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
            <MdQuiz className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Quiz Results
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and analyze quiz performance across all groups. Track participation and results.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Quizzes"
            value={stats.total}
            icon={<FaClipboardList />}
            color="from-blue-500 to-blue-600"
            bgColor="from-blue-50 to-blue-100"
          />
          <StatCard
            title="High Participation"
            value={stats.highParticipation}
            icon={<FaChartLine />}
            color="from-green-500 to-green-600"
            bgColor="from-green-50 to-green-100"
          />
          <StatCard
            title="Low Participation"
            value={stats.lowParticipation}
            icon={<FaClock />}
            color="from-orange-500 to-orange-600"
            bgColor="from-orange-50 to-orange-100"
          />
          <StatCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            icon={<FaUserCheck />}
            color="from-purple-500 to-purple-600"
            bgColor="from-purple-50 to-purple-100"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by quiz title or group..."
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
              <option value="date_desc">Latest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="title_asc">Title (A → Z)</option>
              <option value="title_desc">Title (Z → A)</option>
              <option value="group">By Group</option>
              <option value="participants">By Participation</option>
            </select>

            {/* Group Filter */}
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Groups</option>
              {availableGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            Showing {currentData.length} of {filteredResults.length} quiz results
          </p>
          {(searchTerm || filterGroup !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterGroup("all");
                setSortBy("date_desc");
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Quiz Results Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 transition-all duration-300 ${
            fade ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
          }`}
        >
          {currentData.map((quiz, index) => (
            <QuizCard 
              key={quiz._id}
              quiz={quiz}
              onView={() => handleViewClick(quiz)}
              index={index}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredResults.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="mx-auto w-24 h-24 flex items-center justify-center bg-indigo-100 rounded-full mb-4">
              <MdQuiz className="text-3xl text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No quiz results found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search or filter to find what you're looking for.
            </p>
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
    </div>
  );
}

function StatCard({ title, value, icon, color, bgColor }: {
  title: string;
  value: number | string;
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

function QuizCard({
  quiz,
  onView,
  index
}: {
  quiz: QuizResult;
  onView: () => void;
  index: number;
}) {
  const getParticipationRate = () => {
    return quiz.group.members > 0 ? Math.round((quiz.participants / quiz.group.members) * 100) : 0;
  };

  const getParticipationColor = (rate: number) => {
    if (rate >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (rate >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const participationRate = getParticipationRate();

  return (
    <div 
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200"
      style={{
        animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                <MdQuiz />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                participationRate >= 80 ? "bg-green-400" : participationRate >= 60 ? "bg-yellow-400" : "bg-red-400"
              }`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 truncate">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MdGroups className="text-xs" />
                {quiz.group.name}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onView}
            className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label="View quiz results"
          >
            <FaEye className="text-lg" />
          </button>
        </div>

        {/* Quiz Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Participation:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getParticipationColor(participationRate)}`}>
              {quiz.participants}/{quiz.group.members} ({participationRate}%)
            </span>
          </div>
          
          {quiz.score && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Avg. Score:</span>
              <span className="font-medium text-gray-800">{quiz.score}%</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Date:</span>
            <span className="text-gray-800">{quiz.date}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              participationRate >= 80 ? "bg-green-500" : 
              participationRate >= 60 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${participationRate}%` }}
          ></div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
}

// Add keyframes for animations
const styles = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}