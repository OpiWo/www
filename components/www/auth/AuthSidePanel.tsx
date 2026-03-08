'use client';

import { motion } from 'framer-motion';
import type { AuthStep } from './LoginFlow';

interface AuthSidePanelProps {
  step: AuthStep;
}

const stepMeta: Record<AuthStep, { step: string; heading: string; sub: string }> = {
  contact: {
    step: 'Welcome',
    heading: 'Your voice,\nglobally heard.',
    sub: 'Join millions sharing opinions on topics that shape the world.',
  },
  otp: {
    step: 'Almost there',
    heading: 'Almost\nthere.',
    sub: 'Enter the code we sent you to verify your identity.',
  },
  register: {
    step: 'One last step',
    heading: 'One last\nstep.',
    sub: 'A few details help us match you with opinions that matter to you.',
  },
};

const BARS = [
  { label: 'Agree', pct: 68, color: 'oklch(0.769 0.18 67)', delay: 0.3 },
  { label: 'Disagree', pct: 21, color: 'oklch(0.5 0.12 261)', delay: 0.42 },
  { label: 'Neutral', pct: 11, color: 'oklch(0.55 0.14 167)', delay: 0.54 },
];

export function AuthSidePanel({ step }: AuthSidePanelProps) {
  const meta = stepMeta[step];

  return (
    <div className="relative w-full h-full bg-foreground dark:bg-card flex flex-col justify-between p-10 lg:p-14 overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Amber glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10">
        <span className="inline-flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <rect x="4" y="5" width="12" height="2.5" rx="1.25" fill="white" />
              <rect x="4" y="8.75" width="8.5" height="2.5" rx="1.25" fill="white" />
              <rect x="4" y="12.5" width="6" height="2.5" rx="1.25" fill="white" />
            </svg>
          </span>
          <span className="font-bold text-xl tracking-tight text-background dark:text-foreground">
            Opi<span className="text-primary">Wo</span>
          </span>
        </span>
      </div>

      {/* Mock poll card — central visual */}
      <div className="relative z-10 my-auto">
        <MockPollCard />
      </div>

      {/* Step content */}
      <div className="relative z-10">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-[0.65rem] font-medium tracking-[0.2em] uppercase text-primary mb-4">
            {meta.step}
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-background dark:text-foreground whitespace-pre-line mb-3">
            {meta.heading}
          </h2>
          <p className="text-sm text-background/60 dark:text-muted-foreground leading-relaxed max-w-xs">
            {meta.sub}
          </p>
        </motion.div>

        {/* Step progress dots */}
        <div className="flex gap-2 mt-8">
          {(['contact', 'otp', 'register'] as AuthStep[]).map((s) => (
            <motion.div
              key={s}
              animate={{
                width: step === s ? 24 : 6,
                opacity: step === s ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MockPollCard() {
  return (
    <div
      className="w-full max-w-xs rounded-2xl p-5"
      style={{
        background: 'oklch(0.12 0.018 261 / 0.6)',
        border: '1px solid oklch(1 0 0 / 0.08)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 20px 60px oklch(0 0 0 / 0.4)',
      }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="size-7 rounded-lg flex items-center justify-center text-sm select-none"
            style={{ background: 'oklch(0.769 0.18 67 / 0.15)', border: '1px solid oklch(0.769 0.18 67 / 0.25)' }}
            aria-hidden
          >
            🌍
          </div>
          <span className="text-[11px] font-medium" style={{ color: 'oklch(1 0 0 / 0.35)' }}>
            Global poll
          </span>
        </div>
        {/* LIVE badge */}
        <div
          className="flex items-center gap-1.5 rounded-full px-2 py-1"
          style={{ background: 'oklch(0.769 0.18 67 / 0.12)', border: '1px solid oklch(0.769 0.18 67 / 0.25)' }}
        >
          <span className="relative flex size-1.5" aria-hidden>
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: 'oklch(0.769 0.18 67)', animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }}
            />
            <span className="relative inline-flex size-1.5 rounded-full" style={{ background: 'oklch(0.769 0.18 67)' }} />
          </span>
          <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'oklch(0.769 0.18 67)' }}>
            Live
          </span>
        </div>
      </div>

      {/* Question */}
      <p className="text-[13px] font-semibold leading-snug mb-5" style={{ color: 'oklch(1 0 0 / 0.85)' }}>
        &quot;Should AI development be globally regulated?&quot;
      </p>

      {/* Bars */}
      <div className="space-y-3">
        {BARS.map((bar) => (
          <div key={bar.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px]" style={{ color: 'oklch(1 0 0 / 0.55)' }}>{bar.label}</span>
              <span className="text-[12px] font-bold" style={{ color: bar.color }}>{bar.pct}%</span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'oklch(1 0 0 / 0.07)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: bar.color }}
                initial={{ width: 0 }}
                animate={{ width: `${bar.pct}%` }}
                transition={{ duration: 1.2, delay: bar.delay, ease: [0.34, 1.56, 0.64, 1] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="mt-4 pt-3 flex items-center justify-between"
        style={{ borderTop: '1px solid oklch(1 0 0 / 0.07)' }}
      >
        <span className="text-[11px]" style={{ color: 'oklch(1 0 0 / 0.3)' }}>2,847 responses</span>
        <span className="text-[11px]" style={{ color: 'oklch(1 0 0 / 0.3)' }}>43 countries</span>
      </div>
    </div>
  );
}
