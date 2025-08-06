import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/services/api';
import { AUTH_URL } from '@/services/endpoints';

// 1-  loginThunk
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(AUTH_URL.LOGIN, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// 2- signupThunk
export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (data: { firstName: string; lastName: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
       const apiData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role === 'student' ? 'Student' : 'Instructor'
      };
      
      const res = await axiosInstance.post(AUTH_URL.REGISTER, apiData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed');
    }
  }
);

// 3- forgetPasswordThunk
export const forgetPasswordThunk = createAsyncThunk(
  'auth/forgetPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(AUTH_URL.FORGOT_PASSWORD, data);
      return res.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Forgot password failed');
    }
  }
);

// 4- resetPasswordThunk
export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async (data: { email: string; otp: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(AUTH_URL.RESET_PASSWORD, data);
      return res.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Reset password failed');
    }
  }
);

// 5- changePasswordThunk  
export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async (data: { password: string; password_new: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(AUTH_URL.CHANGE_PASSWORD, data);
      return res.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Change password failed');
    }
  }
);
