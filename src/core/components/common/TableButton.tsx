// Components
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import type { ReactNode } from 'react';
import { type AnimationPlaybackControls, useAnimate } from 'motion/react';
// Imports
import { cn } from '@lib/utils';
import { motion } from '@core/services/motion.service';
// Interface
interface IProps {
  callback: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
}
// React component
export function TableButton({ callback, children, className, disabled, tooltip }: IProps) {
  const [scope, animation] = useAnimate();

  function animateOver(): AnimationPlaybackControls | undefined {
    if (disabled === false || disabled === undefined) {
      const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
      return animation(scope.current, keyframes, options);
    }
  }

  function animateOut(): AnimationPlaybackControls | undefined {
    if (disabled === false || disabled === undefined) {
      const { keyframes, options } = motion.scale(1).type('bounce').animate();
      return animation(scope.current, keyframes, options);
    }
  }

  return (
    <TooltipWrapper tooltip={tooltip}>
      <button
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md bg-transparent disabled:pointer-events-none disabled:text-rose-500',
          className,
        )}
        disabled={disabled}
        onClick={callback}
        onMouseOver={animateOver}
        onMouseOut={animateOut}
      >
        <span ref={scope}>{children}</span>
      </button>
    </TooltipWrapper>
  );
}
