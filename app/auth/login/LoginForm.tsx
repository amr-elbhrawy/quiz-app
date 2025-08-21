'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import InputShared from '@/app/components/shared/InputSHared';
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

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, successMsg, token } = useAppSelector((state) => state.auth);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors }
  } = useForm<LoginFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginFormInputs) => {
    dispatch(loginThunk(data));
  };

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
        router.push('/QuizApp');
      }, 0);
    }
  }, [error, successMsg, dispatch, reset, router, token]);

  return (
    <div className="w-full max-w-md mx-auto text-white">
      <h2 className="text-xl font-semibold text-lime-300 mb-4 text-center">
        Continue your learning journey with <span className="text-white">QuizWiz!</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-2">
        {/* Email Field */}
        <div>
          <InputShared
            name="email"
            register={register}
            label="Registered email address"
            placeholder="Type your email"
            type="email"
            iconInput={<FaEnvelope className="text-gray-500" />}
            validation={{ 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address"
              }
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-xs -mt-1 mb-2 px-2">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="relative">
            <InputShared
              name="password"
              register={register}
              label="Password"
              placeholder="Type your password"
              type={showPassword ? "text" : "password"}
              iconInput={<FaLock className="text-gray-500" />}
              validation={{ 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              }}
            />
            
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-5 top-11 text-gray-500 hover:text-gray-300 transition-colors duration-200 focus:outline-none z-10"
              title={showPassword ? "Hide password" : "Show password"}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs -mt-1 mb-2 px-2">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button and Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="submit"
            title="Sign In"
            className={`
              flex items-center justify-center gap-2 
              bg-white hover:bg-gray-100 
              text-black font-semibold 
              px-6 py-2.5 rounded-lg 
              transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-gray-800
              ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
              min-w-[120px]
            `}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                Loading...
              </>
            ) : (
              <>
                Sign In <FaCheckCircle size={16} />
              </>
            )}
          </button>

          <p className="text-sm text-gray-300 text-center sm:text-left">
            Forgot password?{' '}
            <Link 
              href="/auth/forget" 
              className="text-lime-300 hover:text-lime-200 hover:underline transition-colors duration-200 font-medium"
            >
              click here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}