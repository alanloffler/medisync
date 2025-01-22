// External components: https://ui.shadcn.com/docs/components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@core/components/ui/tooltip';
// External imports
import { ReactNode } from 'react';
// Imports
import { useHelpStore } from '@settings/stores/help.store';
// Interface
interface ITooltipWrapper {
  children: ReactNode;
  tooltip?: string;
}
// React component
export function TooltipWrapper({ children, tooltip }: ITooltipWrapper) {
  const { help } = useHelpStore();

  return help && tooltip ? (
    <TooltipProvider delayDuration={0.3}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className='max-w-[150px]'>
          <p className='select-none text-xs font-normal'>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    children
  );
}
