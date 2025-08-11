"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { HiOutlineXMark, HiClipboard, HiCheck } from "react-icons/hi2";

interface QuizCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export default function QuizCodeModal({ isOpen, onClose, code }: QuizCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onClose}
      hideCloseButton
      className="w-[95%] sm:w-[90%] md:w-[400px] max-w-full"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex items-center justify-between border-b border-gray-300 p-0">
            <h2 className="px-6 py-4 text-base font-bold">Quiz Code</h2>
            <button
              onClick={onClose}
              title="Close"
              className="cursor-pointer flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-red-600"
            >
              <HiOutlineXMark size={24} />
            </button>
          </ModalHeader>

          <ModalBody className="p-6 space-y-4 text-center">
            <p className="text-lg font-semibold mb-4">
              The code your students will use to take the quiz:
            </p>
            <div className="inline-block px-6 py-4 bg-orange-50 border border-orange-400 rounded-lg text-2xl font-mono select-all">
              {code || "N/A"}
            </div>
            <button
              onClick={copyToClipboard}
              className="mt-3 px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded flex items-center justify-center mx-auto gap-2"
              title="Copy code"
            >
              {copied ? (
                <>
                  <HiCheck size={20} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <HiClipboard size={20} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}
