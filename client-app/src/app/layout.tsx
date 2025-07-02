
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import I18nProvider from '@/components/i18n-provider';
import { UserProvider } from '@/hooks/use-user';
import { ThemeProvider } from '@/components/theme-provider';


export const metadata: Metadata = {
  title: 'LCUZR CRM',
  description: 'A full-featured CRM application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <UserProvider>
                <I18nProvider>
                    {children}
                    <Toaster />
                </I18nProvider>
            </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
