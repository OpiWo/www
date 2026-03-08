'use client';

import { useTranslations } from 'next-intl';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Tag } from '@/types/tags.types';
import type { OptionSet } from '@/types/option-sets.types';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
] as const;

interface TopicFiltersBarProps {
  tags: Tag[];
  optionSets: OptionSet[];
  selectedTag: string;
  selectedOptionSet: string;
  selectedLanguage: string;
  onTagChange: (value: string | null) => void;
  onOptionSetChange: (value: string | null) => void;
  onLanguageChange: (value: string | null) => void;
  onReset: () => void;
  isFiltered: boolean;
}

export function TopicFiltersBar({
  tags,
  optionSets,
  selectedTag,
  selectedOptionSet,
  selectedLanguage,
  onTagChange,
  onOptionSetChange,
  onLanguageChange,
  onReset,
  isFiltered,
}: TopicFiltersBarProps) {
  const t = useTranslations('topics');

  return (
    <div className="relative">
      {/* Filter bar container */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Filter icon + active indicator */}
        <div className="relative flex items-center gap-1.5 mr-1">
          <SlidersHorizontal className="size-3.5 text-muted-foreground" />
          <AnimatePresence>
            {isFiltered && (
              <motion.span
                key="pulse"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Tag filter */}
        <Select value={selectedTag} onValueChange={onTagChange}>
          <SelectTrigger
            className={[
              'h-8 text-xs px-3 rounded-full border transition-colors w-auto min-w-[120px]',
              selectedTag !== 'all'
                ? 'border-primary/60 bg-primary/5 text-foreground'
                : 'border-border bg-background text-muted-foreground',
            ].join(' ')}
          >
            <SelectValue placeholder={t('filter_all_tags')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filter_all_tags')}</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Option set (type) filter */}
        <Select value={selectedOptionSet} onValueChange={onOptionSetChange}>
          <SelectTrigger
            className={[
              'h-8 text-xs px-3 rounded-full border transition-colors w-auto min-w-[120px]',
              selectedOptionSet !== 'all'
                ? 'border-primary/60 bg-primary/5 text-foreground'
                : 'border-border bg-background text-muted-foreground',
            ].join(' ')}
          >
            <SelectValue placeholder={t('filter_all_option_sets')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filter_all_option_sets')}</SelectItem>
            {optionSets.map((os) => (
              <SelectItem key={os.id} value={os.id}>
                {os.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Language filter */}
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger
            className={[
              'h-8 text-xs px-3 rounded-full border transition-colors w-auto min-w-[130px]',
              selectedLanguage !== 'all'
                ? 'border-primary/60 bg-primary/5 text-foreground'
                : 'border-border bg-background text-muted-foreground',
            ].join(' ')}
          >
            <SelectValue placeholder={t('filter_all_languages')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filter_all_languages')}</SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset button — only when filters active */}
        <AnimatePresence>
          {isFiltered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: -4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: -4 }}
              transition={{ duration: 0.18 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 px-3 text-xs rounded-full text-muted-foreground hover:text-foreground gap-1"
              >
                <X className="size-3" />
                {t('filter_reset')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
