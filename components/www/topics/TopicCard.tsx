'use client';

import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import type { Topic } from '@/types/topics.types';
import { format } from 'date-fns';

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group"
    >
      <Link href={`/topics/${topic.id}`} className="block h-full">
        <div className="h-full rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow duration-200 group-hover:shadow-md group-hover:border-border/80 dark:group-hover:shadow-primary/5">
          {/* Header row: language + date */}
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70 border border-border/60 rounded px-1.5 py-0.5">
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
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {topic.description}
          </p>

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
