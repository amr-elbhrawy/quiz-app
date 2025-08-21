'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import InputShared from '@/app/components/shared/InputSHared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPasswordThunk } from '@/store/features/auth/authThunk';
import { toast } from 'react-toastify';
import { clearAuthMessages } from '@/store/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ResetPasswordInputs = {
  otp: string;
  email: string;
  password: string;
};

export default function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, successMsg } = useAppSelector((state) => state.auth);

   const [isLoaded, setIsLoaded] = useState(false);

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
    setIsLoaded(true);
    if (error) {
      toast.error(error);
      dispatch(clearAuthMessages());
    }

    if (successMsg) {
      toast.success(successMsg);
      reset();
      setTimeout(() => router.push('/auth'), 300);
      dispatch(clearAuthMessages());
    }
  }, [error, successMsg, dispatch, reset, router]);

  return (
    <div
      className={`w-full text-white transition-all duration-500 ease-in-out transform ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Back Button */}
      <Link
        href="/auth/forget"
        className="inline-flex items-center gap-2 text-lime-300 hover:text-lime-200 transition-all duration-300 hover:gap-3 mb-4"
      >
        <FiArrowLeft size={16} className="transition-transform duration-300 hover:-translate-x-1" />
        Back
      </Link>

      <h2 className="text-xl font-semibold text-lime-300 mb-4">
        Reset your password on <span className="text-white">QuizWiz</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            title="Reset Password"
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 cursor-pointer disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Reset Password'} <FaCheckCircle />
          </button>
        </div>
      </form>
    </div>
  );
}
