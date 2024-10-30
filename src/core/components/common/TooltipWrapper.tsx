// External components: https://ui.shadcn.com/docs/components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@core/components/ui/tooltip';
// React component
export function TooltipWrapper({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <TooltipProvider delayDuration={0.3}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p className='text-xs font-medium'>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
