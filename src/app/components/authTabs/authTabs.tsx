import Link from "next/link";
import { FaUser, FaUserPlus } from "react-icons/fa";

type Props = {
  active: "signin" | "signup";
};

export default function AuthTabs({ active }: Props) {
  return (
    <div className="flex gap-4 mt-4">
      {/* Sign In */}
      <Link
          href="/AuthLayout/login"
        className={`flex flex-col items-center justify-center p-4 rounded-md w-1/2 text-white transition-transform transform hover:scale-105 active:scale-95 ${
          active === "signin"
            ? "bg-lime-500 bg-opacity-20 border border-lime-300"
            : "bg-gray-700"
        }`}
      >
        <FaUser
          className={`mb-2 text-2xl transition-colors ${
            active === "signin" ? "text-lime-400" : "text-white"
          }`}
        />
        Sign in
      </Link>

      {/* Sign Up */}
      <Link
        href="/AuthLayout/register"
        className={`flex flex-col items-center justify-center p-4 rounded-md w-1/2 text-white transition-transform transform hover:scale-105 active:scale-95 ${
          active === "signup"
            ? "bg-lime-500 bg-opacity-20 border border-lime-300"
            : "bg-gray-700"
        }`}
      >
        <FaUserPlus
          className={`mb-2 text-2xl transition-colors ${
            active === "signup" ? "text-lime-400" : "text-white"
          }`}
        />
        Sign Up
      </Link>
    </div>
  );
}
