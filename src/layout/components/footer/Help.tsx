// Icons: https://lucide.dev/icons/
import { CircleCheck, CircleHelp } from 'lucide-react';
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
    <main className='flex items-center gap-3 text-muted-foreground'>
      <button
        className='relative left-0 flex items-center text-xs'
        onClick={handleHelp}
        onMouseOver={handleAnimateOver}
        onMouseOut={handleAnimateOut}
      >
        {help ? (
          <div className='flex items-center gap-2'>
            <CircleCheck ref={scope} size={20} strokeWidth={2} className='stroke-emerald-400' />
            <span>{t('button.disableHelp')}</span>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <CircleHelp ref={scope} size={20} strokeWidth={2} />
            <span>{t('button.activateHelp')}</span>
          </div>
        )}
      </button>
    </main>
  );
}
