"use client";

import React, { useCallback, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { HiOutlineXMark, HiCheck } from "react-icons/hi2";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createQuestion, selectQuestionsLoading } from "@/store/features/question/questionSlice";

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

// ✅ Memoized Field Group Component
const FieldGroup = React.memo(({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col">
    <div className="flex border border-gray-300 rounded overflow-hidden">
      <div className="bg-orange-50 flex items-center px-3 min-w-[120px] font-medium border-r border-gray-300">
        {label}
      </div>
      <div className="flex-1">{children}</div>
    </div>
    {error && <p className="text-red-500 text-sm mt-1 px-2">{error}</p>}
  </div>
));

FieldGroup.displayName = "FieldGroup";

export default function CreateQuestionModal({
  isOpen,
  onClose,
  onCreated,
}: CreateQuestionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectQuestionsLoading);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    watch,
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

  // ✅ Watch form values for validation feedback
  const watchedAnswer = watch("answer");

  // ✅ Memoized form submission
  const onSubmit: SubmitHandler<QuestionFormInputs> = useCallback(async (data) => {
    try {
      await dispatch(createQuestion(data)).unwrap();
      toast.success("Question created successfully!");
      reset();
      onCreated();
      onClose();
    } catch (error: any) {
      toast.error(error || "Failed to create question.");
    }
  }, [dispatch, reset, onCreated, onClose]);

  // ✅ Memoized close handler
  const handleClose = useCallback(() => {
    if (!isSubmitting && !loading) {
      reset();
      onClose();
    }
  }, [isSubmitting, loading, reset, onClose]);

  // ✅ Memoized textarea auto-resize handler
  const handleTextareaResize = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
  }, []);

  // ✅ Memoized options for selects
  const difficultyOptions = useMemo(() => [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" }
  ], []);

  const typeOptions = useMemo(() => [
    { value: "FE", label: "Frontend" },
    { value: "BE", label: "Backend" }
  ], []);

  const answerOptions = useMemo(() => [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" }
  ], []);

  const isFormDisabled = isSubmitting || loading;

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={handleClose}
      hideCloseButton
      className="w-[95%] sm:w-[90%] md:w-[600px] max-w-full"
      isDismissable={!isFormDisabled}
      isKeyboardDismissDisabled={isFormDisabled}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between border-b border-gray-300 p-0">
          <h2 className="px-6 py-4 text-lg font-bold">
            Set up a new question
          </h2>
          <div className="flex items-center">
            <button
              onClick={handleSubmit(onSubmit)}
              title="Save"
              className={`cursor-pointer flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:bg-green-100 text-green-600 transition-colors ${
                isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isFormDisabled}
            >
              <HiCheck size={24} />
            </button>
            <button
              onClick={handleClose}
              title="Close"
              className={`cursor-pointer flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:bg-red-100 text-red-600 transition-colors ${
                isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isFormDisabled}
            >
              <HiOutlineXMark size={24} />
            </button>
          </div>
        </ModalHeader>

        <ModalBody className="p-4 space-y-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Title */}
            <FieldGroup label="Title" error={errors.title?.message}>
              <textarea
                {...register("title", { 
                  required: "Title is required",
                  minLength: { value: 10, message: "Title must be at least 10 characters" },
                  maxLength: { value: 200, message: "Title must not exceed 200 characters" }
                })}
                className="w-full px-3 py-2 outline-none min-h-[40px] resize-none"
                disabled={isFormDisabled}
                placeholder="Enter question title..."
                onInput={handleTextareaResize}
              />
            </FieldGroup>

            {/* Description */}
            <FieldGroup label="Description" error={errors.description?.message}>
              <textarea
                {...register("description", {
                  maxLength: { value: 500, message: "Description must not exceed 500 characters" }
                })}
                className="w-full px-3 py-2 outline-none resize-none"
                rows={2}
                disabled={isFormDisabled}
                placeholder="Optional description..."
              />
            </FieldGroup>

            {/* Options A & B */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-8">
              <FieldGroup label="Option A" error={errors.options?.A?.message}>
                <input
                  {...register("options.A", { 
                    required: "Option A is required",
                    minLength: { value: 1, message: "Option A cannot be empty" }
                  })}
                  className={`w-full px-3 py-2 outline-none transition-colors ${
                    watchedAnswer === "A" ? "bg-green-50 border-green-300" : ""
                  }`}
                  type="text"
                  disabled={isFormDisabled}
                  placeholder="Enter option A..."
                />
              </FieldGroup>
              <FieldGroup label="Option B" error={errors.options?.B?.message}>
                <input
                  {...register("options.B", { 
                    required: "Option B is required",
                    minLength: { value: 1, message: "Option B cannot be empty" }
                  })}
                  className={`w-full px-3 py-2 outline-none transition-colors ${
                    watchedAnswer === "B" ? "bg-green-50 border-green-300" : ""
                  }`}
                  type="text"
                  disabled={isFormDisabled}
                  placeholder="Enter option B..."
                />
              </FieldGroup>
            </div>

            {/* Options C & D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-8">
              <FieldGroup label="Option C" error={errors.options?.C?.message}>
                <input
                  {...register("options.C", { 
                    required: "Option C is required",
                    minLength: { value: 1, message: "Option C cannot be empty" }
                  })}
                  className={`w-full px-3 py-2 outline-none transition-colors ${
                    watchedAnswer === "C" ? "bg-green-50 border-green-300" : ""
                  }`}
                  type="text"
                  disabled={isFormDisabled}
                  placeholder="Enter option C..."
                />
              </FieldGroup>
              <FieldGroup label="Option D" error={errors.options?.D?.message}>
                <input
                  {...register("options.D", { 
                    required: "Option D is required",
                    minLength: { value: 1, message: "Option D cannot be empty" }
                  })}
                  className={`w-full px-3 py-2 outline-none transition-colors ${
                    watchedAnswer === "D" ? "bg-green-50 border-green-300" : ""
                  }`}
                  type="text"
                  disabled={isFormDisabled}
                  placeholder="Enter option D..."
                />
              </FieldGroup>
            </div>

            {/* Difficulty & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-8">
              <FieldGroup label="Difficulty" error={errors.difficulty?.message}>
                <select
                  {...register("difficulty")}
                  className="w-full px-3 py-2 outline-none bg-white"
                  disabled={isFormDisabled}
                >
                  {difficultyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldGroup>
              <FieldGroup label="Type" error={errors.type?.message}>
                <select
                  {...register("type")}
                  className="w-full px-3 py-2 outline-none bg-white"
                  disabled={isFormDisabled}
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldGroup>
            </div>

            {/* Right Answer */}
            <FieldGroup label="Correct Answer" error={errors.answer?.message}>
              <select
                {...register("answer", { required: "Please select the correct answer" })}
                className="w-full px-3 py-2 outline-none bg-white font-medium"
                disabled={isFormDisabled}
              >
                {answerOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FieldGroup>

            {/* Submit button (hidden, form submits via header button) */}
            <button type="submit" className="hidden" disabled={isFormDisabled} />
          </form>

          {/* Loading indicator */}
          {isFormDisabled && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span className="ml-2 text-sm text-gray-600">
                {loading ? "Creating question..." : "Processing..."}
              </span>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}