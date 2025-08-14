"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { StudentService } from "@/services/student.service";
import { GroupService } from "@/services/group.service";
import { toast } from "react-toastify";
import AddGroupModal from "./AddGroupModal";
import UpdateGroupModal from "./UpdateGroupModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import CustomPagination from "../../components/shared/CustomPagination";

export default function GroupsList() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(""); // ⬅️ state للسيرش

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetchGroupsFromStudents();
  }, []);

  const fetchGroupsFromStudents = async () => {
    try {
      setLoading(true);
      const { data } = await StudentService.getAll();
      const groupMap: Record<string, any> = {};
      data.forEach((student: any) => {
        if (student.group) {
          const groupId = student.group._id;
          if (!groupMap[groupId]) {
            groupMap[groupId] = { ...student.group, students: [] };
          }
          groupMap[groupId].students.push(student);
        }
      });
      setGroups(Object.values(groupMap));
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

  // ⬅️ فلترة المجموعات حسب السيرش
  const filteredGroups = groups.filter((group) =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGroups.length / pageSize);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* العنوان + زر إضافة + سيرش */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Groups List</h2>

        {/* سيرش */}
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // ⬅️ يرجع لأول صفحة عند البحث
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
        />

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200"
        >
          <FaPlus /> Add Group
        </button>
      </div>

      {/* الكروت */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : paginatedGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedGroups.map((group: any) => (
            <div
              key={group._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="font-semibold mb-2">
                  Group : {group.name || "name"}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  No. of students : {group.students?.length || 0}
                </p>

                {group.students && group.students.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {group.students.map((student: any) => (
                      <li key={student._id}>
                        {student.first_name} {student.last_name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm italic">No students</p>
                )}
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  className="text-gray-600 hover:text-amber-500 cursor-pointer"
                  onClick={() => setEditGroupId(group._id)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-gray-600 hover:text-red-500 cursor-pointer"
                  onClick={() => handleDeleteClick(group._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No groups found</p>
      )}

      {/* الباجينشن */}
      <CustomPagination
        totalPages={totalPages}
        page={currentPage}
        setPage={setCurrentPage}
      />

      {/* مودالات */}
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
        message="Are you sure you want to delete this group?"
      />
    </div>
  );
}
