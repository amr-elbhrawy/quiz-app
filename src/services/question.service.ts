import { axiosInstance } from './api';
import { QUESTION_URL } from './endpoints';

export const QuestionService = {
  // Get all questions
  getAll: () => axiosInstance.get(QUESTION_URL.GET_ALL),

  // Get question by ID
  getById: (id: string) => axiosInstance.get(QUESTION_URL.GET_BY_ID(id)),

  // Create new question
  // Example body:
  // {
  //   "title": "sec question",
  //   "description": "ay",
  //   "options": {
  //     "A": "first option",
  //     "B": "sec option",
  //     "C": "third option",
  //     "D": "forth option"
  //   },
  //   "answer": "B",
  //   "difficulty": "hard",
  //   "type": "BE"
  // }
  create: (data: {
    title: string;
    description: string;
    options: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    answer: string;
    difficulty: string;
    type: string;
  }) => axiosInstance.post(QUESTION_URL.CREATE, data),

  // Update question
  // Example body:
  // {
  //   "answer": "D"
  // }
  update: (id: string, data: { answer: string }) =>
    axiosInstance.put(QUESTION_URL.UPDATE(id), data),

  // Delete question
  delete: (id: string) => axiosInstance.delete(QUESTION_URL.DELETE(id)),

  // Search questions
  // Example usage:
  // search('difficulty=hard&type=BE')
  search: (queryParams: string) =>
    axiosInstance.get(`${QUESTION_URL.SEARCH}?${queryParams}`),
};
