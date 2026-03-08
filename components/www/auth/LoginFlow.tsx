'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PhoneStep } from './PhoneStep';
import { OtpStep } from './OtpStep';
import { RegisterStep } from './RegisterStep';
import { AuthSidePanel } from './AuthSidePanel';

export type AuthStep = 'phone' | 'otp' | 'register';

export function LoginFlow() {
  const [step, setStep] = useState<AuthStep>('phone');
  const [contact, setContact] = useState('');
  const [registrationToken, setRegistrationToken] = useState('');

  function goToOtp(phone: string) {
    setContact(phone);
    setStep('otp');
  }

  function goToRegister(token: string) {
    setRegistrationToken(token);
    setStep('register');
  }

  function goBackToPhone() {
    setStep('phone');
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col md:flex-row">
      {/* Side panel — hidden on mobile, visible on md+ */}
      <div className="hidden md:flex md:w-[42%] lg:w-[45%] shrink-0">
        <AuthSidePanel step={step} />
      </div>

      {/* Mobile top strip */}
      <div className="md:hidden w-full bg-foreground dark:bg-card px-6 py-8 flex flex-col items-center gap-3">
        <AuthSidePanelMobile step={step} />
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-16 bg-background">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <PhoneStep onSuccess={goToOtp} />
              </motion.div>
            )}
            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <OtpStep
                  contact={contact}
                  onLoginSuccess={() => {}}
                  onRegisterRequired={goToRegister}
                  onBack={goBackToPhone}
                />
              </motion.div>
            )}
            {step === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <RegisterStep registrationToken={registrationToken} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AuthSidePanelMobile({ step }: { step: AuthStep }) {
  const labels: Record<AuthStep, { eyebrow: string; title: string }> = {
    phone: { eyebrow: 'Step 1 of 2', title: 'Enter your phone' },
    otp: { eyebrow: 'Step 2 of 2', title: 'Verify your number' },
    register: { eyebrow: 'One last step', title: 'Create your profile' },
  };
  const { eyebrow, title } = labels[step];

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <OpiwoBadge />
      </div>
      <p className="text-[0.7rem] font-medium tracking-widest uppercase text-primary">{eyebrow}</p>
      <h2 className="text-xl font-bold text-background dark:text-foreground tracking-tight">
        {title}
      </h2>
    </>
  );
}

function OpiwoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
        <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
          <rect x="3" y="4" width="10" height="2" rx="1" fill="white" />
          <rect x="3" y="7" width="7" height="2" rx="1" fill="white" />
          <rect x="3" y="10" width="5" height="2" rx="1" fill="white" />
        </svg>
      </span>
      <span className="font-semibold text-background dark:text-foreground text-sm">
        <span>Opi</span>
        <span className="text-primary">Wo</span>
      </span>
    </span>
  );
}
