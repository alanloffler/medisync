// External components: https://ui.shadcn.com/docs/components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@core/components/ui/tooltip';
// External imports
import { useAnimate } from 'motion/react';
import { useEffect } from 'react';
// Interface
interface IProps {
  message: string;
}
// React component
export function FormError({ message }: IProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(scope.current, { opacity: 1 }, { duration: 0.35 });
  }, [animate, scope]);

  return (
    <TooltipProvider delayDuration={0.3}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div ref={scope} className='flex min-h-4 min-w-4 cursor-pointer items-center justify-center rounded-full bg-rose-400 opacity-0'>
            <span className='text-xxs font-medium text-rose-50'>!</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className='max-w-[150px] bg-red-50'>
          <p className='select-none text-xs font-normal'>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
