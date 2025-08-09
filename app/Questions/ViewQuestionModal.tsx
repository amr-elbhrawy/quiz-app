"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { HiOutlineXMark } from "react-icons/hi2";
import { FaEye } from "react-icons/fa";

interface ViewQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: any; // السؤال المراد عرضه
}

export default function ViewQuestionModal({
  isOpen,
  onClose,
  question,
}: ViewQuestionModalProps) {
  if (!question) return null;

  const FieldGroup = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="flex border border-gray-300 rounded overflow-hidden">
      <div className="bg-orange-50 flex items-center px-3 min-w-[120px] font-medium border-r border-gray-300">
        {label}
      </div>
      <div className="flex-1 px-3 py-2 bg-gray-50 text-gray-700">{children}</div>
    </div>
  );

  const OptionDisplay = ({ letter, text }: { letter: string; text: string }) => {
    const isCorrect = question.answer === letter;
    return (
      <div className={`flex border rounded overflow-hidden ${
        isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-300'
      }`}>
        <div className={`flex items-center px-3 min-w-[120px] font-medium border-r ${
          isCorrect 
            ? 'bg-green-100 border-green-500 text-green-800' 
            : 'bg-orange-50 border-gray-300'
        }`}>
          {letter}
          {isCorrect && ' ✓'}
        </div>
        <div className={`flex-1 px-3 py-2 ${
          isCorrect ? 'bg-green-50 text-green-800 font-medium' : 'bg-gray-50 text-gray-700'
        }`}>
          {text}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onClose}
      hideCloseButton
      className="w-[95%] sm:w-[90%] md:w-[600px] max-w-full"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex items-center justify-between border-b border-gray-300 p-0">
            <div className="flex items-center px-6 py-4">
              <FaEye className="text-orange-500 mr-2" />
              <h2 className="text-lg font-bold">View Question</h2>
            </div>
            <div className="flex items-center">
              <button
                onClick={onClose}
                title="Close"
                className="flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-gray-800 transition-colors"
              >
                <HiOutlineXMark size={24} />
              </button>
            </div>
          </ModalHeader>

          <ModalBody className="p-4 space-y-3">
            {/* Title */}
            <FieldGroup label="Title">
              <div className="py-2">{question.title}</div>
            </FieldGroup>

            {/* Description */}
            <FieldGroup label="Description">
              <div className="py-2">
                {question.description || <span className="text-gray-400 italic">No description</span>}
              </div>
            </FieldGroup>

            {/* Options A & B */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <OptionDisplay letter="A" text={question.options?.A || ""} />
              <OptionDisplay letter="B" text={question.options?.B || ""} />
            </div>

            {/* Options C & D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <OptionDisplay letter="C" text={question.options?.C || ""} />
              <OptionDisplay letter="D" text={question.options?.D || ""} />
            </div>

            {/* Difficulty & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <FieldGroup label="Difficulty">
                <div className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      question.difficulty === "easy"
                        ? "bg-green-100 text-green-800"
                        : question.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                </div>
              </FieldGroup>
              <FieldGroup label="Type">
                <div className="py-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {question.type}
                  </span>
                </div>
              </FieldGroup>
            </div>

            {/* Right Answer */}
            <FieldGroup label="Right Answer">
              <div className="py-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {question.answer}
                </span>
              </div>
            </FieldGroup>

            {/* Created/Updated info if available */}
            {(question.createdAt || question.updatedAt) && (
              <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                {question.createdAt && (
                  <div>Created: {new Date(question.createdAt).toLocaleDateString()}</div>
                )}
                {question.updatedAt && question.updatedAt !== question.createdAt && (
                  <div>Updated: {new Date(question.updatedAt).toLocaleDateString()}</div>
                )}
              </div>
            )}
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}