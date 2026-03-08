'use client';

import { motion } from 'framer-motion';
import type { AuthStep } from './LoginFlow';

interface AuthSidePanelProps {
  step: AuthStep;
}

const stepMeta: Record<AuthStep, { step: string; heading: string; sub: string }> = {
  phone: {
    step: '01 / 02',
    heading: 'Your voice,\nglobally heard.',
    sub: 'Join millions sharing opinions on topics that shape the world.',
  },
  otp: {
    step: '02 / 02',
    heading: 'Verify your\nnumber.',
    sub: 'We sent a 6-digit code to your phone. Check your SMS.',
  },
  register: {
    step: 'Almost there',
    heading: 'Create your\nprofile.',
    sub: 'A few details help us match you with opinions that matter to you.',
  },
};

// Animated bars — pure CSS/SVG motion
const BARS = [
  { label: 'Agree', pct: 68, color: '#f59e0b', delay: 0 },
  { label: 'Disagree', pct: 21, color: '#0ea5e9', delay: 0.08 },
  { label: 'Neutral', pct: 11, color: '#10b981', delay: 0.16 },
];

export function AuthSidePanel({ step }: AuthSidePanelProps) {
  const meta = stepMeta[step];

  return (
    <div className="relative w-full h-full bg-foreground dark:bg-card flex flex-col justify-between p-10 lg:p-14 overflow-hidden">
      {/* Background texture — subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Amber ambient glow */}
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

      {/* Central visual — animated opinion bars */}
      <div className="relative z-10 flex flex-col gap-4 my-auto">
        <AnimatedBars />
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

        {/* Step dots */}
        <div className="flex gap-2 mt-8">
          {(['phone', 'otp', 'register'] as AuthStep[]).map((s, i) => (
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

function AnimatedBars() {
  return (
    <div className="space-y-3 w-full max-w-xs">
      <p className="text-[0.65rem] font-medium tracking-widest uppercase text-background/40 dark:text-muted-foreground mb-4">
        Live opinion sample
      </p>
      {BARS.map((bar) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-background/70 dark:text-muted-foreground">
              {bar.label}
            </span>
            <span className="text-xs font-semibold" style={{ color: bar.color }}>
              {bar.pct}%
            </span>
          </div>
          <div className="h-2 bg-background/10 dark:bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: bar.color }}
              initial={{ width: 0 }}
              animate={{ width: `${bar.pct}%` }}
              transition={{
                duration: 1.2,
                delay: bar.delay,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />
          </div>
        </div>
      ))}

      {/* Floating stat */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-5 inline-flex items-center gap-2 bg-primary/15 border border-primary/25 rounded-xl px-3 py-2"
      >
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-medium text-background/80 dark:text-foreground">
          2.4M opinions collected today
        </span>
      </motion.div>
    </div>
  );
}
