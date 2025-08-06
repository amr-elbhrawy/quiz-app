'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import InputShared from '@/app/components/shared/InputSHared';
import AuthTabs from '@/app/components/authTabs/authTabs';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginThunk } from '@/store/features/auth/authThunk';
import { toast } from 'react-toastify';
import { clearAuthMessages } from '@/store/features/auth/authSlice';

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { loading, error, successMsg } = useAppSelector((state) => state.auth);
  const { register, handleSubmit, reset } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    dispatch(loginThunk(data));
  };

  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthMessages());
    }

    if (successMsg) {
      toast.success(successMsg);
      reset();
      dispatch(clearAuthMessages());
    }
  }, [error, successMsg, dispatch, reset]);

  return (
    <div className="w-full text-white">
      <h2 className="text-xl font-semibold text-lime-300">
        Continue your learning journey with <span className="text-white">QuizWiz!</span>
      </h2>

      <AuthTabs active="signin" />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <InputShared
          name="email"
          register={register}
          label="Registered email address"
          placeholder="Type your email"
          type="email"
          iconInput={<FaEnvelope className="text-gray-500" />}
          validation={{ required: 'Email is required' }}
        />

        <InputShared
          name="password"
          register={register}
          label="Password"
          placeholder="Type your password"
          type="password"
          iconInput={<FaLock className="text-gray-500" />}
          validation={{ required: 'Password is required' }}
        />

        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            title="Sign In"
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign In'} <FaCheckCircle />
          </button>

          <p className="text-sm">
            Forgot password?{' '}
            <Link href="/AuthLayout/forget" className="text-lime-300 hover:underline">
              click here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
