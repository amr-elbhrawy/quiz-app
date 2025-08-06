import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ReduxProvider from '@/store/ReduxProvider';
import { HeroUIProvider } from "@heroui/react"; // ✅ استيراد HeroUI

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuizWiz',
  description: 'Online Quiz App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HeroUIProvider> {/* ✅ لفينا التطبيق بـ HeroUI */}
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
