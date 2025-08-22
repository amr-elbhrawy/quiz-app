"use client";

import { useEffect, useState } from "react";
import { StudentService } from "../../../services/student.service";
import Image from "next/image";
import { FaEye, FaSearch, FaSortAlphaDown, FaSortAlphaUp, FaFilter, FaUsers, FaUserCheck, FaUserTimes, FaUserGraduate } from "react-icons/fa";
import { MdGroups, MdFilterList } from "react-icons/md";
import CustomPagination from "@/app/components/shared/CustomPagination";
import ViewStudentModal from "./ViewGroupModal";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

export interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  role: string;
  group?: { name: string };
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [fade, setFade] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [filterStatus, setFilterStatus] = useState("all");

  const itemsPerPage = 21;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await StudentService.getAll();
        setStudents(res.data);
        setFilteredStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = students;
    
    // Apply search
    if (searchTerm) {
      result = result.filter(student => 
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter(student => student.status === filterStatus);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
        case "name_desc":
          return `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`);
        case "group":
          return (a.group?.name || "").localeCompare(b.group?.name || "");
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    
    setFilteredStudents(result);
    setPage(1); // Reset to first page when filtering
  }, [searchTerm, sortBy, filterStatus, students]);

  const currentData = filteredStudents.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Statistics
  const stats = {
    total: filteredStudents.length,
    active: filteredStudents.filter(s => s.status === "active").length,
    inactive: filteredStudents.filter(s => s.status === "inactive").length,
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
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <LoadingSkeletonCard key={i} height="80px" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-4">
            <FaUserGraduate className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Students Directory
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage and view all student information in one place. Find students quickly with our advanced filters.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Students"
            value={stats.total}
            icon={<FaUsers />}
            color="from-blue-500 to-blue-600"
            bgColor="from-blue-50 to-blue-100"
          />
          <StatCard
            title="Active Students"
            value={stats.active}
            icon={<FaUserCheck />}
            color="from-green-500 to-green-600"
            bgColor="from-green-50 to-green-100"
          />
          <StatCard
            title="Inactive Students"
            value={stats.inactive}
            icon={<FaUserTimes />}
            color="from-red-500 to-red-600"
            bgColor="from-red-50 to-red-100"
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
                placeholder="Search by name or email..."
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
              <option value="name_asc">Name (A → Z)</option>
              <option value="name_desc">Name (Z → A)</option>
              <option value="group">By Group</option>
              <option value="status">By Status</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            Showing {currentData.length} of {filteredStudents.length} students
          </p>
          {(searchTerm || filterStatus !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setSortBy("name_asc");
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Students Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 transition-all duration-300 ${
            fade ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
          }`}
        >
          {currentData.map((student, index) => (
            <StudentCard 
              key={student._id}
              student={student}
              onView={() => setSelectedStudent(student)}
              index={index}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="mx-auto w-24 h-24 flex items-center justify-center bg-indigo-100 rounded-full mb-4">
              <FaUserGraduate className="text-3xl text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No students found</h3>
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

        <ViewStudentModal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          student={selectedStudent}
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

function StudentCard({
  student,
  onView,
  index
}: {
  student: Student;
  onView: () => void;
  index: number;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {student.first_name[0]}{student.last_name[0]}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                student.status === "active" ? "bg-green-400" : "bg-red-400"
              }`}></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 capitalize group-hover:text-indigo-600 transition-colors duration-200">
                {student.first_name} {student.last_name}
              </h3>
              <p className="text-sm text-gray-500 truncate max-w-[150px]">
                {student.email}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onView}
            className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label="View student details"
          >
            <FaEye className="text-lg" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
              {student.status}
            </span>
          </div>
          
          {student.group && (
            <div className="flex items-center gap-1 text-gray-500">
              <MdGroups className="text-sm" />
              <span className="text-xs">{student.group.name}</span>
            </div>
          )}
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