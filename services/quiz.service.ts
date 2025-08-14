import { axiosInstance } from './api';
import { QUIZ_URL } from './endpoints';

export const QuizService = {
  // Get all quizzes
  getAll: () => axiosInstance.get(QUIZ_URL.GET_ALL),

  // Get quiz by ID
  getById: (id: string) => axiosInstance.get(QUIZ_URL.GET_BY_ID(id)),

  // Create new quiz
  create: (data: {
    title: string;
    description: string;
    duration: number;
    questions_number: number;
    score_per_question: number;
    schadule: string; // ISO format: YYYY-MM-DDTHH:mm
    difficulty: string;
    type: string;
    group: string; // Group ID
  }) => axiosInstance.post(QUIZ_URL.CREATE, data),

  // Update quiz - مع تصفية الحقول الآمنة
  update: (id: string, data: any) => {
    // الحقول الآمنة اللي شغالة بدون مشاكل
    const safeFields = {
      title: data.title,
      description: data.description,
      duration: data.duration,
      score_per_question: data.score_per_question,
      schadule: data.schadule,
      questions_number: data.questions_number
    };
    
    const cleanData = Object.keys(safeFields).reduce((acc, key) => {
      const value = safeFields[key as keyof typeof safeFields];
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
    
    console.log('Sending safe data for quiz update:', cleanData);
    return axiosInstance.put(QUIZ_URL.UPDATE(id), cleanData);
  },

  // Delete quiz
  delete: (id: string) => axiosInstance.delete(QUIZ_URL.DELETE(id)),

  // Join quiz
  join: (data: { code: string }) =>
    axiosInstance.post(QUIZ_URL.JOIN, data),

  // Submit quiz answers
  submit: (
    quizId: string,
    data: { answers: { question: string; answer: string }[] }
  ) => axiosInstance.post(QUIZ_URL.SUBMIT(quizId), data),

  // Get quiz without answers
  getWithoutAnswers: (id: string) =>
    axiosInstance.get(QUIZ_URL.WITHOUT_ANSWERS(id)),

  // Get quiz result
  getResult: () => axiosInstance.get(QUIZ_URL.RESULT),

  // Get incoming quizzes
  getIncoming: () => axiosInstance.get(QUIZ_URL.INCOMMING),

  // Get completed quizzes
  getCompleted: () => axiosInstance.get(QUIZ_URL.COMPLETED),

  // Reassign quiz
  reassign: (
    quizId: string,
    data: { group: string; schadule: string; duration: string }
  ) => axiosInstance.post(QUIZ_URL.REASSIGN(quizId), data),
};