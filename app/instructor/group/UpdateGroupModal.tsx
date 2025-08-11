"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { IoMdCheckmark } from "react-icons/io";
import { HiOutlineXMark } from "react-icons/hi2";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { GroupService } from "@/services/group.service";
import { StudentService } from "@/services/student.service";
import { toast } from "react-toastify";

interface UpdateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onUpdated: () => void;
}

export default function UpdateGroupModal({
  isOpen,
  onClose,
  groupId,
  onUpdated,
}: UpdateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [groupStudents, setGroupStudents] = useState<
    { _id: string; first_name: string; last_name: string }[]
  >([]);
  const [availableStudents, setAvailableStudents] = useState<
    { _id: string; first_name: string; last_name: string }[]
  >([]);
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && groupId) {
      loadData();
    }
  }, [isOpen, groupId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupRes, availableRes] = await Promise.all([
        GroupService.getById(groupId),
        StudentService.getAllWithoutGroup(),
      ]);
      setGroupName(groupRes.data.name || "");
      setGroupStudents(groupRes.data.students || []);
      setAvailableStudents(availableRes.data || []);
    } catch {
      toast.error("Failed to load group data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!groupName.trim()) {
      toast.warning("Please enter a group name");
      return;
    }

    const updatedStudentsIds = [
      ...groupStudents.map((s) => s._id),
      ...selectedAvailable,
    ];

    setSaving(true);
    try {
      await GroupService.update(groupId, {
        name: groupName,
        students: updatedStudentsIds,
      });
      toast.success("Group updated successfully!");
      onUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update group");
    } finally {
      setSaving(false);
    }
  };

  const removeStudent = (studentId: string) => {
    setGroupStudents((prev) => prev.filter((s) => s._id !== studentId));
    const removedStudent = groupStudents.find((s) => s._id === studentId);
    if (removedStudent) {
      setAvailableStudents((prev) => [...prev, removedStudent]);
    }
  };

  const toggleAvailableSelection = (id: string) => {
    setSelectedAvailable((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onClose} hideCloseButton>
      <ModalContent>
        <>
          {/* Header */}
          <ModalHeader className="flex items-center justify-between border-b border-gray-300 p-0">
            <h2 className="px-4 py-3 text-lg font-semibold">
              Update Group
            </h2>
            <div className="flex items-center">
              <button
                onClick={handleSave}
                title="Save Changes"
                disabled={saving}
                className="flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-green-800 disabled:opacity-50 cursor-pointer"
              >
                <IoMdCheckmark />
              </button>
              <button
                onClick={onClose}
                title="Cancel"
                className="flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-red-800 disabled:opacity-50 cursor-pointer"
              >
                <HiOutlineXMark />
              </button>
            </div>
          </ModalHeader>

          {/* Body */}
          <ModalBody>
            {loading ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Group Name */}
                <div className="flex items-center rounded-md border border-gray-300 overflow-hidden w-full">
                  <span className="bg-orange-100 px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                    Group Name
                  </span>
                  <input
                    type="text"
                    placeholder="Enter group name"
                    className="flex-1 px-3 py-2 outline-none text-sm"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>

                {/* Current Students */}
                <div className="rounded-md border border-gray-300 p-2 max-h-40 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">Group Students</p>
                  {groupStudents.length > 0 ? (
                    groupStudents.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded"
                      >
                        <span>
                          {student.first_name} {student.last_name}
                        </span>
                        <button
                          onClick={() => removeStudent(student._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No students in group</p>
                  )}
                </div>

                {/* Available Students */}
                <div className="rounded-md border border-gray-300 p-2 max-h-40 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">Available Students</p>
                  {availableStudents.length > 0 ? (
                    availableStudents.map((student) => (
                      <label
                        key={student._id}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAvailable.includes(student._id)}
                          onChange={() => toggleAvailableSelection(student._id)}
                        />
                        {student.first_name} {student.last_name}
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No available students</p>
                  )}
                </div>
              </div>
            )}
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}
