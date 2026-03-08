'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import {
  CheckCircle2,
  Loader2,
  LogIn,
  Sparkles,
  Clock,
  ChevronRight,
  Vote,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useUserOpinion } from '@/hooks/useUserOpinion';
import { useSubmitOpinion } from '@/hooks/useSubmitOpinion';
import { Skeleton } from '@/components/ui/skeleton';
import type { TopicDetail, TopicOption } from '@/types/topics.types';

// ─── CHART COLORS (matching OptionsResultsChart) ──────────────────────────────
const CHART_COLORS = [
  '#f59e0b', // amber
  '#0ea5e9', // sky
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f43f5e', // rose
  '#94a3b8', // slate
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Extract "X more day(s)" from the backend error message */
function parseLockDays(message: string): number | null {
  const match = message.match(/(\d+)\s*more\s*day/i);
  return match ? parseInt(match[1], 10) : null;
}

// ─── OPTION CARD ──────────────────────────────────────────────────────────────

interface OptionCardProps {
  option: TopicOption;
  index: number;
  isSelected: boolean;
  isCurrentVote: boolean;
  disabled: boolean;
  muted: boolean;
  onClick: () => void;
}

function OptionCard({
  option,
  index,
  isSelected,
  isCurrentVote,
  disabled,
  muted,
  onClick,
}: OptionCardProps) {
  const color = CHART_COLORS[index % CHART_COLORS.length];

  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.015 }}
      whileTap={disabled ? {} : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'relative w-full text-left rounded-xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        // base
        'px-4 py-4 sm:px-5',
        // muted/disabled (locked state — for sign-in view)
        muted && 'opacity-40 cursor-default pointer-events-none',
        // unselected
        !isSelected &&
          !muted &&
          !disabled &&
          'border-border bg-card hover:border-primary/40 hover:bg-primary/[0.03] cursor-pointer',
        // selected / current vote
        isSelected &&
          !muted &&
          'border-primary/70 bg-primary/[0.06] shadow-[0_0_0_3px_hsl(var(--primary)/0.08)] cursor-pointer',
        // disabled (during submission)
        disabled && !muted && 'cursor-not-allowed opacity-70',
        // current vote in already-voted state (non-changing)
        isCurrentVote && !isSelected && 'border-border/60 bg-muted/30',
      )}
      aria-pressed={isSelected}
    >
      {/* Color accent strip */}
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full transition-all duration-300"
        style={{
          backgroundColor: isSelected ? color : 'transparent',
        }}
        aria-hidden
      />

      <span className="flex items-center justify-between gap-3 pl-2">
        <span
          className={cn(
            'text-sm sm:text-base font-medium capitalize transition-colors duration-200',
            isSelected ? 'text-foreground' : 'text-foreground/80',
          )}
        >
          {option.value}
        </span>

        <span className="shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            {isSelected ? (
              <motion.span
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="flex size-5 items-center justify-center rounded-full"
                style={{ backgroundColor: color }}
              >
                <CheckCircle2 className="size-3.5 text-white" strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.span
                key="ring"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex size-5 items-center justify-center rounded-full border-2 border-border"
              />
            )}
          </AnimatePresence>
        </span>
      </span>
    </motion.button>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────

function OpinionFormSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="mb-6">
        <Skeleton className="h-5 w-20 mb-2" />
        <Skeleton className="h-7 w-48 mb-1" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-11 w-full mt-5 rounded-lg" />
    </div>
  );
}

// ─── NOT-AUTH CARD ────────────────────────────────────────────────────────────

interface NotAuthCardProps {
  topic: TopicDetail;
}

