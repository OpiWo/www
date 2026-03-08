'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useTopics } from '@/hooks/useTopics';
import { usePendingTopics } from '@/hooks/usePendingTopics';
import { PendingTopicCard } from '@/components/www/topics/PendingTopicCard';
import type { Topic, TopicsResponse } from '@/types/topics.types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TopicsSectionProps {
  initialTopics: Topic[];
}

// ─── Decorative opinion bar (copied from TopicCard) ───────────────────────────

function DecorativeOpinionBar({ topicId }: { topicId: string }) {
  const seed = topicId.charCodeAt(0) % 40;
  const w1 = 40 + seed;
  const w2 = Math.max(100 - w1 - 10, 8);
  const w3 = 100 - w1 - w2;

  return (
    <div className="flex h-1.5 rounded-full overflow-hidden gap-px" aria-hidden>
      <div
        className="h-full rounded-l-full"
        style={{ width: `${w1}%`, background: 'oklch(0.769 0.18 67 / 0.65)' }}
      />
      <div
        className="h-full"
        style={{ width: `${w2}%`, background: 'oklch(0.5 0.12 261 / 0.5)' }}
      />
      <div
        className="h-full rounded-r-full"
        style={{ width: `${w3}%`, background: 'oklch(0.88 0.006 247 / 0.4)' }}
      />
    </div>
  );
}

// ─── Left column skeleton row ─────────────────────────────────────────────────

function TopicRowSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 h-[88px] animate-pulse" />
  );
}

// ─── Compact topic row ────────────────────────────────────────────────────────

const rowItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function CompactTopicRow({ topic }: { topic: Topic }) {
  return (
    <motion.div variants={rowItem}>
      <Link href={`/topics/${topic.id}`} className="group block">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="rounded-xl border border-border bg-card px-5 py-4 flex flex-col gap-2 transition-all duration-200 group-hover:border-primary/20 group-hover:shadow-sm"
        >
          {/* Row 1: title + language + date */}
          <div className="flex items-start gap-3">
            <h3 className="flex-1 font-semibold text-base line-clamp-1 text-foreground group-hover:text-primary transition-colors duration-150 leading-snug">
              {topic.title}
            </h3>
            <div className="flex items-center gap-2 shrink-0 mt-0.5">
              <span className="font-medium text-[10px] uppercase tracking-widest text-muted-foreground/70 border border-border/60 rounded px-1.5 py-0.5">
                {topic.originalLanguage}
              </span>
              <time className="text-xs text-muted-foreground whitespace-nowrap">
                {topic.publishedAt
                  ? format(new Date(topic.publishedAt), 'MMM d, yyyy')
                  : '—'}
              </time>
            </div>
          </div>
          {/* Row 2: description */}
          <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
            {topic.description}
          </p>
          {/* Row 3: opinion bar */}
          <DecorativeOpinionBar topicId={topic.id} />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── Right column: pending skeleton card ─────────────────────────────────────

function PendingSkeletonCard() {
  return (
    <div className="rounded-xl border border-border/60 border-l-2 border-l-primary/30 bg-card p-5 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-8 rounded bg-muted/60" />
        <div className="h-4 w-20 rounded bg-muted/60" />
      </div>
      <div className="h-5 w-4/5 rounded bg-muted/50" />
      <div className="h-4 w-full rounded bg-muted/40" />
      <div className="h-4 w-3/4 rounded bg-muted/35" />
      <div className="h-1.5 w-full rounded-full bg-muted/40" />
      <div className="flex gap-2">
        <div className="h-7 w-20 rounded-lg bg-muted/50" />
        <div className="h-7 w-24 rounded-lg bg-muted/40" />
      </div>
    </div>
  );
}

// ─── Right column: unauthenticated state ──────────────────────────────────────

function UnauthenticatedVotePanel({ t }: { t: ReturnType<typeof useTranslations<'home'>> }) {
  return (
    <div className="relative">
      {/* Ghost cards */}
      <div className="space-y-3">
        <div
          className="rounded-xl border border-border/40 bg-card p-4 h-32 opacity-40 blur-[1px] pointer-events-none select-none"
          aria-hidden
        />
        <div
          className="rounded-xl border border-border/40 bg-card p-4 h-32 opacity-40 blur-[1px] pointer-events-none select-none"
          aria-hidden
        />
      </div>

      {/* Fade gradient */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, oklch(0.985 0.003 247 / 0.6) 60%, oklch(0.985 0.003 247) 100%)',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none rounded-xl hidden dark:block"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, oklch(0.098 0.018 261 / 0.6) 60%, oklch(0.098 0.018 261) 100%)',
        }}
        aria-hidden
      />

      {/* Sign-in link */}
      <Link
        href="/login"
        className="relative z-10 inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {t('topics_pending_sign_in')}
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}

// ─── Stagger containers ───────────────────────────────────────────────────────

const listContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const pendingItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Main component ───────────────────────────────────────────────────────────

export function TopicsSection({ initialTopics }: TopicsSectionProps) {
  const t = useTranslations('home');
  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = !authLoading && user !== null;

  // Recent topics (left column)
  const initialData: TopicsResponse | undefined =
    initialTopics.length > 0
      ? {
          success: true,
          topics: initialTopics,
          pagination: { limit: 5, hasMore: false, nextCursor: null },
        }
      : undefined;

  const { data: topicsData, isLoading: topicsLoading } = useTopics(
    { limit: 5 },
    initialData,
  );
  const topics = (topicsData?.topics ?? []).slice(0, 5);

  // Pending topics (right column) — only fetch when authenticated
  const { data: pendingData, isLoading: pendingLoading } = usePendingTopics(
    !authLoading && isAuthenticated,
  );
  const pendingTopics = pendingData?.topics ?? [];

  // Track voted topic IDs for optimistic removal
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const filteredPendingTopics = pendingTopics.filter((pt) => !votedIds.has(pt.id));
  const allVoted = filteredPendingTopics.length === 0 && pendingTopics.length > 0;

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-start">

          {/* ── Left column: Recent Topics ── */}
          <div>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-end justify-between mb-8"
            >
              <div className="border-l-2 border-primary pl-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">
                  {t('trending_eyebrow')}
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {t('trending_title')}
                </h2>
              </div>
              <Link
                href="/topics"
                className="group hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-150"
              >
                {t('topics_view_all')}
                <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {/* Topic list */}
            {topicsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <TopicRowSkeleton key={i} />
                ))}
              </div>
            ) : (
              <motion.div
                variants={listContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                className="space-y-3"
              >
                {topics.map((topic) => (
                  <CompactTopicRow key={topic.id} topic={topic} />
                ))}
              </motion.div>
            )}

            {/* Mobile view all */}
            <div className="mt-6 flex sm:hidden">
              <Link
                href="/topics"
                className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-150"
              >
                {t('topics_view_all')}
                <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* ── Right column: Vote to Publish ── */}
          <div>
            {/* Wrapper */}
            <div className="rounded-2xl border border-primary/15 bg-primary/[0.02] p-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">
                  {t('topics_pending_eyebrow')}
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {t('topics_pending_title')}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('topics_pending_subtitle')}
                </p>
              </motion.div>

              {/* Auth loading state */}
              {authLoading && (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <PendingSkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* Unauthenticated state */}
              {!authLoading && !isAuthenticated && (
                <UnauthenticatedVotePanel t={t} />
              )}

              {/* Authenticated: loading */}
              {!authLoading && isAuthenticated && pendingLoading && (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <PendingSkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* Authenticated: all voted or no topics */}
              {!authLoading && isAuthenticated && !pendingLoading && (allVoted || (!pendingLoading && pendingTopics.length === 0)) && (
                <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-primary" />
                  {t('topics_pending_all_voted')}
                </div>
              )}

              {/* Authenticated: topic list */}
              {!authLoading && isAuthenticated && !pendingLoading && filteredPendingTopics.length > 0 && (
                <motion.div
                  variants={listContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="space-y-3"
                >
                  <AnimatePresence>
                    {filteredPendingTopics.map((topic) => (
                      <motion.div
                        key={topic.id}
                        variants={pendingItem}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <PendingTopicCard
                          topic={topic}
                          isAuthenticated={true}
                          onVoted={(id) => setVotedIds((prev) => new Set([...prev, id]))}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
