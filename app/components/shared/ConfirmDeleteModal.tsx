"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { IoMdCheckmark } from "react-icons/io";
import { HiOutlineXMark } from "react-icons/hi2";
 import Loader from "./ConfirmDeleteLoader";
 
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  isLoading?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  message = "Are you sure you want to delete this item?",
  isLoading = false,
}: ConfirmDeleteModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      placement="top-center" 
      onOpenChange={onClose} 
      hideCloseButton
      isDismissable={!isLoading} // منع الإغلاق أثناء التحميل
    >
      <ModalContent>
        <>
          <ModalHeader className="flex items-center justify-between border-b border-gray-300 p-0">
            <h2 className="px-4 py-3 text-lg font-semibold text-red-600">
              Confirm Deletion
            </h2>
            <div className="flex items-center">
              <button
                onClick={onConfirm}
                title="Delete"
                disabled={isLoading}
                className={`flex items-center justify-center w-12 h-12 border-l border-gray-300 transition-colors ${
                  isLoading 
                    ? 'cursor-not-allowed text-gray-400' 
                    : 'hover:text-red-800 cursor-pointer'
                }`}
              >
                <IoMdCheckmark />
              </button>
              <button
                onClick={onClose}
                title="Cancel"
                disabled={isLoading}
                className={`flex items-center justify-center w-12 h-12 border-l border-gray-300 transition-colors ${
                  isLoading 
                    ? 'cursor-not-allowed text-gray-400' 
                    : 'hover:text-gray-800 cursor-pointer'
                }`}
              >
                <HiOutlineXMark />
              </button>
            </div>
          </ModalHeader>

          <ModalBody className="flex flex-col items-center justify-center p-6">
            {isLoading && <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />}
            <p className={`text-gray-600 text-center ${isLoading ? 'mt-4' : ''}`}>
              {isLoading ? 'Deleting...' : message}
            </p>
                        <Loader scale={2} />
            
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}