'use client';

import InputShared from '@/app/components/shared/InputSHared';
import { useForm } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { changePasswordThunk } from '@/store/features/auth/authThunk';
import { clearAuthMessages } from '@/store/features/auth/authSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';        

interface FormData {
  password: string;
  password_new: string;
}

const ChangePasswordPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();  

  const { register, reset, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { loading, error, successMsg } = useAppSelector(state => state.auth);

  const onSubmit = (data: FormData) => {
    dispatch(changePasswordThunk(data));
    reset();
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (successMsg) {
      toast.success(successMsg);
      setTimeout(() => {
        router.push('/AuthLayout/login');  
      }, 1500);  
    }

    return () => {
      dispatch(clearAuthMessages());
    };
  }, [error, successMsg, dispatch, router]);

  return (
    <div className="w-full text-white">
      <h2 className="text-xl font-semibold text-lime-300 mb-2">
        Update your password
      </h2>
      <p className="text-sm text-gray-300 mb-4">
        For your security, please provide your current and new password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md w-full space-y-4">
        {/* Current Password */}
        <InputShared
          register={register}
          name="password"
          type="password"
          validation={{ required: 'The current password is required' }}
          iconInput={<RiLockPasswordLine className="text-gray-500" />}
          label="Current password"
          placeholder="Type your current password"
        />
        {errors.password && (
          <p className="text-red-500 ml-2 text-sm capitalize">
            {errors.password.message}
          </p>
        )}

        {/* New Password */}
        <InputShared
          register={register}
          name="password_new"
          type="password"
          validation={{ required: 'The new password is required' }}
          iconInput={<RiLockPasswordLine className="text-gray-500" />}
          label="New password"
          placeholder="Type your new password"
        />
        {errors.password_new && (
          <p className="text-red-500 ml-2 text-sm capitalize">
            {errors.password_new.message}
          </p>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
