'use client';

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaCheckCircle,
  FaIdCard,
} from "react-icons/fa";
import InputShared from "@/app/components/shared/InputSHared";
import AuthTabs from "@/app/components/authTabs/authTabs";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signupThunk } from '@/store/features/auth/authThunk';
import { toast } from "react-toastify";
import { clearAuthMessages } from '@/store/features/auth/authSlice';

type SignUpFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

export default function SignUpPage() {
  const dispatch = useAppDispatch();
  const { loading, error, successMsg } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormInputs>();

  const onSubmit = (data: SignUpFormInputs) => {
    dispatch(signupThunk(data));
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
    <>
      <h2 className="text-xl font-semibold text-lime-300">
        Create your account and start using{" "}
        <span className="text-white">QuizWiz!</span>
      </h2>

      <AuthTabs active="signup" />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {/* First & Last Name */}
        <div className="flex flex-col lg:flex-row gap-4">
          <InputShared
            name="firstName"
            register={register}
            label="Your first name"
            placeholder="Type your first name"
            type="text"
            iconInput={<FaIdCard className="text-gray-500" />}
            validation={{ required: "First name is required" }}
          />

          <InputShared
            name="lastName"
            register={register}
            label="Your last name"
            placeholder="Type your last name"
            type="text"
            iconInput={<FaIdCard className="text-gray-500" />}
            validation={{ required: "Last name is required" }}
          />
        </div>

        {/* Email */}
        <InputShared
          name="email"
          register={register}
          label="Your email address"
          placeholder="Type your email"
          type="email"
          iconInput={<FaEnvelope className="text-gray-500" />}
          validation={{ required: "Email is required" }}
        />

        {/* Role Select */}
        <div className="w-full p-2">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Your role
          </label>
          <select
            {...register("role", { required: "Role is required" })}
            className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            defaultValue=""
          >
            <option value="" disabled>
              Choose your role
            </option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>

        {/* Password */}
        <InputShared
          name="password"
          register={register}
          label="Password"
          placeholder="Type your password"
          type="password"
          iconInput={<FaLock className="text-gray-500" />}
          validation={{ required: "Password is required" }}
        />

        {/* Submit */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"} <FaCheckCircle />
          </button>

          <p className="text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-lime-300 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
