

//  Auth APIs
export const AUTH_URL = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  CHANGE_PASSWORD: '/api/auth/change-password',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
};

//  Student APIs
export const STUDENT_URL = {
  UPDATE_MY_ACCOUNT: '/api/student',
  GET_ALL: '/api/student',
  GET_ALL_WITHOUT_GROUP: '/api/student/without-group',
  GET_BY_ID: (id: string) => `/api/student/${id}`,
  DELETE: (id: string) => `/api/student/${id}`,
  DELETE_FROM_GROUP: (studentId: string, groupId: string) =>
    `/api/student/${studentId}/${groupId}`,
  ADD_TO_GROUP: (studentId: string, groupId: string) =>
    `/api/student/${studentId}/${groupId}`,
  UPDATE_GROUP: (studentId: string, groupId: string) =>
    `/api/student/${studentId}/${groupId}`,
  TOP_FIVE: '/api/student/top-five',
};

//  Instructor APIs
export const INSTRUCTOR_URL = {
  UPDATE_MY_ACCOUNT: '/api/instructor',
};

//  Quiz APIs
export const QUIZ_URL = {
  GET_ALL: '/api/quiz',
  GET_BY_ID: (id: string) => `/api/quiz/${id}`,
  CREATE: '/api/quiz',
  UPDATE: (id: string) => `/api/quiz/${id}`,
  DELETE: (id: string) => `/api/quiz/${id}`,
  JOIN: '/api/quiz/join',
  SUBMIT: (id: string) => `/api/quiz/submit/${id}`,
  WITHOUT_ANSWERS: (id: string) => `/api/quiz/without-answers/${id}`,
  RESULT: '/api/quiz/result',
  INCOMMING: '/api/quiz/incomming',
  COMPLETED: '/api/quiz/completed',
  REASSIGN: (id: string) => `/api/quiz/reassign/${id}`,
};

//  Question APIs
export const QUESTION_URL = {
  GET_ALL: '/api/question',
  GET_BY_ID: (id: string) => `/api/question/${id}`,
  CREATE: '/api/question',
  UPDATE: (id: string) => `/api/question/${id}`,
  DELETE: (id: string) => `/api/question/${id}`,
  SEARCH: '/api/question/search',
};

//  Group APIs
export const GROUP_URL = {
  GET_ALL: '/api/group',
  GET_BY_ID: (id: string) => `/api/group/${id}`,
  CREATE: '/api/group',
  UPDATE: (id: string) => `/api/group/${id}`,
  DELETE: (id: string) => `/api/group/${id}`,
};
