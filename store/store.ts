import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import groupsReducer from './features/group/groupsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
        groups: groupsReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
