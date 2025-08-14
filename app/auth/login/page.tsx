'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import InputShared from '@/app/components/shared/InputSHared';
import AuthTabs from '@/app/components/authTabs/authTabs';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginThunk } from '@/store/features/auth/authThunk';
import { toast } from 'react-toastify';
import { clearAuthMessages } from '@/store/features/auth/authSlice';
import { useRouter } from 'next/navigation';

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, successMsg, token } = useAppSelector((state) => state.auth);
  const { register, handleSubmit, reset } = useForm<LoginFormInputs>();
  
  // State لإظهار/إخفاء كلمة المرور
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginFormInputs) => {
    dispatch(loginThunk(data));
  };

  // دالة لتبديل إظهار/إخفاء كلمة المرور
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthMessages());
    }

    if (successMsg && token) {
      toast.success(successMsg);
      reset();
      dispatch(clearAuthMessages());
      setTimeout(() => {
        router.push('/test');
      }, 0);
    }
  }, [error, successMsg, dispatch, reset, router]);

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

        {/* حقل كلمة المرور مع إمكانية الإظهار/الإخفاء */}
        <div className="relative">
          <InputShared
            name="password"
            register={register}
            label="Password"
            placeholder="Type your password"
            type={showPassword ? "text" : "password"}
            iconInput={<FaLock className="text-gray-500" />}
            validation={{ required: 'Password is required' }}
          />
          
          {/* زر إظهار/إخفاء كلمة المرور */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute left-3 top-[38px] text-gray-500 hover:text-gray-300 transition-colors"
            title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            title="Sign In"
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-semibold cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign In'} <FaCheckCircle />
            <Link href="/test"> </Link>
          </button>

          <p className="text-sm">
            Forgot password?{' '}
            <Link href="/auth/forget" className="text-lime-300 hover:underline">
              click here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}