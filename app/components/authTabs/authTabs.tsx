import { FaUser, FaUserPlus } from "react-icons/fa";

type Props = {
  active: "signin" | "signup";
  onTabChange: (tab: "signin" | "signup") => void;
};

export function AuthTabs({ active, onTabChange }: Props) {
  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={() => onTabChange("signin")}
        className={`flex flex-col items-center justify-center p-4 rounded-md w-1/2 text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 cursor-pointer ${
          active === "signin"
            ? "bg-lime-500 bg-opacity-20 border border-lime-300"
            : "bg-gray-700"
        }`}
      >
        <FaUser className={`mb-2 text-2xl transition-all duration-300 ease-in-out ${
          active === "signin" ? "text-lime-400" : "text-white"
        }`} />
        Sign in
      </button>
      
      <button
        onClick={() => onTabChange("signup")}
        className={`flex flex-col items-center justify-center p-4 rounded-md w-1/2 text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 cursor-pointer ${
          active === "signup"
            ? "bg-lime-500 bg-opacity-20 border border-lime-300"
            : "bg-gray-700"
        }`}
      >
        <FaUserPlus className={`mb-2 text-2xl transition-all duration-300 ease-in-out ${
          active === "signup" ? "text-lime-400" : "text-white"
        }`} />
        Sign Up
      </button>
    </div>
  );
}
