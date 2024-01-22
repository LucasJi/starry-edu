import { NextAuthProvider, StyledComponentsRegistry } from '@component';
import { ConfigProvider } from 'antd';
import { Locale } from 'antd/es/locale';
import zh from 'antd/es/locale/zh_CN.js';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Starry Edu',
  description: 'Inspired by https://github.com/PlayEdu/PlayEdu',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <NextAuthProvider>
          <ConfigProvider locale={zh as unknown as Locale}>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </ConfigProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
