"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { HiOutlineXMark } from "react-icons/hi2";
import Image from "next/image";

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  role: string;
  group?: { name: string };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export default function ViewStudentModal({ isOpen, onClose, student }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onClose}
      hideCloseButton
      className="w-[95%] sm:w-[90%] md:w-[750px] lg:w-[900px] max-w-full"
    >
      <ModalContent>
        <>
          {/* الهيدر */}
          <ModalHeader className="flex items-center justify-between border-b border-gray-300 p-0">
            <h2 className="px-6 sm:px-8 py-4 sm:py-5 text-lg sm:text-xl lg:text-2xl font-bold">
              Student Details
            </h2>
            <div className="flex items-center">
              <button
                onClick={onClose}
                title="Close"
                className="flex items-center justify-center w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 border-l border-gray-300 hover:text-red-800 cursor-pointer"
              >
                <HiOutlineXMark size={24} className="sm:size-6 lg:size-7" />
              </button>
            </div>
          </ModalHeader>

          {/* البودي */}
          <ModalBody className="p-4 sm:p-6">
            {student ? (
              <div className="flex flex-col gap-6 sm:gap-8">
                {/* الصف الأول: الاسم والصورة */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                  <Image
                    src="/student.png"
                    alt="Student"
                    width={100}
                    height={100}
                    className="rounded-full border shadow-md w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
                  />
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-lg sm:text-xl lg:text-2xl">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                      {student.email}
                    </p>
                  </div>
                </div>

                {/* صفوف البيانات */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  <div className="flex border rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-orange-100 px-4 sm:px-6 py-3 sm:py-4 font-semibold min-w-[100px] sm:min-w-[120px] text-sm sm:text-lg">
                      Title
                    </div>
                    <div className="px-4 sm:px-6 py-3 sm:py-4 flex-1 capitalize text-sm sm:text-lg">
                      {student.first_name} {student.last_name}
                    </div>
                  </div>
                  <div className="flex border rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-orange-100 px-4 sm:px-6 py-3 sm:py-4 font-semibold min-w-[100px] sm:min-w-[120px] text-sm sm:text-lg">
                      Group Name
                    </div>
                    <div className="px-4 sm:px-6 py-3 sm:py-4 flex-1 text-sm sm:text-lg">
                      {student.group?.name || "N/A"}
                    </div>
                  </div>
                </div>

                {/* الإيميل + الحالة */}
                <div className="flex border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-orange-100 px-4 sm:px-6 py-3 sm:py-4 font-semibold min-w-[100px] sm:min-w-[120px] text-sm sm:text-md">
                    Email
                  </div>
                  <div className="px-1 sm:px-3 py-3 sm:py-4 flex-1 flex justify-between items-center text-sm sm:text-lg">
                    {student.email}
    
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-orange-100 px-4 sm:px-6 py-3 sm:py-4 font-semibold min-w-[100px] sm:min-w-[120px] text-sm sm:text-md">
                    Status
                  </div>
                  <div className="px-1 sm:px-3 py-3 sm:py-4 flex-1 flex justify-between items-center text-sm sm:text-lg">
                             <span
                      className={`font-semibold ${
                        student.status === "Active"
                          ? "text-green-500"
                          : "text-red-500"
                      }`    }
                    >
                      {student.status}
                    </span>                  </div>
                </div>
   
  
                
              </div>
            ) : (
              <p className="text-sm sm:text-lg">No data available</p>
            )}
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}
