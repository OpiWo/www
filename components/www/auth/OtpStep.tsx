'use client';

import { useState, useRef, type KeyboardEvent, type ClipboardEvent } from 'react';
import { Loader2, ArrowLeft, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api/auth.api';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getApiErrorCode } from './PhoneStep';

interface OtpStepProps {
  contact: string;
  contactMethod: 'phone' | 'email';
  onLoginSuccess: () => void;
  onRegisterRequired: (token: string) => void;
  onBack: () => void;
}

const OTP_LENGTH = 6;

export function OtpStep({ contact, contactMethod, onLoginSuccess, onRegisterRequired, onBack }: OtpStepProps) {
  const t = useTranslations('auth');
  const { login } = useAuth();
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isPending, setIsPending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(OTP_LENGTH).fill(null));

  const otp = digits.join('');
  const isComplete = otp.length === OTP_LENGTH;

  function handleChange(index: number, value: string) {
    // Only accept single digits
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);

    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        // Clear current cell
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        // Move to previous cell
        inputRefs.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = '';
        setDigits(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    // Focus the last filled cell or the next empty one
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  async function handleVerify() {
    if (!isComplete || isPending) return;
    setIsPending(true);
    try {
      const res = await authApi.verifyOtp(contact, otp);
      if ('accessToken' in res) {
        await login(res.accessToken);
        router.replace('/');
      } else if ('registrationToken' in res) {
        onRegisterRequired(res.registrationToken);
      }
    } catch (err: unknown) {
      const code = getApiErrorCode(err);
      if (code === 'AUTH_OTP_INVALID') {
        toast.error(t('error_otp_invalid'));
      } else if (code === 'AUTH_INVALID_CONTACT') {
        toast.error(t('error_invalid_phone'));
      } else {
        toast.error(t('error_generic'));
      }
      // Clear digits on error
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsPending(false);
    }
  }

  async function handleResend() {
    setIsResending(true);
    try {
      await authApi.requestOtp(contact);
      toast.success(t('resend_success'));
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch {
      toast.error(t('error_generic'));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <p className="text-[0.65rem] font-medium tracking-[0.2em] uppercase text-primary mb-2">
        {t('step_otp')}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">{contactMethod === 'email' ? t('otp_title_email') : t('otp_title')}</h1>
      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{t('otp_subtitle')}</p>
      <p className="text-sm font-semibold text-foreground mb-8">{contact}</p>

      {/* OTP cells */}
      <div className="flex gap-2.5 mb-6" aria-label={t('otp_label')}>
        {Array.from({ length: OTP_LENGTH }, (_, i) => (
          <motion.input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            onFocus={(e) => e.target.select()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
            className={cn(
              'w-12 h-14 text-center text-xl font-bold font-mono rounded-xl border-2 bg-background',
              'transition-all duration-150 outline-none select-none',
              'focus:border-primary focus:ring-2 focus:ring-primary/20',
              digits[i]
                ? 'border-primary/60 text-foreground'
                : 'border-border text-muted-foreground',
              'dark:bg-card',
            )}
            aria-label={`Digit ${i + 1}`}
            disabled={isPending}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-6">{t('otp_hint')}</p>

      <Button
        onClick={handleVerify}
        disabled={!isComplete || isPending}
        className="w-full h-11 text-sm font-semibold mb-4"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t('verifying')}
          </>
        ) : (
          t('verify')
        )}
      </Button>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          {t('back')}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
        >
          {isResending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RotateCcw className="size-3.5" />
          )}
          {t('resend_code')}
        </button>
      </div>
    </motion.div>
  );
}
