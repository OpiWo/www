'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const STEPS = [
  { n: '01', titleKey: 'how_step1_title', descKey: 'how_step1_desc', delay: 0.1 },
  { n: '02', titleKey: 'how_step2_title', descKey: 'how_step2_desc', delay: 0.2 },
  { n: '03', titleKey: 'how_step3_title', descKey: 'how_step3_desc', delay: 0.3 },
];

export function HowItWorks() {
  const t = useTranslations('home');

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t('how_title')}
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: step.delay, ease: [0.22, 1, 0.36, 1] }}
              className="relative md:pr-12 pb-12 md:pb-0"
            >
              {/* Connector line — between steps on desktop */}
              {idx < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-5 left-[calc(3.5rem+1rem)] right-0 h-px"
                  style={{ background: 'linear-gradient(to right, oklch(0.769 0.18 67 / 0.3), oklch(0.88 0.006 247 / 0))'}}
                  aria-hidden
                />
              )}

              {/* Number */}
              <div
                className="text-5xl font-bold tabular-nums mb-6 leading-none"
                style={{ color: 'oklch(0.769 0.18 67)' }}
              >
                {step.n}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-3">
                {t(step.titleKey)}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {t(step.descKey)}
              </p>

              {/* Connector line — between steps on mobile (vertical) */}
              {idx < STEPS.length - 1 && (
                <div
                  className="md:hidden absolute bottom-0 left-6 w-px h-8"
                  style={{ background: 'linear-gradient(to bottom, oklch(0.769 0.18 67 / 0.3), transparent)' }}
                  aria-hidden
                />
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
