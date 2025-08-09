"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "@/store/features/group/groupsSlice";
import { GroupService } from "@/services/group.service";
import { toast } from "react-toastify";
import AddGroupModal from "./AddGroupModal";
import UpdateGroupModal from "./UpdateGroupModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import CustomPagination from "../shared/CustomPagination";

export default function GroupsList() {
  const dispatch = useDispatch<any>();
  const { groups, loading } = useSelector((state: any) => state.groups);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // عدد الكروت في الصفحة
  const totalPages = Math.ceil(groups.length / pageSize);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleDeleteClick = (id: string) => {
    setGroupToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;

    try {
      await GroupService.delete(groupToDelete);
      toast.success("Group deleted successfully");
      dispatch(fetchGroups());
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete group");
    } finally {
      setIsDeleteModalOpen(false);
      setGroupToDelete(null);
    }
  };

  const paginatedGroups = groups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* العنوان + زر إضافة */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Groups List</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className=" cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200"
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
                <h3 className="font-semibold">
                  Group : {group.name || "name"}
                </h3>
                <p className="text-gray-600 text-sm">
                  No. of students : {group.students?.length || 0}
                </p>
              </div>

              {/* الأزرار */}
              <div className="flex gap-4 mt-4">
                <button
                  className="text-gray-600 hover:text-amber-500 cursor-pointer"
                  onClick={() => setEditGroupId(group._id)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-gray-600 hover:text-red-500  cursor-pointer"
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

      {/* مودال الإضافة */}
      {isAddModalOpen && (
        <AddGroupModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdded={() => dispatch(fetchGroups())}
        />
      )}

      {/* مودال التعديل */}
      {editGroupId && (
        <UpdateGroupModal
          isOpen={!!editGroupId}
          onClose={() => setEditGroupId(null)}
          groupId={editGroupId}
          onUpdated={() => dispatch(fetchGroups())}
        />
      )}

      {/* مودال الحذف */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this group?"
      />
    </div>
  );
}