function NotAuthCard({ topic }: NotAuthCardProps) {
  const t = useTranslations('opinion_form');
  const locale = useLocale();

  const options = topic.optionsSnapshot.options
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Eyebrow + heading */}
      <div className="px-6 pt-6 pb-5 sm:px-8 sm:pt-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10">
            <Vote className="size-4 text-primary" />
          </span>
          <span className="text-xs font-medium tracking-widest uppercase text-primary">
            {t('sign_in_title')}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-1 leading-snug">
          {topic.title}
        </h3>
        <p className="text-sm text-muted-foreground">{t('sign_in_subtitle')}</p>
      </div>

      {/* Muted options preview */}
      <div className="px-6 sm:px-8 pb-5 space-y-2.5" aria-hidden>
        {options.map((option, idx) => (
          <OptionCard
            key={option.id}
            option={option}
            index={idx}
            isSelected={false}
            isCurrentVote={false}
            disabled={false}
            muted={true}
            onClick={() => {}}
          />
        ))}
      </div>

      {/* CTA strip */}
      <div className="border-t border-border bg-muted/30 px-6 py-4 sm:px-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href={`/${locale}/login`}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <LogIn className="size-4" />
          {t('sign_in_cta')}
        </Link>
        <span className="text-xs text-muted-foreground hidden sm:block">{t('sign_in_or')}</span>
        <Link
          href={`/${locale}/register`}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
        >
          {t('sign_in_join')}
        </Link>
      </div>
    </motion.div>
  );
}

// ─── VOTE FORM (first-time + re-answer) ───────────────────────────────────────

interface VoteFormProps {
  topic: TopicDetail;
  currentVote: string | null;
}

function VoteForm({ topic, currentVote }: VoteFormProps) {
  const t = useTranslations('opinion_form');
  const [selected, setSelected] = useState<string | null>(null);
  const [lockMessage, setLockMessage] = useState<string | null>(null);
  const [showVoted, setShowVoted] = useState(false);

  const { mutate, isPending } = useSubmitOpinion(topic.id);

  const options = topic.optionsSnapshot.options
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const isReanswer = currentVote !== null;
  const effectiveSelected = selected ?? (isReanswer ? currentVote : null);

  const handleSelect = useCallback(
    (value: string) => {
      if (isPending) return;
      setSelected(value);
      setLockMessage(null);
    },
    [isPending],
  );

  const handleSubmit = useCallback(() => {
    if (!effectiveSelected || isPending) return;

    // If re-answering and picked the same — quietly ignore
    if (isReanswer && effectiveSelected === currentVote) return;

    mutate(effectiveSelected, {
      onSuccess: () => {
        toast.success(t('success'));
        setShowVoted(true);
      },
      onError: (err: unknown) => {
        const apiErr = err as { response?: { data?: { code?: string; message?: string } } };
        const code = apiErr?.response?.data?.code;
        const message = apiErr?.response?.data?.message ?? '';

        if (code === 'OPINION_SAME_VALUE') {
          // Quietly do nothing
          return;
        }

        if (code === 'OPINION_REANSWER_LOCKED') {
          const days = parseLockDays(message);
          setLockMessage(
            days !== null
              ? t('locked_days', { days })
              : message,
          );
          return;
        }

        toast.error(message || t('success'));
      },
    });
  }, [effectiveSelected, isPending, isReanswer, currentVote, mutate, t]);

  // After a successful vote submission, transition to the voted view
  if (showVoted && effectiveSelected) {
    return <VotedState topic={topic} votedValue={effectiveSelected} />;
  }

  const canSubmit =
    effectiveSelected !== null &&
    !(isReanswer && effectiveSelected === currentVote) &&
    !isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium tracking-widest uppercase text-primary">
            {isReanswer ? t('change_answer') : t('title')}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-foreground leading-snug">
          {topic.title}
        </h3>
        {!isReanswer && (
          <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
        )}
        {isReanswer && (
          <p className="text-sm text-muted-foreground mt-1">{t('voted_change_hint')}</p>
        )}
      </div>

      {/* Option cards */}
      <motion.div
        className="space-y-2.5 mb-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {options.map((option, idx) => (
          <motion.div
            key={option.id}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <OptionCard
              option={option}
              index={idx}
              isSelected={effectiveSelected === option.value}
              isCurrentVote={isReanswer && currentVote === option.value}
              disabled={isPending}
              muted={false}
              onClick={() => handleSelect(option.value)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Lock inline message */}
      <AnimatePresence>
        {lockMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
              <Clock className="size-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80">{lockMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={cn(
          'w-full flex items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          canSubmit
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] shadow-sm cursor-pointer'
            : 'bg-muted text-muted-foreground cursor-not-allowed',
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t('submitting')}
          </>
        ) : (
          <>
            <ChevronRight className="size-4" />
            {t('submit')}
          </>
        )}
      </button>
    </motion.div>
  );
}

