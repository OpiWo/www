'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Search, CheckSquare, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  number: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  delay: number;
}

const STEPS: Step[] = [
  {
    number: '01',
    icon: Search,
    titleKey: 'how_step1_title',
    descKey: 'how_step1_desc',
    delay: 0.1,
  },
  {
    number: '02',
    icon: CheckSquare,
    titleKey: 'how_step2_title',
    descKey: 'how_step2_desc',
    delay: 0.2,
  },
  {
    number: '03',
    icon: BarChart3,
    titleKey: 'how_step3_title',
    descKey: 'how_step3_desc',
    delay: 0.3,
  },
];

function StepCard({ step, t }: { step: Step; t: ReturnType<typeof useTranslations> }) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: step.delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col"
    >
      {/* Decorative big number — background element */}
      <div
        className="absolute -top-4 -left-1 text-8xl font-bold leading-none select-none pointer-events-none"
        style={{ color: 'oklch(0.769 0.18 67 / 0.08)', letterSpacing: '-0.05em' }}
        aria-hidden
      >
        {step.number}
      </div>

      {/* Content */}
      <div className="relative pt-8">
        {/* Icon container */}
        <div
          className="inline-flex size-12 items-center justify-center rounded-xl mb-5 border"
          style={{
            background: 'oklch(0.769 0.18 67 / 0.08)',
            borderColor: 'oklch(0.769 0.18 67 / 0.2)',
          }}
        >
          <Icon className="size-5 text-primary" strokeWidth={2} />
        </div>

        {/* Step label */}
        <p className="text-[11px] font-semibold tracking-widest uppercase text-primary mb-2">
          {t('how_step_label', { n: step.number })}
        </p>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-3">
          {t(step.titleKey)}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t(step.descKey)}
        </p>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const t = useTranslations('home');

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Subtle top gradient fade from the dark stats section */}
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-32"
        aria-hidden
        style={{
          background: 'linear-gradient(to bottom, oklch(0.098 0.018 261 / 0.03), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-16"
        >
          <p className="text-[11px] font-semibold tracking-widest uppercase text-primary mb-3">
            {t('how_eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t('how_title')}
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {STEPS.map((step) => (
            <StepCard key={step.number} step={step} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
