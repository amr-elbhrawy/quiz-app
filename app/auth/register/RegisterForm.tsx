'use client';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import InputShared from "@/app/components/shared/InputSHared";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signupThunk } from '@/store/features/auth/authThunk';
import { toast } from "react-toastify";
import { clearAuthMessages } from '@/store/features/auth/authSlice';

type SignUpFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

type RegisterFormProps = {
  onSuccess?: () => void;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const dispatch = useAppDispatch();
  const { loading, error, successMsg } = useAppSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = (data: SignUpFormInputs) => {
    dispatch(signupThunk(data));
  };

  const password = watch("password");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthMessages());
    }

    if (successMsg) {
      toast.success(successMsg);
      reset();
      dispatch(clearAuthMessages());
      if (onSuccess) onSuccess();
    }
  }, [error, successMsg, dispatch, reset, onSuccess]);

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-lime-300 mb-4 text-center">
        Create your account and start using <span className="text-white">QuizWiz!</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-2">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <InputShared
              name="firstName"
              register={register}
              label="Your first name"
              placeholder="Type your first name"
              type="text"
              iconInput={<FaIdCard className="text-gray-500" />}
              validation={{ 
                required: "First name is required",
                minLength: { value: 2, message: "First name must be at least 2 characters" }
              }}
            />
            {errors.firstName && <p className="text-red-500 text-xs -mt-1 mb-2 px-2">{errors.firstName.message}</p>}
          </div>

          <div>
            <InputShared
              name="lastName"
              register={register}
              label="Your last name"
              placeholder="Type your last name"
              type="text"
              iconInput={<FaIdCard className="text-gray-500" />}
              validation={{ 
                required: "Last name is required",
                minLength: { value: 2, message: "Last name must be at least 2 characters" }
              }}
            />
            {errors.lastName && <p className="text-red-500 text-xs -mt-1 mb-2 px-2">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <InputShared
            name="email"
            register={register}
            label="Your email address"
            placeholder="Type your email"
            type="email"
            iconInput={<FaEnvelope className="text-gray-500" />}
            validation={{ 
              required: "Email is required",
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Please enter a valid email address" }
            }}
          />
          {errors.email && <p className="text-red-500 text-xs -mt-1 mb-2 px-2">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 px-2">Your role</label>
          <div className="px-2">
            <select
              {...register("role", { required: "Role is required" })}
              className={`w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border ${
                errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
              defaultValue=""
            >
              <option value="" disabled className="text-gray-500">Choose your role</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          {errors.role && <p className="text-red-500 text-xs mt-1 px-2">{errors.role.message}</p>}
        </div>

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
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Password must contain uppercase, lowercase and number' }
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
          {errors.password && <p className="text-red-500 text-xs -mt-1 mb-2 px-2">{errors.password.message}</p>}
        </div>

<div>
  <div className="relative">
    <InputShared
      name="confirmPassword"
      register={register}
      label="Confirm Password"
      placeholder="Re-type your password"
      type={showConfirmPassword ? "text" : "password"}
      iconInput={<FaLock className="text-gray-500" />}
      validation={{
        required: "Please confirm your password",
        validate: (value: string) =>
          value === password || "Passwords do not match",
      }}
    />
    <button
      type="button"
      onClick={toggleConfirmPasswordVisibility}
      className="absolute right-5 top-11 text-gray-500 hover:text-gray-300 transition-colors duration-200 focus:outline-none z-10"
      title={showConfirmPassword ? "Hide password" : "Show password"}
      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
    >
      {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
    </button>
  </div>
  {errors.confirmPassword && (
    <p className="text-red-500 text-xs -mt-1 mb-2 px-2">
      {errors.confirmPassword.message}
    </p>
  )}
</div>


        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="submit"
            className={`flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-gray-800 ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} min-w-[120px]`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                Loading...
              </>
            ) : (
              <>
                Sign Up <FaCheckCircle size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
