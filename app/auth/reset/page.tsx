'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import InputShared from '@/app/components/shared/InputSHared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPasswordThunk } from '@/store/features/auth/authThunk';
import { toast } from 'react-toastify';
import { clearAuthMessages } from '@/store/features/auth/authSlice';
import router, { useRouter } from 'next/router';

type ResetPasswordInputs = {
  otp: string;
  email: string;
  password: string;
};

export default function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  // Using useRouter from next/navigation to handle navigation
  const router = useRouter();
  const { loading, error, successMsg } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordInputs>();

  const onSubmit = (data: ResetPasswordInputs) => {
    dispatch(resetPasswordThunk(data));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthMessages());
    }

    if (successMsg) {
      toast.success(successMsg);
      reset();
      // Optionally redirect or perform other actions after successful reset  
      router.push('/login'); // Uncomment if you want to redirect to login
      dispatch(clearAuthMessages());
    }
  }, [error, successMsg, dispatch, reset]);

  return (
    <div className="w-full text-white">
      <h2 className="text-xl font-semibold text-lime-300">
        Reset your password on <span className="text-white">QuizWiz</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <InputShared
          name="otp"
          register={register}
          label="OTP code"
          placeholder="Enter the OTP"
          type="text"
          iconInput={<FaEnvelope className="text-gray-500" />}
          validation={{ required: 'OTP is required' }}
        />
        {errors.otp && (
          <p className="text-red-400 text-sm ml-1">{errors.otp.message}</p>
        )}

        <InputShared
          name="email"
          register={register}
          label="Registered email address"
          placeholder="Type your email"
          type="email"
          iconInput={<FaEnvelope className="text-gray-500" />}
          validation={{ required: 'Email is required' }}
        />
        {errors.email && (
          <p className="text-red-400 text-sm ml-1">{errors.email.message}</p>
        )}

        <InputShared
          name="password"
          register={register}
          label="New password"
          placeholder="Type your new password"
          type="password"
          iconInput={<FaLock className="text-gray-500" />}
          validation={{ required: 'Password is required' }}
        />
        {errors.password && (
          <p className="text-red-400 text-sm ml-1">{errors.password.message}</p>
        )}

        <div className="flex items-center justify-between mt-4 ">
          <button
            type="submit"
            title="Reset Password"
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Reset Password'} <FaCheckCircle />
          </button>
        </div>
      </form>
    </div>
  );
}
