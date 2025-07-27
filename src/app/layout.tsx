import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/main-layout';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/context/language-context';
import { AuthProvider } from '@/context/auth-context';
import { ExcelDataProvider } from '@/context/excel-data-context';

export const metadata: Metadata = {
  title: 'Al-Shafi\'i Financial Hub',
  description: 'Comprehensive financial management for Al-Shafi\'i Quranic School',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
        <html lang="en" suppressHydrationWarning>
            <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
            </head>
            <body className={cn('font-body antialiased', 'min-h-screen bg-background')}>
                <AuthProvider>
                  <ExcelDataProvider>
                    <MainLayout>{children}</MainLayout>
                  </ExcelDataProvider>
                </AuthProvider>
                <Toaster />
            </body>
        </html>
    </LanguageProvider>
  );
}
