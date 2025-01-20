import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

export function CountUp({ to, from = 0, direction = 'up', delay = 0, duration = 2, className = '', startWhen = true, onStart, onEnd }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const damping: number = 20 + 40 * (1 / duration);
  const stiffness: number = 100 * (1 / duration);

  const { i18n } = useTranslation();

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView: boolean = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(direction === 'down' ? to : from);
    }
  }, [from, to, direction]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === 'function') {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === 'down' ? from : to);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === 'function') {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000,
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration, i18n]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      if (ref.current) {
        const formattedNumber: string = i18n.format(latest, 'integer', i18n.resolvedLanguage);

        ref.current.textContent = formattedNumber;
      }
    });

    return () => unsubscribe();
  }, [i18n, springValue]);

  return <span className={`${className}`} ref={ref} />;
}
