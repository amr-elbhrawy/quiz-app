"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { HiOutlineXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import { QuizService } from "@/services/quiz.service";

interface JoinQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinQuizModal({ isOpen, onClose }: JoinQuizModalProps) {
  const [quizCode, setQuizCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!quizCode.trim()) {
      toast.error("Please enter a quiz code");
      return;
    }

    setLoading(true);
    try {
      const res = await QuizService.join({ code: quizCode });
      toast.success(res.data?.message || "You joined the quiz successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid quiz code");
    } finally {
      setLoading(false);
    }
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
            <h2 className="px-6 py-4 text-base font-bold">Join Quiz</h2>
            <button
              onClick={onClose}
              title="Close"
              className="cursor-pointer flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-red-600"
            >
              <HiOutlineXMark size={24} />
            </button>
          </ModalHeader>

          <ModalBody className="p-6 space-y-4">
            <input
              type="text"
              placeholder="Enter quiz code"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-orange-400"
            />
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded"
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}
