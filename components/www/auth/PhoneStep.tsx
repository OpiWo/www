'use client';

import { useState, useRef, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ChevronDown, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  usePhoneInput,
  defaultCountries,
  parseCountry,
  type CountryIso2,
} from 'react-international-phone';
import { authApi } from '@/lib/api/auth.api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Twemoji CDN image URL for a country flag — works on all platforms (no emoji font required). */
function isoToFlagUrl(iso: string): string {
  const codepoints = [...iso.toUpperCase()].map((c) =>
    (0x1f1e6 + c.charCodeAt(0) - 65).toString(16),
  );
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codepoints.join('-')}.svg`;
}

function CountryFlag({ iso2, size = 20 }: { iso2: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={isoToFlagUrl(iso2)}
      alt={iso2.toUpperCase()}
      width={size}
      height={size}
      style={{ display: 'inline-block', objectFit: 'contain', verticalAlign: 'middle' }}
      loading="lazy"
    />
  );
}

const parsedCountries = defaultCountries.map(parseCountry);

// ─── Country Dropdown ──────────────────────────────────────────────────────────

interface CountryDropdownProps {
  selectedIso2: CountryIso2;
  onSelect: (iso2: CountryIso2) => void;
}

function CountryDropdown({ selectedIso2, onSelect }: CountryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = parsedCountries.find((c) => c.iso2 === selectedIso2);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().replace(/^\+/, '');
    if (!q) return parsedCountries;
    return parsedCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.iso2.includes(q),
    );
  }, [search]);

  function handleOpen() {
    setOpen(true);
    setSearch('');
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  function handleSelect(iso2: CountryIso2) {
    onSelect(iso2);
    setOpen(false);
  }

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-11 items-center gap-1.5 rounded-l-md border border-r-0 border-input bg-muted/40 px-3 text-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        style={{ minWidth: '72px' }}
      >
        <span aria-hidden style={{ lineHeight: 1 }}>
          {selected ? <CountryFlag iso2={selected.iso2} size={18} /> : '🌐'}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          +{selected?.dialCode ?? ''}
        </span>
        <ChevronDown
          className="size-3 text-muted-foreground transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute left-0 top-full z-50 mt-1.5 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            >
              {/* Search */}
              <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
                <Search className="size-3.5 shrink-0 text-muted-foreground" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country or code…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              {/* Country list */}
              <ul
                role="listbox"
                className="max-h-56 overflow-y-auto py-1"
              >
                {filtered.length === 0 ? (
                  <li className="px-3 py-4 text-center text-xs text-muted-foreground">
                    No countries found
                  </li>
                ) : (
                  filtered.map((country) => (
                    <li
                      key={country.iso2}
                      role="option"
                      aria-selected={country.iso2 === selectedIso2}
                      onClick={() => handleSelect(country.iso2)}
                      className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted/60"
                      style={
                        country.iso2 === selectedIso2
                          ? { background: 'oklch(0.769 0.18 67 / 0.08)' }
                          : undefined
                      }
                    >
                      <span aria-hidden style={{ lineHeight: 1 }}>
                        <CountryFlag iso2={country.iso2} size={18} />
                      </span>
                      <span className="flex-1 truncate text-foreground">
                        {country.name}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                        +{country.dialCode}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Phone field (compound input) ─────────────────────────────────────────────

interface PhoneFieldProps {
  value: string;
  onChange: (e164: string) => void;
  error?: string;
  placeholder: string;
}

function PhoneField({ value, onChange, error, placeholder }: PhoneFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { phone, inputValue, country, setCountry, handlePhoneValueChange } =
    usePhoneInput({
      defaultCountry: 'us',
      value,
      onChange: ({ phone: e164 }) => onChange(e164),
      inputRef,
    });

  void phone; // consumed via onChange

  return (
    <div>
      <div
        className="flex rounded-md transition-shadow"
        style={
          error
            ? { boxShadow: '0 0 0 2px oklch(0.577 0.245 27 / 0.5)' }
            : undefined
        }
      >
        <CountryDropdown
          selectedIso2={country.iso2 as CountryIso2}
          onSelect={(iso2) => setCountry(iso2, { focusOnInput: true })}
        />
        <input
          ref={inputRef}
          type="tel"
          autoComplete="tel"
          autoFocus
          value={inputValue}
          onChange={handlePhoneValueChange}
          placeholder={placeholder}
          aria-invalid={!!error}
          className="h-11 flex-1 rounded-r-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  phone: z
    .string()
    .min(7, 'Phone number is too short')
    .regex(/^\+[1-9]\d{6,14}$/, 'Enter a valid international phone number'),
});

type FormData = z.infer<typeof schema>;

// ─── PhoneStep ────────────────────────────────────────────────────────────────

interface PhoneStepProps {
  onSuccess: (phone: string) => void;
}

export function PhoneStep({ onSuccess }: PhoneStepProps) {
  const t = useTranslations('auth');
  const [isPending, setIsPending] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '' },
  });

  async function onSubmit(data: FormData) {
    setIsPending(true);
    try {
      await authApi.requestOtp(data.phone, 'sms');
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
      <p className="text-[0.65rem] font-medium tracking-[0.2em] uppercase text-primary mb-2">
        {t('step_phone')}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
        {t('phone_title')}
      </h1>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        {t('phone_subtitle')}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            {t('phone_label')}
          </Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneField
                value={field.value}
                onChange={field.onChange}
                error={errors.phone?.message}
                placeholder={t('phone_placeholder')}
              />
            )}
          />
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

// ─── Util ─────────────────────────────────────────────────────────────────────

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
