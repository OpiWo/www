'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  phone: z
    .string()
    .min(7, 'Phone number is too short')
    .regex(/^\+?[1-9]\d{6,14}$/, 'Enter a valid international phone number (e.g. +34612345678)'),
});

type FormData = z.infer<typeof schema>;

interface PhoneStepProps {
  onSuccess: (phone: string) => void;
}

export function PhoneStep({ onSuccess }: PhoneStepProps) {
  const t = useTranslations('auth');
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setIsPending(true);
    try {
      await authApi.requestOtp(data.phone);
      onSuccess(data.phone);
    } catch (err: unknown) {
      const code = getApiErrorCode(err);
      if (code === 'AUTH_INVALID_CONTACT') {
        toast.error(t('error_invalid_phone'));
      } else if (code === 'AUTH_TOO_MANY_REQUESTS') {
        toast.error(t('error_too_many_requests'));
      } else if (code === 'AUTH_OTP_DELIVERY_FAILED') {
        toast.error(t('error_otp_delivery_failed'));
      } else {
        toast.error(t('error_generic'));
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Eyebrow */}
      <p className="text-[0.65rem] font-mono tracking-[0.2em] uppercase text-primary mb-2">
        {t('step_phone')}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">{t('phone_title')}</h1>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{t('phone_subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            {t('phone_label')}
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              autoFocus
              placeholder={t('phone_placeholder')}
              className="pl-9 h-11 text-base"
              aria-invalid={!!errors.phone}
              {...register('phone')}
            />
          </div>
          {errors.phone && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-destructive mt-1"
            >
              {errors.phone.message}
            </motion.p>
          )}
          <p className="text-xs text-muted-foreground">{t('phone_hint')}</p>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 text-sm font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t('sending_code')}
            </>
          ) : (
            t('send_code')
          )}
        </Button>
      </form>
    </motion.div>
  );
}

function getApiErrorCode(err: unknown): string | null {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response &&
    err.response.data &&
    typeof err.response.data === 'object' &&
    'code' in err.response.data
  ) {
    return String((err.response.data as { code: string }).code);
  }
  return null;
}

export { getApiErrorCode };
