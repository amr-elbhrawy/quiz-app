import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../../store/features/group/groupsSlice";
import { RootState, AppDispatch } from "../../../store/store";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AddGroupModal from "./AddGroupModal";
import { GroupService } from "@/services/group.service";
import { toast } from "react-toastify";

const GroupsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups, loading, error } = useSelector((state: RootState) => state.groups);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleAddGroup = async (groupData: { name: string; students: string[] }) => {
    try {
      await GroupService.create(groupData);
      toast.success("Group created successfully!");
      dispatch(fetchGroups()); // refresh list
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create group");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Groups List</h2>
        <div
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200"
         >
   
                <AddGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddGroup}
      />
        </div>
      </div>

      {/* Modal */}


      {loading && <p className="text-center text-gray-500">Loading groups...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => (
            <div key={group.id} className="flex justify-between items-center p-4 border border-gray-300 rounded-md hover:shadow-sm">
              <div>
                <p className="font-medium">Group: {group.name}</p>
                <p className="text-sm text-gray-600">No. of students: {group.students?.length}</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:text-blue-500">
                  <FaEdit />
                </button>
                <button className="text-gray-600 hover:text-red-500">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && groups.length === 0 && (
        <p className="text-center text-gray-500">No groups found.</p>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">... 1 2 3 ...</div>
    </div>
  );
};

export default GroupsList;
