'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ChevronDown, ChevronUp, User } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/lib/api/auth.api';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getApiErrorCode } from './PhoneStep';

const currentYear = new Date().getFullYear();

const schema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be 50 characters or fewer'),
  birthYear: z
    .string()
    .optional()
    .refine(
      (v) => {
        if (!v) return true;
        const n = parseInt(v, 10);
        return !isNaN(n) && n >= 1900 && n <= currentYear - 18;
      },
      { message: 'Please enter a valid birth year' },
    ),
  gender: z.enum(['male', 'female', 'non_binary', 'prefer_not_to_say', '']).optional(),
  country: z.string().max(2).optional(),
});

type FormData = z.infer<typeof schema>;

interface RegisterStepProps {
  registrationToken: string;
}

export function RegisterStep({ registrationToken }: RegisterStepProps) {
  const t = useTranslations('auth');
  const { login } = useAuth();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setIsPending(true);
    try {
      const res = await authApi.completeRegistration({
        registrationToken,
        displayName: data.displayName,
        birthYear: data.birthYear ? parseInt(data.birthYear, 10) : null,
        gender: data.gender || null,
        country: data.country ? data.country.toUpperCase() : null,
      });
      await login(res.accessToken);
      toast.success(t('register_success'));
      router.replace('/');
    } catch (err: unknown) {
      const code = getApiErrorCode(err);
      switch (code) {
        case 'AUTH_REGISTRATION_TOKEN_INVALID':
          toast.error(t('error_token_invalid'));
          break;
        case 'AUTH_DISPLAY_NAME_INVALID':
          setError('displayName', { message: t('error_display_name_invalid') });
          break;
        case 'AUTH_DISPLAY_NAME_TAKEN':
          setError('displayName', { message: t('error_display_name_taken') });
          break;
        case 'AUTH_DISPLAY_NAME_BLOCKED':
          setError('displayName', { message: t('error_display_name_blocked') });
          break;
        case 'AUTH_BIRTH_YEAR_INVALID':
          setError('birthYear', { message: t('error_birth_year_invalid') });
          break;
        case 'AUTH_GENDER_INVALID':
          setError('gender', { message: t('error_gender_invalid') });
          break;
        case 'AUTH_COUNTRY_INVALID':
          setError('country', { message: t('error_country_invalid') });
          break;
        default:
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
      <p className="text-[0.65rem] font-medium tracking-[0.2em] uppercase text-primary mb-2">
        {t('step_register')}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
        {t('register_title')}
      </h1>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{t('register_subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Display name */}
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-sm font-medium">
            {t('display_name_label')}
            <span className="text-destructive ml-0.5">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="displayName"
              type="text"
              autoComplete="nickname"
              autoFocus
              placeholder={t('display_name_placeholder')}
              className="pl-9 h-11 text-base"
              aria-invalid={!!errors.displayName}
              {...register('displayName')}
            />
          </div>
          {errors.displayName && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-destructive"
            >
              {errors.displayName.message}
            </motion.p>
          )}
          <p className="text-xs text-muted-foreground">{t('display_name_hint')}</p>
        </div>

        {/* Demographics toggle */}
        <button
          type="button"
          onClick={() => setShowDemographics((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full py-1"
        >
          {showDemographics ? (
            <ChevronUp className="size-4 text-primary" />
          ) : (
            <ChevronDown className="size-4 text-primary" />
          )}
          {t('demographics_toggle')}
        </button>

        <AnimatePresence>
          {showDemographics && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pb-1">
                {/* Birth year */}
                <div className="space-y-2">
                  <Label htmlFor="birthYear" className="text-sm font-medium">
                    {t('birth_year_label')}
                  </Label>
                  <Input
                    id="birthYear"
                    type="number"
                    min={1900}
                    max={new Date().getFullYear() - 18}
                    placeholder={t('birth_year_placeholder')}
                    className="h-11"
                    aria-invalid={!!errors.birthYear}
                    {...register('birthYear')}
                  />
                  {errors.birthYear && (
                    <p className="text-xs text-destructive">{errors.birthYear.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">
                    {t('gender_label')}
                  </Label>
                  <select
                    id="gender"
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring dark:bg-card"
                    aria-invalid={!!errors.gender}
                    {...register('gender')}
                  >
                    <option value="">{t('gender_placeholder')}</option>
                    <option value="male">{t('gender_male')}</option>
                    <option value="female">{t('gender_female')}</option>
                    <option value="non_binary">{t('gender_non_binary')}</option>
                    <option value="prefer_not_to_say">{t('gender_prefer_not_to_say')}</option>
                  </select>
                  {errors.gender && (
                    <p className="text-xs text-destructive">{errors.gender.message}</p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">
                    {t('country_label')}
                  </Label>
                  <Input
                    id="country"
                    type="text"
                    maxLength={2}
                    placeholder={t('country_placeholder')}
                    className="h-11 uppercase"
                    aria-invalid={!!errors.country}
                    {...register('country')}
                  />
                  {errors.country && (
                    <p className="text-xs text-destructive">{errors.country.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{t('country_hint')}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 text-sm font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t('creating_account')}
            </>
          ) : (
            t('create_account')
          )}
        </Button>
      </form>
    </motion.div>
  );
}
