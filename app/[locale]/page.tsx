import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-4 max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/logo.svg" alt="OpiWo" className="h-10" />
        </div>
        <h1 className="text-5xl font-bold tracking-tighter text-foreground">
          {t('hero_title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('hero_subtitle')}
        </p>
        <p className="text-xs text-muted-foreground/50 pt-8">WWW10 — Project initialized</p>
      </div>
    </main>
  );
}
