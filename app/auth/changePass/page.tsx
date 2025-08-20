'use client';
import InputShared from '@/app/components/shared/InputSHared';
import { useForm } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FiArrowLeft } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { changePasswordThunk } from '@/store/features/auth/authThunk';
import { clearAuthMessages } from '@/store/features/auth/authSlice';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormData {
  password: string;
  password_new: string;
}

const ChangePasswordPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { register, reset, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { loading, error, successMsg } = useAppSelector(state => state.auth);

  const onSubmit = (data: FormData) => {
    dispatch(changePasswordThunk(data));
    reset();
  };

  useEffect(() => {
    setIsLoaded(true);
    if (error) toast.error(error);
    if (successMsg) {
      toast.success(successMsg);
      setTimeout(() => router.push('/dashboard'), 1500);
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
        Back to dashboard
      </Link>

      <h2 className="text-xl font-semibold text-lime-300 mb-2">
        Update your password
      </h2>
      <p className="text-sm text-gray-300 mb-4">
        For your security, please provide your current and new password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password */}
<div className="relative">
  <InputShared
    register={register}
    name="password"
    type={showCurrent ? "text" : "password"}
    validation={{ required: 'The current password is required' }}
    iconInput={<RiLockPasswordLine className="text-gray-500" />}
    label="Current password"
    placeholder="Type your current password"
  />
<span 
  onClick={() => setShowCurrent(!showCurrent)} 
  className="absolute right-3 top-1/2   cursor-pointer text-lime-400 hover:text-lime-300 transition"
>
  {showCurrent ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
</span>

</div>
{errors.password && (
  <p className="text-red-500 ml-2 text-sm capitalize">
    {errors.password.message}
  </p>
)}


        {/* New Password */}
       <div className="relative">
  <InputShared
    register={register}
    name="password_new"
    type={showNew ? "text" : "password"}
    validation={{ 
      required: 'The new password is required',
      minLength: {
        value: 6,
        message: 'New password must be at least 6 characters'
      }
    }}
    iconInput={<RiLockPasswordLine className="text-gray-500" />}
    label="New password"
    placeholder="Type your new password"
  />
<span 
  onClick={() => setShowNew(!showNew)} 
  className="absolute right-3 top-2/4  cursor-pointer text-lime-400 hover:text-lime-300 transition"
>
  {showNew ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
</span>

</div>
{errors.password_new && (
  <p className="text-red-500 ml-2 text-sm capitalize">
    {errors.password_new.message}
  </p>
)}


        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 cursor-pointer disabled:opacity-70"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
