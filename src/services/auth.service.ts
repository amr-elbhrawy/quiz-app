import { axiosInstance } from './api';
import { AUTH_URL } from './endpoints';

export const AuthService = {
  //   Register new user
  // Example:
  // {
  //   "first_name": "Mona",
  //   "last_name": "Ahmed",
  //   "email": "mona@gmail.com",
  //   "password": "123abdo",
  //   "role": "Student"
  // }
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: 'Student' | 'Instructor';
  }) => axiosInstance.post(AUTH_URL.REGISTER, data),

  //   Login
  // {
  //   "email": "abdelrhmanfarghaly1998@gmail.com",
  //   "password": "12345abdo"
  // }
  login: (data: { email: string; password: string }) =>
    axiosInstance.post(AUTH_URL.LOGIN, data, {
      headers: { language: 'ar' },
    }),

  //   Change password
  // {
  //   "password": "1234abdo",
  //   "password_new": "123abdo"
  // }
  changePassword: (data: { password: string; password_new: string }) =>
    axiosInstance.post(AUTH_URL.CHANGE_PASSWORD, data),

  //   Logout
  logout: () => axiosInstance.get(AUTH_URL.LOGOUT),

  //   Forgot password
  // {
  //   "email": "abdelrhmanfarghaly1998@gmail.com"
  // }
  forgotPassword: (data: { email: string }) =>
    axiosInstance.post(AUTH_URL.FORGOT_PASSWORD, data),

  //   Reset password
  // {
  //   "otp": "397119",
  //   "email": "abdelrhmanfarghaly1998@gmail.com",
  //   "password": "12345abdo"
  // }
  resetPassword: (data: { otp: string; email: string; password: string }) =>
    axiosInstance.post(AUTH_URL.RESET_PASSWORD, data),
};
