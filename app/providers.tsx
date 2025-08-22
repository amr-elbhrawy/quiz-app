"use client";

import ReduxProvider from "@/store/ReduxProvider";
import { HeroUIProvider } from "@heroui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLoader from "@/app/components/AuthLoader/AuthLoader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ReduxProvider>
        <AuthLoader />
        <ToastContainer position="top-right" autoClose={3000} />
        {children}
      </ReduxProvider>
    </HeroUIProvider>
  );
}
