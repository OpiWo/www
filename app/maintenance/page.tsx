import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Something big is coming — OpiWo",
  description: "The world's opinion, quantified. Launching soon.",
};

// Static opinion bars — the world's data loading in
const OPINION_BARS = [
  { label: 'Strongly agree', pct: 34, delay: 0.1 },
  { label: 'Agree', pct: 28, delay: 0.25 },
  { label: 'Neutral', pct: 18, delay: 0.4 },
  { label: 'Disagree', pct: 12, delay: 0.55 },
  { label: 'Strongly disagree', pct: 8, delay: 0.7 },
];

const REGIONS = [
  { code: 'NA', name: 'Americas', dot: '#f59e0b' },
  { code: 'EU', name: 'Europe', dot: '#0ea5e9' },
  { code: 'AS', name: 'Asia-Pacific', dot: '#10b981' },
  { code: 'AF', name: 'Africa & ME', dot: '#8b5cf6' },
];

export default function MaintenancePage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { width: 0%; opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulseAmber {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.15); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes gridFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33%       { transform: translateY(-18px) translateX(8px); }
          66%       { transform: translateY(10px) translateX(-6px); }
        }
        @keyframes dotPing {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes counterUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .footer-link {
          color: oklch(0.4 0.015 261);
          transition: color 0.2s;
          display: block;
          line-height: 0;
        }
        .footer-link:hover {
          color: oklch(0.769 0.18 67);
        }

        .fadeUp-0 { animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both; }
        .fadeUp-1 { animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both; }
        .fadeUp-2 { animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.28s both; }
        .fadeUp-3 { animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.42s both; }
        .fadeUp-4 { animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.58s both; }
        .fadeUp-5 { animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.72s both; }
        .fadeUp-6 { animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.88s both; }

        .shimmer-text {
          background: linear-gradient(
            90deg,
            oklch(0.769 0.18 67) 0%,
            oklch(0.92 0.14 80) 40%,
            oklch(0.769 0.18 67) 60%,
            oklch(0.65 0.19 60) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite 1.2s;
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: 'oklch(0.098 0.018 261)',
          color: 'oklch(0.97 0.005 247)',
          fontFamily: 'var(--font-plus-jakarta-sans, system-ui, sans-serif)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Background: dot grid ── */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle, oklch(0.97 0.005 247 / 0.06) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            animation: 'gridFade 1.2s ease both',
          }}
        />

        {/* ── Background: warm amber orb top-right ── */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-80px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, oklch(0.769 0.18 67 / 0.18), transparent 70%)',
            animation: 'orbFloat 9s ease-in-out infinite',
            filter: 'blur(1px)',
          }}
        />

        {/* ── Background: cool orb bottom-left ── */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-60px',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 60% 60%, oklch(0.5 0.12 261 / 0.14), transparent 70%)',
            animation: 'orbFloat 12s ease-in-out infinite reverse',
            filter: 'blur(1px)',
          }}
        />

        {/* ── Scanline effect (very subtle) ── */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 50%, oklch(0 0 0 / 0.03) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
            opacity: 0.4,
          }}
        />

        {/* ── Main content ── */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Logo wordmark */}
          <div className="fadeUp-0" style={{ marginBottom: '48px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
              {/* Icon mark — amber circle with three bars */}
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <circle cx="22" cy="22" r="22" fill="oklch(0.769 0.18 67)" />
                <rect x="10" y="15" width="24" height="3.5" rx="1.75" fill="white" />
                <rect x="10" y="20.25" width="18" height="3.5" rx="1.75" fill="white" />
                <rect x="10" y="25.5" width="13" height="3.5" rx="1.75" fill="white" />
              </svg>
              {/* Wordmark */}
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                <span style={{ color: 'oklch(0.97 0.005 247)' }}>Opi</span>
                <span style={{ color: 'oklch(0.769 0.18 67)' }}>Wo</span>
              </span>
            </div>
          </div>

          {/* Status chip */}
          <div
            className="fadeUp-1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'oklch(0.769 0.18 67 / 0.12)',
              border: '1px solid oklch(0.769 0.18 67 / 0.3)',
              borderRadius: '999px',
              padding: '6px 16px',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'oklch(0.769 0.18 67)',
                animation: 'pulseAmber 2s ease-in-out infinite',
                display: 'block',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'oklch(0.769 0.18 67)',
              }}
            >
              Calibrating systems
            </span>
          </div>

          {/* Hero headline */}
          <h1
            className="fadeUp-2"
            style={{
              fontSize: 'clamp(36px, 7vw, 72px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              textAlign: 'center',
              maxWidth: '720px',
              marginBottom: '20px',
            }}
          >
            <span className="shimmer-text">The world&apos;s opinion,</span>
            <br />
            <span style={{ color: 'oklch(0.97 0.005 247)' }}>almost ready.</span>
          </h1>

          {/* Subheading */}
          <p
            className="fadeUp-3"
            style={{
              fontSize: 'clamp(15px, 2vw, 17px)',
              color: 'oklch(0.58 0.02 261)',
              textAlign: 'center',
              maxWidth: '480px',
              lineHeight: 1.65,
              marginBottom: '56px',
            }}
          >
            We&apos;re putting the finishing touches on a global platform where every voice
            is counted, every opinion quantified — across countries, languages, and demographics.
          </p>

          {/* ── Opinion distribution widget ── */}
          <div
            className="fadeUp-4"
            style={{
              width: '100%',
              maxWidth: '540px',
              background: 'oklch(0.142 0.018 261)',
              border: '1px solid oklch(0.22 0.018 261)',
              borderRadius: '16px',
              padding: '28px',
              marginBottom: '40px',
            }}
          >
            {/* Widget header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'oklch(0.58 0.02 261)',
                    marginBottom: '4px',
                  }}
                >
                  Sample topic
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'oklch(0.97 0.005 247)',
                  }}
                >
                  Should AI be regulated globally?
                </div>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'oklch(0.58 0.02 261)',
                  fontWeight: 500,
                }}
              >
                2.4M votes
              </div>
            </div>

            {/* Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {OPINION_BARS.map((bar, i) => (
                <div key={bar.label}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '5px',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'oklch(0.72 0.015 261)', fontWeight: 500 }}>
                      {bar.label}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: i === 0 ? 'oklch(0.769 0.18 67)' : 'oklch(0.58 0.02 261)',
                      }}
                    >
                      {bar.pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '7px',
                      background: 'oklch(0.19 0.018 261)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '999px',
                        background: i === 0
                          ? 'oklch(0.769 0.18 67)'
                          : i === 1
                            ? 'oklch(0.6 0.14 67)'
                            : 'oklch(0.35 0.02 261)',
                        width: `${bar.pct}%`,
                        animation: `barGrow 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${bar.delay + 0.6}s both`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Region dots */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid oklch(0.22 0.018 261)',
                flexWrap: 'wrap',
              }}
            >
              {REGIONS.map((r, i) => (
                <div
                  key={r.code}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    animation: `counterUp 0.5s ease ${1.4 + i * 0.1}s both`,
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: r.dot,
                      display: 'block',
                      animation: `dotPing 2.4s ease-in-out ${i * 0.3}s infinite`,
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'oklch(0.52 0.02 261)', fontWeight: 500 }}>
                    {r.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stat strip */}
          <div
            className="fadeUp-5"
            style={{
              display: 'flex',
              gap: '40px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              { value: '190+', label: 'Countries' },
              { value: '40+', label: 'Languages' },
              { value: '∞', label: 'Opinions' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    color: 'oklch(0.769 0.18 67)',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'oklch(0.4 0.015 261)',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* ── Footer ── */}
        <footer
          className="fadeUp-6"
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid oklch(0.22 0.018 261)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '12px', color: 'oklch(0.35 0.015 261)' }}>
            &copy; {new Date().getFullYear()} OpiWo. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* X / Twitter */}
            <a
              href="https://twitter.com/opiwo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow OpiWo on X"
              className="footer-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.252 5.623 5.912-5.623Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://linkedin.com/company/opiwo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="OpiWo on LinkedIn"
              className="footer-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
