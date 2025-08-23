// app/page.tsx
import { Metadata } from 'next';
import AuthContainer from "./components/AuthContainer/AuthContainer";

export const metadata: Metadata = {
  title: 'تسجيل الدخول - Quizwiz',
  description: 'سجل دخولك أو أنشئ حساب جديد في Quizwiz',
};

export default function HomePage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 overflow-hidden">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 z-10">
        <div className="w-full max-w-md text-white">
          <div className="mb-6">
            <img src="/Logo-white.png" alt="Quizwiz Logo" className="h-10 mb-2" />
          </div>
          <AuthContainer />
        </div>
      </div>
      
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative p-8">
        <div className="bg-[#ffeede] rounded-3xl p-8 max-w-lg max-h-[600px] w-full h-auto flex items-center justify-center">
          <img
            src="/Login.svg"
            alt="Quizwiz Illustration"
            className="w-full h-auto max-h-[500px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}