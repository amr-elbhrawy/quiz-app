import { axiosInstance } from './api';
import { QUIZ_URL } from './endpoints';

export const QuizService = {
  //   Get all quizzes
  getAll: () => axiosInstance.get(QUIZ_URL.GET_ALL),

  //   Get quiz by ID
  getById: (id: string) => axiosInstance.get(QUIZ_URL.GET_BY_ID(id)),

  //   Create new quiz
  //آNo body required
create: () => axiosInstance.post(QUIZ_URL.CREATE),

  //   Update quiz
  //  {
  //     "title":"Quiz A"
  // }
  update: (id: string, data: {
    title: string;
  }) => axiosInstance.put(QUIZ_URL.UPDATE(id), data),

  //   Delete quiz
  // No body required
  delete: (id: string) => axiosInstance.delete(QUIZ_URL.DELETE(id)),

  //   Join quiz (by code)
  // {
  //   "code": "quiz-code"
  // }
  join: (data: { code: string }) => axiosInstance.post(QUIZ_URL.JOIN, data),

  //   Submit quiz answers
// {
//     "answers":[
//         {
//             "question":"65c2d5e570b767ccc62a9615",
//             "answer":"B"
//         }
//     ]
// }
  submit: (quizId: string, data: {
    answers: { question: string; answer: string }[];
  }) => axiosInstance.post(QUIZ_URL.SUBMIT(quizId), data),

  //   Get quiz without answers
  getWithoutAnswers: (id: string) => axiosInstance.get(QUIZ_URL.WITHOUT_ANSWERS(id)),

  //   Get quiz result
  // No body required
  getResult: () => axiosInstance.get(QUIZ_URL.RESULT),

  //   Get incoming quizzes
    // No body required
  getIncomming: () => axiosInstance.get(QUIZ_URL.INCOMMING),

  //   Get completed quizzes
  // No body required
  getCompleted: () => axiosInstance.get(QUIZ_URL.COMPLETED),

  //   Reassign quiz
//   {
//     "group":"65c2bed779b859ea9320885f",
//     "schadule":"2024-02-16T21:19:34",
//     "duration":"45"
// }
reassign: (
  quizId: string,
  data: { group: string; schadule: string; duration: string }
) => axiosInstance.post(QUIZ_URL.REASSIGN(quizId), data),
};
