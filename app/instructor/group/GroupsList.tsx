"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUsers, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { StudentService } from "@/services/student.service";
import { GroupService } from "@/services/group.service";
import { toast } from "react-toastify";
import AddGroupModal from "./AddGroupModal";
import UpdateGroupModal from "./UpdateGroupModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import CustomPagination from "../../components/shared/CustomPagination";
import LoadingSkeletonCard from "@/app/components/shared/LoadingSkeletonCard";

export default function GroupsList() {
  const [groups, setGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(true);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [filterSize, setFilterSize] = useState("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 21;

  useEffect(() => {
    fetchGroupsFromStudents();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = groups;
    
    // Apply search
    if (searchTerm) {
      result = result.filter(group => 
        group.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply size filter
    if (filterSize !== "all") {
      const studentCount = (group: any) => group.students?.length || 0;
      switch (filterSize) {
        case "small":
          result = result.filter(group => studentCount(group) <= 5);
          break;
        case "medium":
          result = result.filter(group => studentCount(group) > 5 && studentCount(group) <= 15);
          break;
        case "large":
          result = result.filter(group => studentCount(group) > 15);
          break;
        case "empty":
          result = result.filter(group => studentCount(group) === 0);
          break;
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name_desc":
          return (b.name || "").localeCompare(a.name || "");
        case "size_asc":
          return (a.students?.length || 0) - (b.students?.length || 0);
        case "size_desc":
          return (b.students?.length || 0) - (a.students?.length || 0);
        default:
          return 0;
      }
    });
    
    setFilteredGroups(result);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, sortBy, filterSize, groups]);

  const fetchGroupsFromStudents = async () => {
    try {
      setLoading(true);
      const { data } = await StudentService.getAll();
      const groupMap: Record<string, any> = {};
      
      data.forEach((student: any) => {
        if (student.group) {
          const groupId = student.group._id;
          if (!groupMap[groupId]) {
            groupMap[groupId] = { 
              ...student.group, 
              students: [],
              activeStudents: 0,
              inactiveStudents: 0
            };
          }
          groupMap[groupId].students.push(student);
          
          // Count active/inactive students
          if (student.status === "active") {
            groupMap[groupId].activeStudents++;
          } else {
            groupMap[groupId].inactiveStudents++;
          }
        }
      });
      
      setGroups(Object.values(groupMap));
      setFilteredGroups(Object.values(groupMap));
    } catch (error) {
      console.error("Error fetching groups from students:", error);
      toast.error("Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setGroupToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;
    try {
      await GroupService.delete(groupToDelete);
      toast.success("Group deleted successfully");
      fetchGroupsFromStudents();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete group");
    } finally {
      setIsDeleteModalOpen(false);
      setGroupToDelete(null);
    }
  };

  const currentData = filteredGroups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);

  // Statistics
  const stats = {
    total: filteredGroups.length,
    withStudents: filteredGroups.filter(g => (g.students?.length || 0) > 0).length,
    empty: filteredGroups.filter(g => (g.students?.length || 0) === 0).length,
  };

  const handlePageChange = (newPage: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentPage(newPage);
      setFade(true);
    }, 200);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <LoadingSkeletonCard key={i} height="120px" />
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
            <MdGroups className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Groups Directory
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage and organize student groups efficiently. View group details and member information.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Groups"
            value={stats.total}
            icon={<MdGroups />}
            color="from-blue-500 to-blue-600"
            bgColor="from-blue-50 to-blue-100"
          />
          <StatCard
            title="Groups with Students"
            value={stats.withStudents}
            icon={<FaUserCheck />}
            color="from-green-500 to-green-600"
            bgColor="from-green-50 to-green-100"
          />
          <StatCard
            title="Empty Groups"
            value={stats.empty}
            icon={<FaUserTimes />}
            color="from-orange-500 to-orange-600"
            bgColor="from-orange-50 to-orange-100"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
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
              <option value="size_asc">Size (Small → Large)</option>
              <option value="size_desc">Size (Large → Small)</option>
            </select>

            {/* Size Filter */}
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Sizes</option>
              <option value="small">Small (≤5 students)</option>
              <option value="medium">Medium (6-15 students)</option>
              <option value="large">Large (>15 students)</option>
              <option value="empty">Empty Groups</option>
            </select>

            {/* Add Group Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaPlus className="text-sm" />
              Add Group
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            Showing {currentData.length} of {filteredGroups.length} groups
          </p>
          {(searchTerm || filterSize !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterSize("all");
                setSortBy("name_asc");
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Groups Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 transition-all duration-300 ${
            fade ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
          }`}
        >
          {currentData.map((group, index) => (
            <GroupCard 
              key={group._id}
              group={group}
              onEdit={() => setEditGroupId(group._id)}
              onDelete={() => handleDeleteClick(group._id)}
              index={index}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="mx-auto w-24 h-24 flex items-center justify-center bg-indigo-100 rounded-full mb-4">
              <MdGroups className="text-3xl text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No groups found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Try adjusting your search or filter to find what you're looking for, or create a new group.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <FaPlus className="text-sm" />
              Create First Group
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 bg-white rounded-2xl shadow-md p-4">
            <CustomPagination
              totalPages={totalPages}
              page={currentPage}
              setPage={handlePageChange}
            />
          </div>
        )}

        {/* Modals */}
        {isAddModalOpen && (
          <AddGroupModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdded={() => fetchGroupsFromStudents()}
          />
        )}

        {editGroupId && (
          <UpdateGroupModal
            isOpen={!!editGroupId}
            onClose={() => setEditGroupId(null)}
            groupId={editGroupId}
            onUpdated={() => fetchGroupsFromStudents()}
          />
        )}

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this group? This action cannot be undone."
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

function GroupCard({
  group,
  onEdit,
  onDelete,
  index
}: {
  group: any;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}) {
  const studentCount = group.students?.length || 0;
  const activeCount = group.activeStudents || 0;
  const inactiveCount = group.inactiveStudents || 0;

  const getSizeColor = (count: number) => {
    if (count === 0) return "bg-gray-100 text-gray-800 border-gray-200";
    if (count <= 5) return "bg-blue-100 text-blue-800 border-blue-200";
    if (count <= 15) return "bg-green-100 text-green-800 border-green-200";
    return "bg-purple-100 text-purple-800 border-purple-200";
  };

  const getSizeLabel = (count: number) => {
    if (count === 0) return "Empty";
    if (count <= 5) return "Small";
    if (count <= 15) return "Medium";
    return "Large";
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
                <MdGroups />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-white text-xs font-bold`}>
                {studentCount}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">
                {group.name || "Unnamed Group"}
              </h3>
              <p className="text-sm text-gray-500">
                {studentCount} {studentCount === 1 ? 'student' : 'students'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={onEdit}
              className="text-amber-500 hover:text-amber-700 hover:bg-amber-50 p-2 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Edit group"
            >
              <FaEdit className="text-lg" />
            </button>
            <button 
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Delete group"
            >
              <FaTrash className="text-lg" />
            </button>
          </div>
        </div>

        {/* Student Status Stats */}
        {studentCount > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <FaUserCheck className="text-green-500 text-sm" />
              <span className="text-sm text-green-600 font-medium">{activeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaUserTimes className="text-red-500 text-sm" />
              <span className="text-sm text-red-600 font-medium">{inactiveCount}</span>
            </div>
          </div>
        )}

        {/* Students List */}
        <div className="mb-4">
          {group.students && group.students.length > 0 ? (
            <div className="max-h-24 overflow-y-auto">
              <ul className="space-y-1">
                {group.students.slice(0, 3).map((student: any) => (
                  <li key={student._id} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className={`w-2 h-2 rounded-full ${
                      student.status === "active" ? "bg-green-400" : "bg-red-400"
                    }`}></div>
                    <span className="truncate">
                      {student.first_name} {student.last_name}
                    </span>
                  </li>
                ))}
                {group.students.length > 3 && (
                  <li className="text-xs text-gray-500 italic">
                    and {group.students.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">No students assigned</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSizeColor(studentCount)}`}>
            {getSizeLabel(studentCount)}
          </span>
          
          <div className="text-xs text-gray-500">
            ID: {group._id?.slice(-6)}
          </div>
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