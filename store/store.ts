// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import groupsReducer from './features/group/groupsSlice';
import quizReducer from './features/quiz/quizSlice'; 
import questionReducer from './features/question/questionSlice';  
export const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
    quiz: quizReducer, 
        questions: questionReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
