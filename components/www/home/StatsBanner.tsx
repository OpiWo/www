'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// Animated counter hook
// ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);

  return count;
}

// ─────────────────────────────────────────────────────────────
// Individual stat item with animated counter
// ─────────────────────────────────────────────────────────────
interface StatItemProps {
  rawValue: number;
  suffix: string;
  label: string;
  delay: number;
  active: boolean;
}

function StatItem({ rawValue, suffix, label, delay, active }: StatItemProps) {
  const count = useCountUp(rawValue, 1.6, active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-2 px-8 py-4"
    >
      <span
        className="text-4xl md:text-5xl font-bold tracking-tighter leading-none"
        style={{ color: 'oklch(0.769 0.18 67)' }}
      >
        {count.toLocaleString()}{suffix}
      </span>
      <span
        className="text-sm font-medium tracking-wide uppercase text-center"
        style={{ color: 'oklch(0.46 0.015 261)' }}
      >
        {label}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Separator
// ─────────────────────────────────────────────────────────────
function Separator() {
  return (
    <div
      className="hidden sm:block w-px self-stretch my-4"
      style={{ background: 'oklch(0.26 0.018 261)' }}
      aria-hidden
    />
  );
}

// ─────────────────────────────────────────────────────────────
// StatsBanner
// ─────────────────────────────────────────────────────────────
export function StatsBanner() {
  const t = useTranslations('home');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const stats: StatItemProps[] = [
    { rawValue: 5200, suffix: '+', label: t('stats_users'), delay: 0.1, active: isInView },
    { rawValue: 340, suffix: '+', label: t('stats_topics'), delay: 0.2, active: isInView },
    { rawValue: 28000, suffix: '+', label: t('stats_opinions'), delay: 0.3, active: isInView },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: 'oklch(0.098 0.018 261)' }}
    >
      {/* Subtle amber glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 100%, oklch(0.769 0.18 67 / 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <p
            className="text-[11px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: 'oklch(0.769 0.18 67 / 0.7)' }}
          >
            {t('stats_eyebrow')}
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ color: 'oklch(0.94 0.006 247)' }}
          >
            {t('stats_heading')}
          </h2>
        </motion.div>

        {/* Stats row */}
        <div className="flex flex-col sm:flex-row items-center justify-center">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex flex-col sm:flex-row items-center">
              <StatItem {...stat} />
              {i < stats.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
