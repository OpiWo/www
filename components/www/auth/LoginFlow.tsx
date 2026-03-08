'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ContactStep } from './ContactStep';
import { OtpStep } from './OtpStep';
import { RegisterStep } from './RegisterStep';
import { AuthSidePanel } from './AuthSidePanel';

export type AuthStep = 'contact' | 'otp' | 'register';
export type ContactMethod = 'phone' | 'email';

export function LoginFlow() {
  const [step, setStep] = useState<AuthStep>('contact');
  const [contact, setContact] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phone');
  const [registrationToken, setRegistrationToken] = useState('');

  function goToOtp(c: string, method: ContactMethod) {
    setContact(c);
    setContactMethod(method);
    setStep('otp');
  }

  function goToRegister(token: string) {
    setRegistrationToken(token);
    setStep('register');
  }

  function goBackToContact() {
    setStep('contact');
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
          {/* Desktop wordmark */}
          <div className="hidden md:flex items-center gap-2 mb-10">
            <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/30">
              <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
                <rect x="4" y="5" width="12" height="2.5" rx="1.25" fill="white" />
                <rect x="4" y="8.75" width="8.5" height="2.5" rx="1.25" fill="white" />
                <rect x="4" y="12.5" width="6" height="2.5" rx="1.25" fill="white" />
              </svg>
            </span>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Opi<span className="text-primary">Wo</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            {step === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <ContactStep onSuccess={goToOtp} />
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
                  contactMethod={contactMethod}
                  onLoginSuccess={() => {}}
                  onRegisterRequired={goToRegister}
                  onBack={goBackToContact}
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
    contact: { eyebrow: 'Sign in', title: 'Welcome back' },
    otp: { eyebrow: 'Step 2 of 2', title: 'Check your messages' },
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
