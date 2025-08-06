import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 overflow-hidden">
      
       <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 z-10">
        <div className="w-full max-w-md text-white">
           <div className="mb-6">
            <img src="/Logo.png" alt="Quizwiz Logo" className="h-10 mb-2" />
          </div>
          
          {children}
        </div>
      </div>

       <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative p-8">
        <div className="bg-[#ffeede] rounded-3xl p-8 max-w-lg max-h-[600px] w-full h-auto flex items-center justify-center">
          <img
            src="/Image.svg"
            alt="Quizwiz Illustration"
            className="w-full h-auto max-h-[500px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;