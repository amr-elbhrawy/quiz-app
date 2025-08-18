"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { IoMdCheckmark } from "react-icons/io";
import { HiOutlineXMark } from "react-icons/hi2";
import { FaPlus, FaMinus } from "react-icons/fa";
import { StudentService } from "@/services/student.service";
import { GroupService } from "@/services/group.service";
import { toast } from "react-toastify";
import Loader from "@/app/components/shared/LoadingSkeletonCard";

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;  
}

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function AddGroupModal({ isOpen, onClose, onAdded }: AddGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [saving, setSaving] = useState(false);
  const maxStudents = 25; // Default max students

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setGroupName("");
      setSelectedStudents([]);
      setAvailableStudents([]);
      setLoadingStudents(true);
      
      StudentService.getAllWithoutGroup()
        .then((res) => {
          console.log("Available students for new group:", res.data);
          setAvailableStudents(res.data || []);
        })
        .catch((error) => {
          console.error("Error loading students:", error);
          toast.error("Failed to load students list");
        })
        .finally(() => setLoadingStudents(false));
    }
  }, [isOpen]);

  const handleAddStudent = (student: Student) => {
    if (selectedStudents.length >= maxStudents) {
      toast.warning(`The group reached the maximum limit of ${maxStudents} students`);
      return;
    }
    
    setSelectedStudents([...selectedStudents, student]);
    setAvailableStudents(availableStudents.filter(s => s._id !== student._id));
  };

  const handleRemoveStudent = (student: Student) => {
    setSelectedStudents(selectedStudents.filter(s => s._id !== student._id));
    setAvailableStudents([...availableStudents, student].sort((a, b) => 
      `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
    ));
  };

  const handleSave = async () => {
    if (!groupName.trim()) {
      toast.warning("Group name is required");
      return;
    }
    if (selectedStudents.length === 0) {
      toast.warning("Please select at least one student");
      return;
    }

    setSaving(true);
    try {
      const createData = {
        name: groupName.trim(),
        students: selectedStudents.map(s => s._id)
      };
      
      console.log("Creating group with data:", createData);
      await GroupService.create(createData);
      
      toast.success("Group created successfully");
      
      // Reset form
      setGroupName("");
      setSelectedStudents([]);
      
      onClose();
      onAdded();
    } catch (error: any) {
      console.error("Error creating group:", error);
      const errorMessage = error?.response?.data?.message || "Failed to create group";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={handleClose} hideCloseButton size="2xl">
      <ModalContent>
        <>
          <ModalHeader className="flex items-center justify-between border-b border-gray-300 p-0">
            <h2 className="px-4 py-3 text-lg font-semibold">
              Create New Group
            </h2>
            <div className="flex items-center">
              <button
                onClick={handleSave}
                title="Create"
                disabled={saving || loadingStudents}
                className="flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-green-800 disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <IoMdCheckmark />
                )}
              </button>
              <button
                onClick={handleClose}
                title="Cancel"
                disabled={saving}
                className="flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-red-800 cursor-pointer disabled:opacity-50"
              >
                <HiOutlineXMark />
              </button>
            </div>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto">
            {loadingStudents ? (
              <div className="p-4 text-center">
                <Loader width="100%" height="40px" count={3} />
                <p className="mt-2 text-gray-600 text-sm">Loading students...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Group Name Input */}
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
                    disabled={saving}
                  />
                </div>

                {/* Selected Students */}
                <div className="rounded-md border border-gray-300 p-2 max-h-48 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">
                    Selected Students ({selectedStudents.length}/{maxStudents})
                  </p>
                  {selectedStudents.length > 0 ? (
                    <div className="space-y-1">
                      {selectedStudents.map((student) => (
                        <div
                          key={student._id}
                          className="flex justify-between items-center p-2 bg-blue-50 rounded-lg text-sm"
                        >
                          <span>{student.first_name} {student.last_name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveStudent(student)}
                            disabled={saving}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 p-1"
                            title="Remove student"
                          >
                            <FaMinus />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No students selected yet</p>
                  )}
                </div>

                {/* Available Students */}
                <div className="rounded-md border border-gray-300 p-2 max-h-48 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">
                    Available Students ({availableStudents.length})
                  </p>
                  {availableStudents.length > 0 ? (
                    <div className="space-y-1">
                      {availableStudents.map((student) => (
                        <div
                          key={student._id}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                        >
                          <span>{student.first_name} {student.last_name}</span>
                          <button
                            type="button"
                            onClick={() => handleAddStudent(student)}
                            disabled={saving || selectedStudents.length >= maxStudents}
                            className="text-green-500 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                            title="Add student"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      ))}
                    </div>
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
