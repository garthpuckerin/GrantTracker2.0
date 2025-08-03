import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import { TRPCProvider } from '@/components/providers/trpc-provider';
import { ClientThemeProvider } from '@/components/providers/client-theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Grant Tracker 2.0',
  description: 'Multi-Year Federal Grant Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ClientThemeProvider>
          {/* <TRPCProvider>{children}</TRPCProvider> */}
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
