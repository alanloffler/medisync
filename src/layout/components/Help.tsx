// Icons: https://lucide.dev/icons/
import { Check, CircleHelp } from 'lucide-react';
// Components
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { useAnimate } from 'motion/react';
import { useTranslation } from 'react-i18next';
// Imports
import { motion } from '@core/services/motion.service';
import { useHelpStore } from '@settings/stores/help.store';
// React component
export function Help() {
  const [scope, animate] = useAnimate();
  const { help, setHelp } = useHelpStore();
  const { t } = useTranslation();

  function handleHelp(): void {
    setHelp(!help);
  }

  function handleAnimateOver(): void {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    animate(scope.current, keyframes, options);
  }

  function handleAnimateOut(): void {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    animate(scope.current, keyframes, options);
  }

  return (
    <TooltipWrapper tooltip={t('tooltip.help')} help={help}>
      <button
        className='relative flex h-5 w-5 items-center justify-center'
        onClick={handleHelp}
        onMouseOver={handleAnimateOver}
        onMouseOut={handleAnimateOut}
        ref={scope}
      >
        <CircleHelp size={20} strokeWidth={2} />
        {help && (
          <span className='absolute -bottom-1 -right-1 rounded-full bg-emerald-400 p-0.5'>
            <Check size={10} strokeWidth={3} className='stroke-emerald-50' />
          </span>
        )}
      </button>
    </TooltipWrapper>
  );
}
