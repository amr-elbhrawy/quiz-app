'use client';
import InputShared from '@/app/components/shared/InputSHared';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { EMAIL_VALIDATION } from '@/services/validation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forgetPasswordThunk } from '@/store/features/auth/authThunk';
import { clearAuthMessages } from '@/store/features/auth/authSlice';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
}

const ForgetPasswordPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { error, successMsg, loading } = useAppSelector((state) => state.auth);

  const onSubmit = (data: FormData) => {
    dispatch(forgetPasswordThunk(data));
    reset();
  };

  useEffect(() => {
    setIsLoaded(true);
    if (error) toast.error(error);

    if (successMsg) {
      toast.success(successMsg);
      setTimeout(() => router.push('/auth'), 300);
    }

    return () => {
      dispatch(clearAuthMessages());
    };
  }, [error, successMsg, dispatch, router]);

  return (
    <div className={`w-full text-white transition-all duration-500 ease-in-out transform ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {/* Back Button */}
      <Link 
        href="/auth" 
        className="inline-flex items-center gap-2 text-lime-300 hover:text-lime-200 transition-all duration-300 hover:gap-3 mb-4"
      >
        <FiArrowLeft size={16} className="transition-transform duration-300 hover:-translate-x-1" />
        Back to login
      </Link>

      <h2 className="text-xl font-semibold text-lime-300 mb-2">
        Forgot your password?
      </h2>
      <p className="text-sm text-gray-300 mb-4">
        Enter your email address to receive the reset link.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full space-y-4"
      >
        {/* Email */}
        <InputShared
          register={register}
          name="email"
          validation={EMAIL_VALIDATION}
          iconInput={<FiMail className="text-gray-500" />}
          label="Email address"
          placeholder="Type your email"
        />
        {errors.email && (
          <p className="text-red-500 ml-2 text-sm capitalize">
            {errors.email.message}
          </p>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 cursor-pointer disabled:opacity-70"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}

          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPasswordPage;