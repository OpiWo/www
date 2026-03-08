'use client';

import { motion, useAnimate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Animated live poll bar
// ─────────────────────────────────────────────────────────────
interface PollBarProps {
  label: string;
  pct: number;
  color: string;
  textColor: string;
  delay: number;
}

function PollBar({ label, pct, color, textColor, delay }: PollBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium" style={{ color: 'oklch(0.72 0.015 261)' }}>
          {label}
        </span>
        <span className="text-[13px] font-bold" style={{ color: textColor }}>
          {pct}%
        </span>
      </div>
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ background: 'oklch(0.19 0.018 261)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Primary live poll widget
// ─────────────────────────────────────────────────────────────
function LivePollWidget() {
  const bars = [
    { label: 'Yes', pct: 68, color: 'oklch(0.769 0.18 67)', textColor: 'oklch(0.769 0.18 67)', delay: 0.9 },
    { label: 'No', pct: 31, color: 'oklch(0.5 0.12 261)', textColor: 'oklch(0.58 0.02 261)', delay: 1.0 },
    { label: 'N/A', pct: 1, color: 'oklch(0.35 0.02 261)', textColor: 'oklch(0.42 0.02 261)', delay: 1.1 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border shadow-2xl p-6 md:p-7"
      style={{
        background: 'oklch(0.12 0.018 261)',
        borderColor: 'oklch(0.22 0.018 261)',
        boxShadow: '0 24px 64px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0.769 0.18 67 / 0.06)',
      }}
    >
      {/* Widget header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-2">
          {/* Globe emoji substitute — amber dot grid */}
          <div
            className="size-8 rounded-lg flex items-center justify-center text-base select-none"
            style={{ background: 'oklch(0.769 0.18 67 / 0.12)', border: '1px solid oklch(0.769 0.18 67 / 0.2)' }}
            aria-hidden
          >
            🌍
          </div>
          {/* LIVE badge */}
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ background: 'oklch(0.769 0.18 67 / 0.12)', border: '1px solid oklch(0.769 0.18 67 / 0.25)' }}
          >
            <span className="relative flex size-1.5" aria-hidden>
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{
                  background: 'oklch(0.769 0.18 67)',
                  animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
                }}
              />
              <span
                className="relative inline-flex size-1.5 rounded-full"
                style={{ background: 'oklch(0.769 0.18 67)' }}
              />
            </span>
            <span
              className="text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: 'oklch(0.769 0.18 67)' }}
            >
              Live
            </span>
          </div>
        </div>
        <div
          className="text-[11px] font-medium"
          style={{ color: 'oklch(0.42 0.015 261)' }}
        >
          Global poll
        </div>
      </div>

      {/* Question */}
      <p
        className="text-[15px] font-semibold leading-snug mb-6"
        style={{ color: 'oklch(0.94 0.006 247)' }}
      >
        Should AI development be globally regulated?
      </p>

      {/* Bars */}
      <div className="space-y-3.5 mb-5">
        {bars.map((bar) => (
          <PollBar key={bar.label} {...bar} />
        ))}
      </div>

      {/* Footer */}
      <div
        className="pt-4 flex items-center justify-between"
        style={{ borderTop: '1px solid oklch(0.22 0.018 261)' }}
      >
        <span className="text-[12px] font-medium" style={{ color: 'oklch(0.46 0.015 261)' }}>
          2,847 opinions
        </span>
        <span className="text-[12px] font-medium" style={{ color: 'oklch(0.46 0.015 261)' }}>
          43 countries
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Second smaller widget (partially visible, tilted)
// ─────────────────────────────────────────────────────────────
function SecondaryPollWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 3 }}
      transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="absolute -bottom-6 -right-6 w-64 rounded-xl border p-4 shadow-xl"
      style={{
        background: 'oklch(0.14 0.018 261)',
        borderColor: 'oklch(0.24 0.018 261)',
        zIndex: -1,
        transform: 'rotate(3deg)',
      }}
      aria-hidden
    >
      <div className="text-[11px] font-medium mb-2" style={{ color: 'oklch(0.46 0.015 261)' }}>
        Should social media be age-restricted?
      </div>
      <div className="space-y-2">
        {[{ w: '54%', c: 'oklch(0.769 0.18 67)' }, { w: '33%', c: 'oklch(0.5 0.12 261)' }, { w: '13%', c: 'oklch(0.3 0.02 261)' }].map((b, i) => (
          <div key={i} className="h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.19 0.018 261)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: b.c }}
              initial={{ width: 0 }}
              animate={{ width: b.w }}
              transition={{ duration: 0.8, delay: 1.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px]" style={{ color: 'oklch(0.4 0.015 261)' }}>1,203 opinions · 28 countries</div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Social proof avatars
// ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: 'oklch(0.769 0.18 67 / 0.15)', border: 'oklch(0.769 0.18 67 / 0.4)', text: 'oklch(0.769 0.18 67)', letter: 'A' },
  { bg: 'oklch(0.5 0.12 261 / 0.15)', border: 'oklch(0.5 0.12 261 / 0.4)', text: 'oklch(0.72 0.12 261)', letter: 'S' },
  { bg: 'oklch(0.55 0.14 167 / 0.15)', border: 'oklch(0.55 0.14 167 / 0.4)', text: 'oklch(0.65 0.14 167)', letter: 'M' },
];

function SocialProof({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.62, ease: 'easeOut' }}
      className="flex items-center gap-3"
    >
      <div className="flex -space-x-2">
        {AVATAR_COLORS.map((av) => (
          <div
            key={av.letter}
            className="size-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 select-none"
            style={{ background: av.bg, borderColor: av.border, color: av.text, borderWidth: '2px' }}
            aria-hidden
          >
            {av.letter}
          </div>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {t('hero_social_proof')}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main HeroSection
// ─────────────────────────────────────────────────────────────
export function HeroSection() {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* ── Background: large amber glow centered right ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 80% 50%, oklch(0.769 0.18 67 / 0.11) 0%, transparent 65%)',
        }}
      />
      {/* ── Background: secondary cool glow left ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at -5% 50%, oklch(0.5 0.12 261 / 0.07) 0%, transparent 70%)',
        }}
      />
      {/* ── Dot grid texture ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(circle, oklch(0.13 0.02 261 / 0.45) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.5,
        }}
      />
      {/* ── Floating amber orb ── */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        aria-hidden
        style={{
          top: '-80px',
          right: '10%',
          width: 380,
          height: 380,
          background: 'radial-gradient(circle at 40% 40%, oklch(0.769 0.18 67 / 0.13), transparent 70%)',
          filter: 'blur(2px)',
        }}
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left column: text ── */}
          <div className="flex flex-col">
            {/* H1 — split across two lines */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.03]"
            >
              <span className="text-foreground">{t('hero_title_line1')}</span>
              <br />
              <span className="text-primary">{t('hero_title_line2')}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: 'easeOut' }}
              className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md"
            >
              {t('hero_subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.44, ease: 'easeOut' }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link href="/topics">
                <motion.span
                  whileHover="hover"
                  className="relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-primary px-8 h-12 text-[15px] font-semibold text-primary-foreground cursor-pointer select-none"
                  style={{ boxShadow: '0 4px 24px oklch(0.769 0.18 67 / 0.4)' }}
                >
                  {/* Shine sweep */}
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.15) 50%, transparent 60%)',
                      backgroundSize: '200% 100%',
                    }}
                    variants={{
                      hover: {
                        opacity: [0, 1, 0],
                        transition: { duration: 0.5, ease: 'easeInOut' },
                      },
                    }}
                    initial={{ opacity: 0 }}
                  />
                  <span className="relative z-10">{t('cta_explore')}</span>
                  <motion.span
                    className="relative z-10"
                    variants={{ hover: { x: 4 } }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="size-4" />
                  </motion.span>
                </motion.span>
              </Link>
              <Link href="/register">
                <span className="inline-flex items-center gap-1.5 h-12 px-6 text-[15px] font-medium text-foreground/70 hover:text-foreground border-b border-transparent hover:border-foreground/30 transition-all duration-200 cursor-pointer">
                  {t('cta_join')}
                </span>
              </Link>
            </motion.div>

            {/* Social proof */}
            <div className="mt-7">
              <SocialProof t={t} />
            </div>
          </div>

          {/* ── Right column: live poll widget ── */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <LivePollWidget />
              <SecondaryPollWidget />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
