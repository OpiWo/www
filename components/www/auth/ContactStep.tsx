'use client';

import { useState, useRef, useMemo, type ReactNode } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, ChevronDown, Search, Phone, Mail } from 'lucide-react';
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
import { getApiErrorCode } from './PhoneStep';

type ContactMethod = 'phone' | 'email';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isoToFlagUrl(iso: string): string {
  const codepoints = [...iso.toUpperCase()].map((c) =>
    (0x1f1e6 + c.charCodeAt(0) - 65).toString(16),
  );
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codepoints.join('-')}.svg`;
}

function CountryFlag({ iso2, size = 18 }: { iso2: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={isoToFlagUrl(iso2)}
      alt={iso2.toUpperCase()}
      width={size}
      height={size}
      style={{ display: 'inline-block', objectFit: 'contain' }}
      loading="lazy"
    />
  );
}

const parsedCountries = defaultCountries.map(parseCountry);

// ─── Country Dropdown ──────────────────────────────────────────────────────────

interface CountryDropdownProps {
  selectedIso2: CountryIso2;
  onSelect: (iso2: CountryIso2) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CountryDropdown({ selectedIso2, onSelect, open, onOpenChange }: CountryDropdownProps) {
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
    setSearch('');
    onOpenChange(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  function handleSelect(iso2: CountryIso2) {
    onSelect(iso2);
    onOpenChange(false);
  }

  return (
    <div className="relative shrink-0">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-full items-center gap-1.5 px-3 rounded-l-xl focus:outline-none"
      >
        <span style={{ lineHeight: 1 }}>
          {selected ? <CountryFlag iso2={selected.iso2} /> : '🌐'}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          +{selected?.dialCode ?? ''}
        </span>
        <ChevronDown
          className="size-3 text-muted-foreground transition-transform shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>

      {/* Vertical divider */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-5 bg-border" />

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => onOpenChange(false)}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute left-0 top-full z-50 mt-1.5 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
                <Search className="size-3.5 shrink-0 text-muted-foreground" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country or dial code…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
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
                      <span style={{ lineHeight: 1 }}>
                        <CountryFlag iso2={country.iso2} />
                      </span>
                      <span className="flex-1 truncate text-foreground">{country.name}</span>
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

// ─── Unified Phone Input ────────────────────────────────────────────────────────

interface PhoneFieldProps {
  value: string;
  onChange: (e164: string) => void;
  error?: string;
  placeholder: string;
}

function PhoneField({ value, onChange, error, placeholder }: PhoneFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerActive = inputFocused || dropdownOpen;

  const { phone, inputValue, country, setCountry, handlePhoneValueChange } =
    usePhoneInput({
      defaultCountry: 'us',
      value,
      charAfterDialCode: '',
      onChange: ({ phone: e164 }) => onChange(e164),
      inputRef,
    });

  void phone;

  return (
    <div>
      <div
        className="flex items-center h-12 rounded-xl border bg-background transition-all duration-150"
        style={{
          borderColor: error
            ? 'oklch(0.577 0.245 27)'
            : containerActive
              ? 'oklch(0.769 0.18 67 / 0.6)'
              : 'var(--border)',
          boxShadow: containerActive
            ? '0 0 0 3px oklch(0.769 0.18 67 / 0.12)'
            : error
              ? '0 0 0 3px oklch(0.577 0.245 27 / 0.15)'
              : 'none',
        }}
      >
        <CountryDropdown
          selectedIso2={country.iso2 as CountryIso2}
          onSelect={(iso2) => setCountry(iso2, { focusOnInput: true })}
          open={dropdownOpen}
          onOpenChange={setDropdownOpen}
        />
        <input
          ref={inputRef}
          type="tel"
          autoComplete="tel"
          autoFocus
          value={inputValue}
          onChange={handlePhoneValueChange}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder={placeholder}
          aria-invalid={!!error}
          className="flex-1 h-full bg-transparent pl-3 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Email Input ───────────────────────────────────────────────────────────────

interface EmailFieldProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder: string;
}

function EmailField({ value, onChange, error, placeholder }: EmailFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div
        className="flex items-center h-12 rounded-xl border bg-background transition-all duration-150"
        style={{
          borderColor: error
            ? 'oklch(0.577 0.245 27)'
            : focused
              ? 'oklch(0.769 0.18 67 / 0.6)'
              : 'var(--border)',
          boxShadow: focused
            ? '0 0 0 3px oklch(0.769 0.18 67 / 0.12)'
            : error
              ? '0 0 0 3px oklch(0.577 0.245 27 / 0.15)'
              : 'none',
        }}
      >
        <Mail className="size-4 text-muted-foreground ml-3 mr-3 shrink-0" />
        <input
          type="email"
          autoComplete="email"
          inputMode="email"
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          aria-invalid={!!error}
          className="flex-1 h-full bg-transparent pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ContactStep ───────────────────────────────────────────────────────────────

interface ContactStepProps {
  onSuccess: (contact: string, method: ContactMethod) => void;
}

export function ContactStep({ onSuccess }: ContactStepProps) {
  const t = useTranslations('auth');
  const [method, setMethod] = useState<ContactMethod>('phone');
  const [isPending, setIsPending] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<{ contact: string }>({
    defaultValues: { contact: '' },
  });

  function switchMethod(m: ContactMethod) {
    setMethod(m);
    reset({ contact: '' });
  }

  async function onSubmit({ contact }: { contact: string }) {
    // Validate based on active method
    if (method === 'phone') {
      if (!/^\+[1-9]\d{6,14}$/.test(contact)) {
        setError('contact', { message: t('error_invalid_phone') });
        return;
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
        setError('contact', { message: t('error_invalid_email') });
        return;
      }
    }

    setIsPending(true);
    try {
      await authApi.requestOtp(contact, method === 'phone' ? 'sms' : 'email');
      onSuccess(contact, method);
    } catch (err: unknown) {
      const code = getApiErrorCode(err);
      if (code === 'AUTH_INVALID_CONTACT') {
        setError('contact', {
          message: method === 'phone' ? t('error_invalid_phone') : t('error_invalid_email'),
        });
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

  const tabs: { method: ContactMethod; icon: ReactNode; label: string }[] = [
    { method: 'phone', icon: <Phone className="size-3.5" />, label: t('tab_phone') },
    { method: 'email', icon: <Mail className="size-3.5" />, label: t('tab_email') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <p className="text-[0.65rem] font-medium tracking-[0.2em] uppercase text-primary mb-2">
        {t('step_contact')}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
        {t('contact_title')}
      </h1>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-sm">
        {t('contact_subtitle')}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Tab switcher */}
        <div className="relative flex rounded-lg border border-border bg-muted p-1 gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.method}
              type="button"
              onClick={() => switchMethod(tab.method)}
              className="relative flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors duration-150 z-10 rounded-md"
              style={{
                color: method === tab.method ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              {method === tab.method && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-md bg-card shadow-sm border border-border/60"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Input field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {method === 'phone' ? t('phone_label') : t('email_label')}
          </Label>
          <AnimatePresence mode="wait">
            {method === 'phone' ? (
              <motion.div
                key="phone-field"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                <Controller
                  name="contact"
                  control={control}
                  render={({ field }) => (
                    <PhoneField
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.contact?.message}
                      placeholder={t('phone_placeholder')}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1.5">{t('phone_hint')}</p>
              </motion.div>
            ) : (
              <motion.div
                key="email-field"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                <Controller
                  name="contact"
                  control={control}
                  render={({ field }) => (
                    <EmailField
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.contact?.message}
                      placeholder={t('email_placeholder')}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1.5">{t('email_hint')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 text-sm font-semibold transition-shadow duration-200 hover:shadow-[0_4px_20px_oklch(0.769_0.18_67_/_0.3)]"
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
