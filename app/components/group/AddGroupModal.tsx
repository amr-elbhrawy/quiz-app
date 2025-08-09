"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { StudentService } from "@/services/student.service";
import { GroupService } from "@/services/group.service";
import { toast } from "react-toastify";
import { IoMdCheckmark } from 'react-icons/io';
import { HiOutlineXMark } from 'react-icons/hi2';
interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void; // بعد الحفظ
}

export default function AddGroupModal({ isOpen, onClose, onAdded }: AddGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentsList, setStudentsList] = useState<{ _id: string; first_name: string; last_name: string }[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingStudents(true);
      StudentService.getAllWithoutGroup()
        .then((res) => setStudentsList(res.data))
        .catch(() => toast.error("Failed to load students list"))
        .finally(() => setLoadingStudents(false));
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!groupName.trim()) {
      toast.warning("Please enter a group name");
      return;
    }
    if (selectedStudents.length === 0) {
      toast.warning("Please select at least one student");
      return;
    }

    setSaving(true);
    try {
      await GroupService.create({ name: groupName, students: selectedStudents });
      toast.success("Group created successfully");
      setGroupName("");
      setSelectedStudents([]);
      onClose();
      onAdded();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create group");
    } finally {
      setSaving(false);
    }
  };

  const toggleStudentSelection = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onClose} hideCloseButton>
      <ModalContent>
        <>
<ModalHeader className="flex items-center justify-between border-b border-gray-300 p-0">
  <h2 className="px-4 py-3 text-lg font-semibold">
    Set up a new Group
  </h2>
  <div className="flex items-center">
    <button
      onClick={handleSave}
      title="Create"
      disabled={saving}
      className="flex items-center justify-center w-12 h-12 border-l border-gray-300  hover:text-green-800   disabled:opacity-50 cursor-pointer text-xl0"
    >
      <IoMdCheckmark />
    </button>
    <button
      onClick={onClose}
      title="Cancel"
      className="flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-red-800   disabled:opacity-50 cursor-pointer text-xl"
    >
      <HiOutlineXMark />
    </button>
  </div>
</ModalHeader>


          <ModalBody>
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

              {/* Students */}
              <div className="rounded-md border border-gray-300 p-2 max-h-48 overflow-y-auto">
                <p className="text-sm font-medium mb-2">Select Students</p>
                {loadingStudents ? (
                  <p className="text-gray-500 text-sm">Loading...</p>
                ) : studentsList.length === 0 ? (
                  <p className="text-gray-500 text-sm">No students available</p>
                ) : (
                  studentsList.map((student) => (
                    <label
                      key={student._id}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => toggleStudentSelection(student._id)}
                      />
                      {student.first_name} {student.last_name}
                    </label>
                  ))
                )}
              </div>
            </div>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}
