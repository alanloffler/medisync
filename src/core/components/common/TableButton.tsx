// Components
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import type { ReactNode } from 'react';
import { useAnimate } from 'motion/react';
// Imports
import { cn } from '@lib/utils';
import { motion } from '@core/services/motion.service';
// Interface
interface IProps {
  callback: () => void;
  children: ReactNode;
  className?: string;
  help?: boolean;
  tooltip?: string;
}
// React component
export function TableButton({ callback, children, className, help, tooltip }: IProps) {
  const [scope, animation] = useAnimate();

  function animateOver(): void {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    animation(scope.current, keyframes, options);
  }

  function animateOut(): void {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    animation(scope.current, keyframes, options);
  }

  return (
    <TooltipWrapper help={help} tooltip={tooltip}>
      <button
        className={cn('flex h-6 w-6 items-center justify-center bg-transparent', className)}
        onClick={callback}
        onMouseOver={animateOver}
        onMouseOut={animateOut}
      >
        <span ref={scope}>{children}</span>
      </button>
    </TooltipWrapper>
  );
}
