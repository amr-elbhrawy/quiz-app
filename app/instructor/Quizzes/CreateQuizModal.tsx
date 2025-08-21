"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { HiOutlineXMark, HiCheck } from "react-icons/hi2";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createQuiz } from "@/store/features/quiz/quizSlice";
import { StudentService } from "@/services/student.service";
import type { RootState, AppDispatch } from "@/store/store";
import dynamic from "next/dynamic";

// Lazy load QuizCodeModal
const QuizCodeModal = dynamic(() => import("./QuizCodeModal"), {
  loading: () => null
});

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface QuizFormInputs {
  title: string;
  duration: number;
  noOfQuestions: number;
  scorePerQuestion: number;
  description: string;
  scheduleDate: string;
  scheduleTime: string;
  difficulty: "entry" | "medium" | "hard";
  categoryType: "FE" | "BE";
  group: string;
}

export default function CreateQuizModal({
  isOpen,
  onClose,
  onCreated,
}: CreateQuizModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.quiz);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<QuizFormInputs>({
    defaultValues: {
      title: "",
      duration: 10,
      noOfQuestions: 5,
      scorePerQuestion: 1,
      description: "",
      scheduleDate: "",
      scheduleTime: "",
      difficulty: "entry",
      categoryType: "FE",
      group: "",
    },
  });

  const [groups, setGroups] = useState<{ _id: string; name: string }[]>([]);
  const [quizCodeModalOpen, setQuizCodeModalOpen] = useState(false);
  const [createdQuizCode, setCreatedQuizCode] = useState<string>("");

  useEffect(() => {
    const fetchGroupsFromStudents = async () => {
      try {
        const res = await StudentService.getAll();
        const uniqueGroups = res.data
          .map((student: any) => student.group)
          .filter(
            (group: any, index: number, self: any[]) =>
              group &&
              index ===
                self.findIndex((g: any) => g?._id === group?._id)
          )
          .map((g: any) => ({ _id: g._id, name: g.name }));

        setGroups(uniqueGroups);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch groups");
      }
    };

    if (isOpen) {
      fetchGroupsFromStudents();
    }
  }, [isOpen]);

  const onSubmit: SubmitHandler<QuizFormInputs> = async (data) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        duration: data.duration,
        questions_number: data.noOfQuestions,
        score_per_question: data.scorePerQuestion,
        schadule: `${data.scheduleDate}T${data.scheduleTime}`,
        difficulty: data.difficulty === "entry" ? "easy" : data.difficulty,
        type: data.categoryType,
        group: data.group,
      };

      console.log("🚀 Creating quiz with payload:", payload);
      
      const resultAction = await dispatch(createQuiz(payload));
      
      if (createQuiz.fulfilled.match(resultAction)) {
        const response = resultAction.payload;
        console.log("    Full quiz response:", response);
        
         const actualQuizCode = response?.data?.code || 
                              response?.code || 
                              response?.data?.quiz?.code ||
                              response?.quiz?.code;
        
        console.log("🎯 Actual code to display:", actualQuizCode);
        
        if (actualQuizCode) {
          setCreatedQuizCode(actualQuizCode);
          console.log("🔥 Setting quiz code modal to open with code:", actualQuizCode);
          
           setQuizCodeModalOpen(true);
        } else {
          console.warn("⚠️ No code received from server, response:", response);
          toast.success("Quiz created successfully!");
          reset();
          onCreated();
          onClose();
        }
      } else {
         const error = resultAction.payload as string;
        toast.error(error || "Failed to create quiz.");
        console.error("    Quiz creation failed:", resultAction.payload);
      }
      
    } catch (error: any) {
      console.error("    Error creating quiz:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Handle quiz code modal close
  const handleQuizCodeModalClose = () => {
    setQuizCodeModalOpen(false);
    setCreatedQuizCode(""); // Clear the code after closing
    
     reset();
    onCreated();
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
      <div className="bg-orange-50 flex items-center px-3 min-w-[140px] font-medium border-r border-gray-300">
        {label}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );

  const isFormSubmitting = isSubmitting || loading;

  return (
    <>
      <Modal
        isOpen={isOpen && !quizCodeModalOpen}  
        placement="top-center"
        onOpenChange={onClose}
        hideCloseButton
        className="w-[95%] sm:w-[90%] md:w-[850px] max-w-full"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex items-center justify-between border-b border-gray-300 p-0">
              <h2 className="px-6 py-4 text-base font-bold">Set up a new quiz</h2>
              <div className="flex items-center">
                <button
                  onClick={handleSubmit(onSubmit)}
                  title="Save"
                  className="cursor-pointer flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isFormSubmitting}
                >
                  <HiCheck size={24} />
                </button>
                <button
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                  title="Close"
                  className="cursor-pointer flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-red-600 disabled:opacity-50"
                  disabled={isFormSubmitting}
                >
                  <HiOutlineXMark size={24} />
                </button>
              </div>
            </ModalHeader>

            <ModalBody className="p-6 space-y-4">
              {isFormSubmitting && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span>Creating quiz...</span>
                  </div>
                </div>
              )}

              <h3 className="font-semibold text-sm">Details</h3>

              <FieldGroup label="Title">
                <input
                  {...register("title", { required: true })}
                  className="w-full px-4 py-3 outline-none"
                  type="text"
                  disabled={isFormSubmitting}
                />
              </FieldGroup>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FieldGroup label="Duration (in minutes)">
                  <input
                    {...register("duration", { valueAsNumber: true })}
                    className="w-full px-4 py-3 outline-none"
                    type="number"
                    disabled={isFormSubmitting}
                  />
                </FieldGroup>
                <FieldGroup label="No. of questions">
                  <input
                    {...register("noOfQuestions", { valueAsNumber: true })}
                    className="w-full px-4 py-3 outline-none"
                    type="number"
                    disabled={isFormSubmitting}
                  />
                </FieldGroup>
                <FieldGroup label="Score per question">
                  <input
                    {...register("scorePerQuestion", { valueAsNumber: true })}
                    className="w-full px-4 py-3 outline-none"
                    type="number"
                    disabled={isFormSubmitting}
                  />
                </FieldGroup>
              </div>

              <FieldGroup label="Description">
                <textarea
                  {...register("description")}
                  className="w-full px-4 py-3 outline-none resize-none"
                  rows={3}
                  disabled={isFormSubmitting}
                />
              </FieldGroup>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldGroup label="Schedule date">
                  <input
                    {...register("scheduleDate")}
                    className="w-full px-4 py-3 outline-none"
                    type="date"
                    disabled={isFormSubmitting}
                  />
                </FieldGroup>
                <FieldGroup label="Schedule time">
                  <input
                    {...register("scheduleTime")}
                    className="w-full px-4 py-3 outline-none"
                    type="time"
                    disabled={isFormSubmitting}
                  />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FieldGroup label="Difficulty level">
                  <select
                    {...register("difficulty")}
                    className="w-full px-4 py-3 outline-none"
                    disabled={isFormSubmitting}
                  >
                    <option value="entry">Entry</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </FieldGroup>

                <FieldGroup label="Category type">
                  <select
                    {...register("categoryType")}
                    className="w-full px-4 py-3 outline-none"
                    disabled={isFormSubmitting}
                  >
                    <option value="FE">FE</option>
                    <option value="BE">BE</option>
                  </select>
                </FieldGroup>

                <FieldGroup label="Group">
                  <select
                    {...register("group", { required: true })}
                    className="w-full px-4 py-3 outline-none"
                    disabled={isFormSubmitting}
                  >
                    <option value="">Select Group</option>
                    {groups.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </FieldGroup>
              </div>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>

       <QuizCodeModal
        isOpen={quizCodeModalOpen}
        onClose={handleQuizCodeModalClose}
        code={createdQuizCode}
      />
    </>
  );
}