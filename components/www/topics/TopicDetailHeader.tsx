'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Calendar, Share2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import type { TopicDetail } from '@/types/topics.types';

interface TopicDetailHeaderProps {
  topic: TopicDetail;
}

export function TopicDetailHeader({ topic }: TopicDetailHeaderProps) {
  const t = useTranslations('topic_detail');
  const [copied, setCopied] = useState(false);

  function handleShare() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Decorative amber rule */}
      <div className="w-12 h-0.5 bg-primary mb-6" />

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-widest text-muted-foreground border border-border/60 rounded px-2 py-1">
          <Globe className="size-3" />
          {topic.originalLanguage}
        </span>

        {topic.publishedAt && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            {format(new Date(topic.publishedAt), 'MMMM d, yyyy')}
          </span>
        )}

        {topic.tags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="text-xs">
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-5">
        {topic.title}
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-5">
        {topic.description}
      </p>

      {/* Share */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="gap-2 text-sm"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-emerald-500" />
            {t('share_copied')}
          </>
        ) : (
          <>
            <Share2 className="size-3.5" />
            {t('share_button')}
          </>
        )}
      </Button>
    </motion.div>
  );
}
