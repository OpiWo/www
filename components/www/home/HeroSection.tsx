'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Abstract opinion distribution bars — decorative visual element
function OpinionBars({ label }: { label: string }) {
  const bars = [
    { width: '72%', delay: 0.6 },
    { width: '45%', delay: 0.7 },
    { width: '88%', delay: 0.8 },
    { width: '31%', delay: 0.9 },
    { width: '60%', delay: 1.0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 pr-8 xl:pr-0"
      aria-hidden
    >
      <div className="text-[10px] font-medium tracking-widest text-muted-foreground/40 uppercase mb-3">
        {label}
      </div>
      {bars.map((bar, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden" style={{ width: 120 }}>
            <motion.div
              className="h-full rounded-full bg-primary/30"
              initial={{ width: 0 }}
              animate={{ width: bar.width }}
              transition={{ duration: 0.8, delay: bar.delay, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground/40">{bar.width}</span>
        </div>
      ))}
    </motion.div>
  );
}

const heroItems = [
  { key: 'eyebrow', delay: 0.1 },
  { key: 'heading', delay: 0.22 },
  { key: 'subtitle', delay: 0.34 },
  { key: 'cta', delay: 0.46 },
];

export function HeroSection() {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden">
      {/* Ambient gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.769 0.18 67 / 0.07) 0%, transparent 70%)',
        }}
      />
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(oklch(0.13 0.02 261) 1px, transparent 1px), linear-gradient(90deg, oklch(0.13 0.02 261) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <OpinionBars label={t('hero_bars_label')} />

        <div className="max-w-3xl">
          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: heroItems[0].delay, ease: 'easeOut' }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              {t('hero_eyebrow')}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: heroItems[1].delay, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.05]"
          >
            {t('hero_title')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: heroItems[2].delay, ease: 'easeOut' }}
            className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl"
          >
            {t('hero_subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: heroItems[3].delay, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link href="/topics">
              <Button size="lg" className="gap-2 px-6">
                {t('cta_explore')}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="px-6">
                {t('cta_join')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
