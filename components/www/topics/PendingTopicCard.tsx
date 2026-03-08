'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { useVote } from '@/hooks/useVote';
import { ChevronUp, ChevronDown, Loader2, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import type { Topic } from '@/types/topics.types';

interface PendingTopicCardProps {
  topic: Topic;
  isAuthenticated: boolean;
}

function VoteBar({
  upvotes,
  downvotes,
  netScore,
}: {
  upvotes: number;
  downvotes: number;
  netScore: number;
}) {
  const total = upvotes + downvotes;
  const upPct = total > 0 ? Math.round((upvotes / total) * 100) : 50;
  const downPct = 100 - upPct;

  return (
    <div className="space-y-1.5">
      {/* Track */}
      <div className="flex h-1.5 rounded-full overflow-hidden" aria-hidden>
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${upPct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-l-full"
          style={{ background: 'oklch(0.769 0.18 67 / 0.8)' }}
        />
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${downPct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-r-full"
          style={{ background: 'oklch(0.52 0.02 261 / 0.3)' }}
        />
      </div>
      {/* Counts row */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground/70 flex items-center gap-0.5">
          <ChevronUp className="size-3 text-primary/70" />
          {upvotes}
        </span>
        <span
          className={`font-semibold tabular-nums ${
            netScore > 0
              ? 'text-primary'
              : netScore < 0
                ? 'text-destructive/70'
                : 'text-muted-foreground'
          }`}
        >
          {netScore > 0 ? '+' : ''}
          {netScore}
        </span>
        <span className="text-muted-foreground/70 flex items-center gap-0.5">
          {downvotes}
          <ChevronDown className="size-3 text-muted-foreground/50" />
        </span>
      </div>
    </div>
  );
}

function VoteButton({
  direction,
  isVoted,
  isPending,
  disabled,
  onClick,
  label,
}: {
  direction: 'upvote' | 'downvote';
  isVoted: boolean;
  isPending: boolean;
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  const isUp = direction === 'upvote';

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      transition={{ duration: 0.12 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={isVoted}
      className={`
        relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium
        transition-all duration-200 select-none
        ${
          isVoted
            ? isUp
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'bg-destructive/10 text-destructive/80 border border-destructive/20'
            : 'bg-muted/60 text-muted-foreground border border-transparent hover:bg-muted hover:text-foreground hover:border-border/60'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {isPending ? (
        <Loader2 className="size-3 animate-spin" />
      ) : isUp ? (
        <ChevronUp className={`size-3.5 ${isVoted ? 'text-primary' : ''}`} />
      ) : (
        <ChevronDown className={`size-3.5 ${isVoted ? 'text-destructive/80' : ''}`} />
      )}
      <span>{label}</span>
      {isVoted && (
        <motion.span
          layoutId={`vote-indicator-${direction}`}
          className={`absolute inset-0 rounded-lg ${
            isUp ? 'bg-primary/5' : 'bg-destructive/5'
          }`}
        />
      )}
    </motion.button>
  );
}

export function PendingTopicCard({ topic, isAuthenticated }: PendingTopicCardProps) {
  const t = useTranslations('pending_topics');
  const { vote, localVote, isPending, pendingDirection } = useVote(topic.id);

  const upvotes = topic.upvotes ?? 0;
  const downvotes = topic.downvotes ?? 0;
  const netScore = topic.netScore ?? 0;

  const currentVote = localVote;

  const handleVote = (direction: 'upvote' | 'downvote') => {
    vote(direction);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group h-full"
    >
      <div className="h-full rounded-xl border border-border/60 border-l-2 border-l-primary/40 bg-card p-5 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-primary/30 dark:group-hover:shadow-primary/5 flex flex-col relative overflow-hidden">
        {/* Subtle amber tint overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.025]"
          style={{ background: 'radial-gradient(ellipse at top left, oklch(0.769 0.18 67), transparent 60%)' }}
          aria-hidden
        />

        {/* Header row: language + date */}
        <div className="mb-3 flex items-center justify-between relative z-10">
          <span className="font-medium text-[10px] uppercase tracking-widest text-muted-foreground/70 border border-border/60 rounded px-1.5 py-0.5">
            {topic.originalLanguage}
          </span>
          <time className="text-xs text-muted-foreground">
            {format(new Date(topic.createdAt), 'MMM d, yyyy')}
          </time>
        </div>

        {/* Title */}
        <Link href={`/topics/${topic.id}`} className="block mb-2 relative z-10">
          <h3 className="text-base font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-150">
            {topic.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1 relative z-10">
          {topic.description}
        </p>

        {/* Tags */}
        {topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
            {topic.tags.slice(0, 2).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {topic.tags.length > 2 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{topic.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Vote bar */}
        <div className="mb-3 relative z-10">
          <VoteBar upvotes={upvotes} downvotes={downvotes} netScore={netScore} />
        </div>

        {/* Vote buttons / sign-in prompt */}
        <div className="relative z-10">
          {isAuthenticated ? (
            <div className="flex gap-2">
              <VoteButton
                direction="upvote"
                isVoted={currentVote === 'upvote'}
                isPending={isPending && pendingDirection === 'upvote'}
                disabled={isPending}
                onClick={() => handleVote('upvote')}
                label={t('vote_up')}
              />
              <VoteButton
                direction="downvote"
                isVoted={currentVote === 'downvote'}
                isPending={isPending && pendingDirection === 'downvote'}
                disabled={isPending}
                onClick={() => handleVote('downvote')}
                label={t('vote_down')}
              />
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5"
              >
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-150"
                >
                  <LogIn className="size-3" />
                  {t('sign_in_to_vote')}
                </Link>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
