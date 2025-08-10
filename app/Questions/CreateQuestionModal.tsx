"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { HiOutlineXMark, HiCheck } from "react-icons/hi2";
import { QuestionService } from "@/services/question.service";
import { toast } from "react-toastify";

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface QuestionFormInputs {
  title: string;
  description: string;
  options: { A: string; B: string; C: string; D: string };
  answer: "A" | "B" | "C" | "D";
  difficulty: "easy" | "medium" | "hard";
  type: "FE" | "BE";
}

export default function CreateQuestionModal({
  isOpen,
  onClose,
  onCreated,
}: CreateQuestionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<QuestionFormInputs>({
    defaultValues: {
      title: "",
      description: "",
      options: { A: "", B: "", C: "", D: "" },
      answer: "A",
      difficulty: "easy",
      type: "FE",
    },
  });

  const onSubmit: SubmitHandler<QuestionFormInputs> = async (data) => {
    try {
      await QuestionService.create(data);
      toast.success("Question created successfully!");
      reset();
      onCreated();
      onClose();
    } catch (error) {
      toast.error("Failed to create question.");
      console.error(error);
    }
  };

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
      <div className="flex-1">{children}</div>
    </div>
  );

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
            <h2 className="px-6 py-4 text-lg font-bold">
              Set up a new question
            </h2>
            <div className="flex items-center">
              <button
                onClick={handleSubmit(onSubmit)}
                title="Save"
                className="cursor-pointer flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-green-600"
                disabled={isSubmitting}
              >
                <HiCheck size={24} />
              </button>
              <button
                onClick={() => {
                  reset();
                  onClose();
                }}
                title="Close"
                className="cursor-pointer flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-red-600"
                disabled={isSubmitting}
              >
                <HiOutlineXMark size={24} />
              </button>
            </div>
          </ModalHeader>

          <ModalBody className="p-4 space-y-3">
            {/* Title */}
            <FieldGroup label="Title">
              <textarea
                {...register("title", { required: "Title is required" })}
                className="w-full px-3 py-2 outline-none min-h-[40px]"
                disabled={isSubmitting}
                style={{ 
                  height: 'auto',
                  overflow: 'hidden'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            </FieldGroup>

            {/* Description */}
            <FieldGroup label="Description">
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 outline-none resize-none"
                rows={2}
                disabled={isSubmitting}
              />
            </FieldGroup>

            {/* A & B */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-8">
              <FieldGroup label="A">
                <input
                  {...register("options.A", { required: "Option A is required" })}
                  className="w-full px-3 py-2 outline-none"
                  type="text"
                  disabled={isSubmitting}
                />
              </FieldGroup>
              <FieldGroup label="B">
                <input
                  {...register("options.B", { required: "Option B is required" })}
                  className="w-full px-3 py-2 outline-none"
                  type="text"
                  disabled={isSubmitting}
                />
              </FieldGroup>
            </div>

            {/* C & D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-8">
              <FieldGroup label="C">
                <input
                  {...register("options.C", { required: "Option C is required" })}
                  className="w-full px-3 py-2 outline-none"
                  type="text"
                  disabled={isSubmitting}
                />
              </FieldGroup>
              <FieldGroup label="D">
                <input
                  {...register("options.D", { required: "Option D is required" })}
                  className="w-full px-3 py-2 outline-none"
                  type="text"
                  disabled={isSubmitting}
                />
              </FieldGroup>
            </div>

            {/* Difficulty & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-8">
              <FieldGroup label="Difficulty">
                <select
                  {...register("difficulty")}
                  className="w-full px-3 py-2 outline-none"
                  disabled={isSubmitting}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </FieldGroup>
              <FieldGroup label="Type">
                <select
                  {...register("type")}
                  className="w-full px-3 py-2 outline-none"
                  disabled={isSubmitting}
                >
                  <option value="FE">FE</option>
                  <option value="BE">BE</option>
                </select>
              </FieldGroup>
            </div>

            {/* Right Answer */}
            <FieldGroup label="Right Answer">
              <select
                {...register("answer")}
                className="w-full px-3 py-2 outline-none"
                disabled={isSubmitting}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </FieldGroup>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}