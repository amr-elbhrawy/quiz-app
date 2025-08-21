"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { HiOutlineXMark, HiCheck } from "react-icons/hi2";
import { QuizService } from "@/services/quiz.service";
import { StudentService } from "@/services/student.service";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

interface EditQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  onUpdated: (updatedQuiz: any) => void;  
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

export default function EditQuizModal({
  isOpen,
  onClose,
  quizId,
  onUpdated,
}: EditQuizModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<QuizFormInputs>();

  const [groups, setGroups] = useState<{ _id: string; name: string }[]>([]);
  const [quizData, setQuizData] = useState<any>(null);

  // جلب بيانات الجروبات
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await StudentService.getAll();
        const uniqueGroups = res.data
          .map((student: any) => student.group)
          .filter(
            (group: any, index: number, self: any[]) =>
              group && index === self.findIndex((g: any) => g?._id === group?._id)
          )
          .map((g: any) => ({ _id: g._id, name: g.name }));

        setGroups(uniqueGroups);
      } catch (err) {
        toast.error("Failed to fetch groups");
      }
    };
    fetchGroups();
  }, []);

  // جلب بيانات الكويز
  useEffect(() => {
    if (!quizId) return;
    const fetchQuiz = async () => {
      try {
        const res = await QuizService.getById(quizId);
        const quiz = res.data.data || res.data;
        setQuizData(quiz);
      } catch (err) {
        toast.error("Failed to fetch quiz details");
      }
    };
    fetchQuiz();
  }, [quizId]);

 
  useEffect(() => {
    if (quizData && groups.length > 0) {
      const groupId = quizData.group || "";
      reset({
        title: quizData.title,
        duration: quizData.duration,
        noOfQuestions: quizData.questions_number,
        scorePerQuestion: quizData.score_per_question,
        description: quizData.description,
        scheduleDate: quizData.schadule?.split("T")[0],
        scheduleTime: quizData.schadule?.split("T")[1]?.slice(0, 5),
        difficulty: quizData.difficulty === "easy" ? "entry" : quizData.difficulty,
        categoryType: quizData.type,
        group: groupId,
      });

      if (groupId) setValue("group", groupId);
    }
  }, [quizData, groups, reset, setValue]);

  const onSubmit: SubmitHandler<QuizFormInputs> = async (data) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        duration: Number(data.duration),
        score_per_question: Number(data.scorePerQuestion),
        schadule: `${data.scheduleDate}T${data.scheduleTime}:00.000Z`,
        type: data.categoryType,
        difficulty: data.difficulty === "entry" ? "easy" : data.difficulty,
        group: data.group,
      };

      await QuizService.update(quizId, payload);

      toast.success("Quiz updated successfully!");

      
      onUpdated(payload);

      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update quiz");
    }
  };

  const FieldGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex border border-gray-300 rounded overflow-hidden">
      <div className="bg-orange-50 flex items-center px-3 min-w-[140px] font-medium border-r border-gray-300">
        {label}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );

  const handleSaveClick = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onClose}
      hideCloseButton
      className="w-[95%] sm:w-[90%] md:w-[850px] max-w-full"
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between border-b border-gray-300 p-0">
          <h2 className="px-6 py-4 text-base font-bold">Edit quiz</h2>
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleSaveClick}
              title="Save"
              className="cursor-pointer flex items-center justify-center w-12 h-12 border-l border-gray-300 hover:text-green-600"
              disabled={isSubmitting}
            >
              <HiCheck size={24} />
            </button>
            <button
              type="button"
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="p-6 space-y-4">
            <h3 className="font-semibold text-sm">Details</h3>

            <FieldGroup label="Title">
              <input {...register("title", { required: true })} className="w-full px-4 py-3 outline-none" type="text" disabled={isSubmitting} />
            </FieldGroup>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FieldGroup label="Duration (in minutes)">
                <input {...register("duration", { valueAsNumber: true })} className="w-full px-4 py-3 outline-none" type="number" disabled={isSubmitting} />
              </FieldGroup>
              <FieldGroup label="No. of questions">
                <input {...register("noOfQuestions", { valueAsNumber: true })} className="w-full px-4 py-3 outline-none" type="number" disabled={isSubmitting} />
              </FieldGroup>
              <FieldGroup label="Score per question">
                <input {...register("scorePerQuestion", { valueAsNumber: true })} className="w-full px-4 py-3 outline-none" type="number" disabled={isSubmitting} />
              </FieldGroup>
            </div>

            <FieldGroup label="Description">
              <textarea {...register("description")} className="w-full px-4 py-3 outline-none resize-none" rows={3} disabled={isSubmitting} />
            </FieldGroup>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup label="Schedule date">
                <input {...register("scheduleDate")} className="w-full px-4 py-3 outline-none" type="date" disabled={isSubmitting} />
              </FieldGroup>
              <FieldGroup label="Schedule time">
                <input {...register("scheduleTime")} className="w-full px-4 py-3 outline-none" type="time" disabled={isSubmitting} />
              </FieldGroup>
            </div>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
