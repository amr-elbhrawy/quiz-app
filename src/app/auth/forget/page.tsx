'use client';

import InputShared from '@/app/components/shared/InputSHared';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { FiMail } from 'react-icons/fi';
import { EMAIL_VALIDATION } from '@/services/validation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forgetPasswordThunk } from '@/store/features/auth/authThunk';
import { clearAuthMessages } from '@/store/features/auth/authSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
}

const ForgetPasswordPage = () => {
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
    if (error) toast.error(error);

    if (successMsg) {
      toast.success(successMsg);
      router.push('/AuthLayout/reset');
    }

    return () => {
      dispatch(clearAuthMessages());
    };
  }, [error, successMsg, dispatch, router]);

  return (
    <div className="w-full text-white">
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

        {/* Submit + Login link */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>

          <Link
            href="/AuthLayout/login"
            className="text-sm text-lime-300 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgetPasswordPage;
