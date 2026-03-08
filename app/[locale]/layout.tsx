import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import QueryProvider from '@/components/QueryProvider';
import { AuthProvider } from '@/hooks/use-auth';
import { Header } from '@/components/www/layout/Header';
import { Footer } from '@/components/www/layout/Footer';

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <NextTopLoader color="oklch(0.769 0.18 67)" showSpinner={false} height={2} />
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </QueryProvider>
        <Toaster richColors position="top-right" closeButton />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
