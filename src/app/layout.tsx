import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_SC } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import BottomNav from '@/components/layout/bottom-nav';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Mandarin Prep',
  description: 'Learn Mandarin for your China business trip',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mandarin Prep',
  },
};

export const viewport: Viewport = {
  themeColor: '#dc2626',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansSC.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <main className="flex-1 pb-20">{children}</main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
