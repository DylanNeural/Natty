import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    hcaptcha?: {
      render: (container: HTMLElement, params: Record<string, any>) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

type HCaptchaProps = {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
};

const HCAPTCHA_SRC = 'https://js.hcaptcha.com/1/api.js?render=explicit';

function loadHcaptchaScript(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();

  const existing = document.querySelector(`script[src="${HCAPTCHA_SRC}"]`) as HTMLScriptElement | null;
  if (existing) {
    if ((existing as any)._nattyLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('HCaptcha script load failed')), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = HCAPTCHA_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => {
      (script as any)._nattyLoaded = true;
      resolve();
    });
    script.addEventListener('error', () => reject(new Error('HCaptcha script load failed')));
    document.head.appendChild(script);
  });
}

export default function HCaptcha({ siteKey, onVerify, onExpire, onError }: HCaptchaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await loadHcaptchaScript();
        if (cancelled) return;

        if (!window.hcaptcha || !containerRef.current) return;
        if (widgetIdRef.current !== null) return;

        widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onVerify(token),
          'expired-callback': () => onExpire?.(),
          'error-callback': () => onError?.(),
        });
        setReady(true);
      } catch {
        onError?.();
      }
    }

    init();
    return () => {
      cancelled = true;
      // Don't remove script; keep it cached for other screens.
    };
  }, [siteKey, onVerify, onExpire, onError]);

  return (
    <div>
      <div ref={containerRef} />
      {!ready && (
        <p className="mt-2 text-xs font-bold text-natty-charcoal/50">
          Chargement du captcha...
        </p>
      )}
    </div>
  );
}

