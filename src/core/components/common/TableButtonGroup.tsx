// Icons: https://lucide.dev/icons/
import { EllipsisVertical } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@core/components/ui/dropdown-menu';
// Components
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { AnimationPlaybackControls, useAnimate } from 'motion/react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import { motion } from '@core/services/motion.service';
// Interface
interface IProps {
  buttons: ReactNode;
}
// React component
export function TableButtonGroup({ buttons }: IProps) {
  const [scope, animation] = useAnimate();
  const { t } = useTranslation();

  function animateOver(): AnimationPlaybackControls | undefined {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    return animation(scope.current, keyframes, options);
  }

  function animateOut(): AnimationPlaybackControls | undefined {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    return animation(scope.current, keyframes, options);
  }

  return (
    <DropdownMenu>
      <TooltipWrapper tooltip={t('tooltip.moreOptions')}>
        <DropdownMenuTrigger
          className='flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 hover:bg-indigo-200 hover:text-indigo-500'
          onMouseOver={animateOver}
          onMouseOut={animateOut}
        >
          <span ref={scope}>
            <EllipsisVertical size={17} strokeWidth={1.5} />
          </span>
        </DropdownMenuTrigger>
      </TooltipWrapper>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        align='end'
        side='left'
        alignOffset={-8}
        sideOffset={5}
        className='w-fit min-w-fit bg-slate-50 p-2'
      >
        <section className='flex flex-row items-center space-x-2'>{buttons}</section>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