// ─── VOTED STATE (already answered, satisfied view) ───────────────────────────

interface VotedStateProps {
  topic: TopicDetail;
  votedValue: string;
}

function VotedState({ topic, votedValue }: VotedStateProps) {
  const t = useTranslations('opinion_form');
  const [isChanging, setIsChanging] = useState(false);

  const options = topic.optionsSnapshot.options
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const votedOption = options.find((o) => o.value === votedValue);
  const votedIdx = options.findIndex((o) => o.value === votedValue);
  const votedColor = votedIdx >= 0 ? CHART_COLORS[votedIdx % CHART_COLORS.length] : '#f59e0b';

  if (isChanging) {
    return <VoteForm topic={topic} currentVote={votedValue} />;
  }

  return (
    <motion.div
      key="voted"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="flex size-5 items-center justify-center rounded-full"
              style={{ backgroundColor: votedColor }}
            >
              <CheckCircle2 className="size-3.5 text-white" strokeWidth={2.5} />
            </motion.span>
            <span className="text-xs font-medium tracking-widest uppercase text-primary">
              {t('voted_eyebrow')}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-foreground leading-snug">{topic.title}</h3>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles className="size-5 text-primary/40 shrink-0 mt-1" />
        </motion.div>
      </div>

      {/* Option cards — all shown, voted one highlighted */}
      <motion.div
        className="space-y-2.5 mb-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {options.map((option, idx) => (
          <motion.div
            key={option.id}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <OptionCard
              option={option}
              index={idx}
              isSelected={option.value === votedValue}
              isCurrentVote={option.value === votedValue}
              disabled={true}
              muted={false}
              onClick={() => {}}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Your answer label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-2 mb-5 px-1"
      >
        <span className="text-xs text-muted-foreground">{t('your_answer')}:</span>
        <span
          className="text-xs font-semibold capitalize"
          style={{ color: votedColor }}
        >
          {votedOption?.value ?? votedValue}
        </span>
      </motion.div>

      {/* Change answer CTA */}
      {topic.reanswerLockDays === 0 ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => setIsChanging(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
        >
          <ChevronRight className="size-4" />
          {t('change_answer')}
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3"
        >
          <Clock className="size-4 text-amber-500 shrink-0" />
          <p className="text-xs text-foreground/70">
            {t('voted_locked_hint', { days: topic.reanswerLockDays })}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

interface OpinionFormProps {
  topic: TopicDetail;
}

export function OpinionForm({ topic }: OpinionFormProps) {
  const { user } = useAuth();
  const isAuth = !!user;

  const { data: currentOpinion, isLoading } = useUserOpinion(topic.id, isAuth);

  // Not authenticated — show enticing sign-in card
  if (!isAuth) {
    return <NotAuthCard topic={topic} />;
  }

  // Loading user's current opinion
  if (isLoading) {
    return <OpinionFormSkeleton />;
  }

  // Already voted — show voted state
  if (currentOpinion) {
    return <VotedState topic={topic} votedValue={currentOpinion.optionValue} />;
  }

  // First time voter
  return <VoteForm topic={topic} currentVote={null} />;
}
