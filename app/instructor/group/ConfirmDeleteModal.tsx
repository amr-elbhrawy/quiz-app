"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { IoMdCheckmark } from "react-icons/io";
import { HiOutlineXMark } from "react-icons/hi2";
import Loader from "../../components/shared/ConfirmDeleteLoader";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  message = "Are you sure you want to delete this item?",
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onClose} hideCloseButton>
      <ModalContent>
        <>
          {/* نفس الهيدر */}
          <ModalHeader className="flex items-center justify-between border-b border-gray-300 p-0">
            <h2 className="px-4 py-3 text-lg font-semibold text-red-600">
              Confirm Deletion
            </h2>
            <div className="flex items-center">
              <button
                onClick={onConfirm}
                title="Delete"
                className="flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-red-800 cursor-pointer"
              >
                <IoMdCheckmark />
              </button>
              <button
                onClick={onClose}
                title="Cancel"
                className="flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-gray-800 cursor-pointer"
              >
                <HiOutlineXMark />
              </button>
            </div>
          </ModalHeader>

          {/* Body */}
          <ModalBody className="flex flex-col items-center justify-center p-6">
            <Loader scale={2} />
            <p className="text-gray-600   text-center mt-4">{message}</p>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}
