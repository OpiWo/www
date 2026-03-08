'use client';

import { useTranslations } from 'next-intl';
import { motion, type Variants } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { useAuth } from '@/hooks/use-auth';
import { usePendingTopics } from '@/hooks/usePendingTopics';
import { PendingTopicCard } from '@/components/www/topics/PendingTopicCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/www/shared/EmptyState';
import { ArrowRight, Users, Flame } from 'lucide-react';

// ─── Skeleton card ────────────────────────────────────────────────────────────

function PendingTopicCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/60 border-l-2 border-l-primary/30 bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
      <div className="flex items-center justify-between pt-0.5">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-6" />
        <Skeleton className="h-3 w-8" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Ghost card — blurred placeholder for unauthenticated teaser ──────────────

function GhostCard({ delay = 0, opacity = 0.45 }: { delay?: number; opacity?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-border/40 border-l-2 border-l-primary/20 bg-card p-5 space-y-3 select-none pointer-events-none"
      aria-hidden
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-8 rounded bg-muted/60" />
        <div className="h-4 w-20 rounded bg-muted/60" />
      </div>
      {/* Title lines */}
      <div className="space-y-1.5">
        <div className="h-4 w-full rounded bg-muted/50" />
        <div className="h-4 w-3/4 rounded bg-muted/40" />
      </div>
      {/* Body lines */}
      <div className="space-y-1">
        <div className="h-3 w-full rounded bg-muted/35" />
        <div className="h-3 w-5/6 rounded bg-muted/30" />
      </div>
      {/* Tags */}
      <div className="flex gap-1.5">
        <div className="h-5 w-14 rounded-full bg-muted/40" />
        <div className="h-5 w-18 rounded-full bg-muted/30" />
      </div>
      {/* Vote bar */}
      <div className="space-y-1.5">
        <div className="flex h-1.5 rounded-full overflow-hidden">
          <div className="h-full rounded-l-full" style={{ width: '62%', background: 'oklch(0.769 0.18 67 / 0.3)' }} />
          <div className="h-full rounded-r-full flex-1" style={{ background: 'oklch(0.52 0.02 261 / 0.15)' }} />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-3 w-8 rounded bg-muted/35" />
          <div className="h-3 w-6 rounded bg-primary/20" />
          <div className="h-3 w-8 rounded bg-muted/35" />
        </div>
      </div>
      {/* Vote buttons */}
      <div className="flex gap-2">
        <div className="h-7 w-20 rounded-lg bg-muted/50" />
        <div className="h-7 w-24 rounded-lg bg-muted/40" />
      </div>
    </motion.div>
  );
}

// ─── Unauthenticated teaser ───────────────────────────────────────────────────

function UnauthenticatedTeaser() {
  const t = useTranslations('pending_topics');

  return (
    <div className="relative">
      {/* Ghost cards grid — behind the CTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <GhostCard delay={0} opacity={0.5} />
        <GhostCard delay={0.08} opacity={0.38} />
        <div className="hidden lg:block">
          <GhostCard delay={0.16} opacity={0.25} />
        </div>
      </div>

      {/* Gradient fade overlay — covers the ghost cards to create depth */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.985 0.003 247 / 0) 0%, oklch(0.985 0.003 247 / 0.15) 30%, oklch(0.985 0.003 247 / 0.55) 55%, oklch(0.985 0.003 247 / 0.85) 75%, oklch(0.985 0.003 247) 100%)',
        }}
        // Dark mode override via CSS var (can't use oklch with dark: prefix for bg in Tailwind v4 easily)
        aria-hidden
      />
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none hidden dark:block"
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.098 0.018 261 / 0) 0%, oklch(0.098 0.018 261 / 0.15) 30%, oklch(0.098 0.018 261 / 0.6) 55%, oklch(0.098 0.018 261 / 0.9) 75%, oklch(0.098 0.018 261) 100%)',
        }}
        aria-hidden
      />

      {/* CTA card — floated over the ghost cards */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-[-6rem] mx-auto max-w-xl z-10"
      >
        <div className="rounded-2xl border border-primary/20 bg-card/95 dark:bg-card backdrop-blur-sm p-8 shadow-xl shadow-black/5 dark:shadow-black/30 text-center relative overflow-hidden">
          {/* Amber glow top */}
          <div
            className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 size-48 rounded-full blur-3xl opacity-20"
            style={{ background: 'oklch(0.769 0.18 67)' }}
            aria-hidden
          />

          {/* Icon badge */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20"
          >
            <Flame className="size-5 text-primary" />
          </motion.div>

          {/* Eyebrow */}
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            {t('teaser_eyebrow')}
          </p>

          {/* Heading */}
          <h3 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
            {t('teaser_title')}
          </h3>

          {/* Body */}
          <p className="mb-7 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {t('teaser_body')}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all duration-150"
            >
              <Users className="size-3.5" />
              {t('teaser_cta')}
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              {t('teaser_sign_in')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Authenticated view ───────────────────────────────────────────────────────

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function AuthenticatedPendingTopics() {
  const t = useTranslations('pending_topics');
  const { data, isLoading } = usePendingTopics(true);
  const topics = data?.topics ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <PendingTopicCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <EmptyState
        icon={Flame}
        title={t('empty')}
      />
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {topics.slice(0, 4).map((topic) => (
        <motion.div key={topic.id} variants={cardItem}>
          <PendingTopicCard topic={topic} isAuthenticated />
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PendingTopics() {
  const t = useTranslations('pending_topics');
  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = !authLoading && user !== null;

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Subtle amber background wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.769 0.18 67), transparent)',
        }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-end justify-between"
        >
          <div className="border-l-2 border-primary pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">
              {t('eyebrow')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {isAuthenticated ? t('title') : t('teaser_title')}
            </h2>
            {isAuthenticated && (
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">{t('subtitle')}</p>
            )}
          </div>

          {isAuthenticated && (
            <Link
              href="/topics"
              className="group hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-150"
            >
              {t('view_all')}
              <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          )}
        </motion.div>

        {/* Content */}
        {isAuthenticated ? (
          <AuthenticatedPendingTopics />
        ) : (
          <UnauthenticatedTeaser />
        )}

        {/* Mobile view all — only for authenticated */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 flex sm:hidden justify-center"
          >
            <Link
              href="/topics"
              className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-150"
            >
              {t('view_all')}
              <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
