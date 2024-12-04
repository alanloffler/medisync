import { cn } from '@lib/utils';
import { useAnimate } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';

interface ILoadingText {
  className?: string;
  suffix?: string;
  text?: string;
}

export function LoadingText({ className, suffix, text }: ILoadingText) {
  const [_, animation] = useAnimate();
  const _suffix: string[] = useMemo(() => (suffix ? suffix.split('') : []), [suffix]);
  const defaultText: string = 'Loading';
  const refs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (suffix) {
      _suffix.forEach((_, i) => {
        if (refs.current[i]) {
          animation(
            refs.current[i],
            { opacity: [1, 0, 1] },
            {
              delay: 0.5 + i * 0.16666,
              duration: 1.5,
              ease: 'linear',
              repeat: Infinity,
            },
          );
        }
      });
    }
  }, [_suffix, animation, suffix]);

  return (
    <p className={cn('text-center text-xsm font-normal text-muted-foreground', className)}>
      <span>{text ?? defaultText}</span>
      {suffix && (
        <span>
          {_suffix.map((letter, i) => (
            <span key={i} ref={(el) => (refs.current[i] = el)}>
              {letter}
            </span>
          ))}
        </span>
      )}
    </p>
  );
}
