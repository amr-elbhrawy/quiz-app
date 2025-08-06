"use client";

import { ReactNode } from "react";
import { HeroUIProvider } from "@heroui/react";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { store } from "../store/store";

type Props = {
  children: ReactNode;
  themeProps?: Record<string, any>;
};

export function Providers({ children, themeProps }: Props) {
  return (
    <ReduxProvider store={store}>
      <HeroUIProvider>
        <NextThemesProvider {...themeProps}>
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
    </ReduxProvider>
  );
}
