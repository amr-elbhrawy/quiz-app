"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { HiOutlineXMark, HiCheck } from "react-icons/hi2";
import { QuestionService } from "@/services/question.service";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  question: any; // السؤال المراد تعديله
}

interface QuestionFormInputs {
  title: string;
  description: string;
  options: { A: string; B: string; C: string; D: string };
  answer: "A" | "B" | "C" | "D";
  difficulty: "easy" | "medium" | "hard";
  type: "FE" | "BE";
}

export default function EditQuestionModal({
  isOpen,
  onClose,
  onUpdated,
  question,
}: EditQuestionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  // ملء البيانات عند فتح المودال
  useEffect(() => {
    if (question && isOpen) {
      setValue("title", question.title || "");
      setValue("description", question.description || "");
      setValue("options.A", question.options?.A || "");
      setValue("options.B", question.options?.B || "");
      setValue("options.C", question.options?.C || "");
      setValue("options.D", question.options?.D || "");
      setValue("answer", question.answer || "A");
      setValue("difficulty", question.difficulty || "easy");
      setValue("type", question.type || "FE");
    }
  }, [question, isOpen, setValue]);

  const onSubmit: SubmitHandler<QuestionFormInputs> = async (data) => {
    try {
      await QuestionService.update(question._id, data);
      toast.success("Question updated successfully!");
      reset();
      onUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update question.");
      console.error(error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
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
              Edit question
            </h2>
            <div className="flex items-center">
              <button
                onClick={handleSubmit(onSubmit)}
                title="Save Changes"
                className={`flex items-center justify-center w-12 h-12 border-l border-gray-300 transition-colors ${
                  isSubmitting 
                    ? 'cursor-not-allowed text-gray-400' 
                    : 'hover:text-green-600'
                }`}
                disabled={isSubmitting}
              >
                <HiCheck size={24} />
              </button>
              <button
                onClick={handleClose}
                title="Close"
                className={`flex items-center justify-center w-12 h-12 border-l border-gray-300 transition-colors ${
                  isSubmitting 
                    ? 'cursor-not-allowed text-gray-400' 
                    : 'hover:text-red-600'
                }`}
                disabled={isSubmitting}
              >
                <HiOutlineXMark size={24} />
              </button>
            </div>
          </ModalHeader>

          <ModalBody className="p-4 space-y-3">
            {/* Title */}
            <FieldGroup label="Title">
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-3 py-2 outline-none"
                type="text"
                disabled={isSubmitting}
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
            <div className="grid grid-cols-2 gap-8">
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
            <div className="grid grid-cols-2 gap-8">
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
            <div className="grid grid-cols-2 gap-8">
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