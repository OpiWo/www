'use client';

import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import type { Topic } from '@/types/topics.types';
import { format } from 'date-fns';

interface TopicCardProps {
  topic: Topic;
}

// Deterministic decorative opinion distribution bar.
// Uses the first char code of the topic ID to vary widths — no real data, just visual texture.
function DecorativeOpinionBar({ topicId }: { topicId: string }) {
  const seed = topicId.charCodeAt(0) % 40; // 0–39
  const w1 = 40 + seed;                     // 40–79%
  const w2 = Math.max(100 - w1 - 10, 8);   // remainder minus 10, min 8%
  const w3 = 100 - w1 - w2;                 // remaining

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
        className="h-full rounded-r-full flex-1"
        style={{ background: 'oklch(0.88 0.006 247 / 0.4)' }}
      />
    </div>
  );
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group h-full"
    >
      <Link href={`/topics/${topic.id}`} className="block h-full">
        <div className="h-full rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-primary/20 dark:group-hover:shadow-primary/5 flex flex-col">
          {/* Header row: language + date */}
          <div className="mb-3 flex items-center justify-between">
            <span className="font-medium text-[10px] uppercase tracking-widest text-muted-foreground/70 border border-border/60 rounded px-1.5 py-0.5">
              {topic.originalLanguage}
            </span>
            <time className="text-xs text-muted-foreground">
              {topic.publishedAt
                ? format(new Date(topic.publishedAt), 'MMM d, yyyy')
                : '—'}
            </time>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-base font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-150">
            {topic.title}
          </h3>

          {/* Description */}
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
            {topic.description}
          </p>

          {/* Decorative opinion bar */}
          <div className="mb-4">
            <DecorativeOpinionBar topicId={topic.id} />
          </div>

          {/* Tags */}
          {topic.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {topic.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {topic.tags.length > 3 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{topic.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
