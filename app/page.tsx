// app/layout.tsx
'use client';

import ReduxProvider from '@/store/ReduxProvider';
import { HeroUIProvider } from '@heroui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HeroUIProvider>
          <ReduxProvider>
            <ToastContainer position="top-right" autoClose={3000} />
            {children}
          </ReduxProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
