'use client';

import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { TopicFiltersBar } from './TopicFiltersBar';
import { useTags } from '@/hooks/useTags';
import { useOptionSets } from '@/hooks/useOptionSets';
import type { Tag } from '@/types/tags.types';
import type { OptionSet } from '@/types/option-sets.types';

interface TopicFiltersProps {
  initialTags: Tag[];
  initialOptionSets: OptionSet[];
}

export function TopicFilters({ initialTags, initialOptionSets }: TopicFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedTag = searchParams.get('tag') ?? 'all';
  const selectedOptionSet = searchParams.get('optionSet') ?? 'all';
  const selectedLanguage = searchParams.get('lang') ?? 'all';

  const isFiltered =
    selectedTag !== 'all' || selectedOptionSet !== 'all' || selectedLanguage !== 'all';

  // Hydrate from server, fall back to client-fetched
  const { data: tagsData } = useTags(selectedLanguage !== 'all' ? selectedLanguage : undefined);
  const { data: optionSetsData } = useOptionSets();

  const tags = tagsData?.tags ?? initialTags;
  const optionSets = optionSetsData?.optionSets ?? initialOptionSets;

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset to first page on filter change
      params.delete('cursor');
      const qs = params.toString();
      router.push((qs ? `${pathname}?${qs}` : pathname) as Parameters<typeof router.push>[0]);
    },
    [router, pathname, searchParams],
  );

  const handleReset = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return (
    <TopicFiltersBar
      tags={tags}
      optionSets={optionSets}
      selectedTag={selectedTag}
      selectedOptionSet={selectedOptionSet}
      selectedLanguage={selectedLanguage}
      onTagChange={(v) => updateParam('tag', v)}
      onOptionSetChange={(v) => updateParam('optionSet', v)}
      onLanguageChange={(v) => updateParam('lang', v)}
      onReset={handleReset}
      isFiltered={isFiltered}
    />
  );
}
