"use client";
import { useEffect, useState } from "react";
import { AuthTabs } from "../authTabs/authTabs";
import LoginForm from "@/app/auth/login/LoginForm";
import RegisterForm from "@/app/auth/register/RegisterForm";

export default function AuthContainer() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isLoaded, setIsLoaded] = useState(false);

 
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleRegisterSuccess = () => setActiveTab("signin");

  return (
    <div
      className={`transition-all duration-500 ease-in-out transform ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
   
      <AuthTabs active={activeTab} onTabChange={setActiveTab} />

      <div className="transition-all duration-300 ease-in-out opacity-100 mt-4">
        {activeTab === "signin" ? (
          <LoginForm />
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} />
        )}
      </div>
    </div>
  );
}
