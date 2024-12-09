// External components: https://ui.shadcn.com/docs/components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@core/components/ui/tooltip';
// External imports
import { ReactNode } from 'react';
// Interface
interface ITooltipWrapper {
  children: ReactNode;
  help?: boolean;
  tooltip?: string;
}
// React component
export function TooltipWrapper({ children, tooltip, help }: ITooltipWrapper) {
  return help && tooltip ? (
    <TooltipProvider delayDuration={0.3}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p className='select-none text-xs font-normal'>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    children
  );
}
