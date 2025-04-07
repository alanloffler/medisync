// Icons: https://lucide.dev/icons/
import { CircleCheck, CircleHelp } from 'lucide-react';
// External imports
import { motion } from 'motion/react';
import { useAnimate } from 'motion/react';
import { useTranslation } from 'react-i18next';
// Imports
import { cn } from '@lib/utils';
import { motion as Motion } from '@core/services/motion.service';
import { useHelpStore } from '@settings/stores/help.store';
import { useNavMenuStore } from '@layout/stores/nav-menu.service';
// React component
export function Help() {
  const [scope, animate] = useAnimate();
  const menuExpanded = useNavMenuStore((state) => state.navMenuExpanded);
  const { help, setHelp } = useHelpStore();
  const { t } = useTranslation();

  function handleHelp(): void {
    setHelp(!help);
  }

  function handleAnimateOver(): void {
    const { keyframes, options } = Motion.scale(1.1).type('bounce').animate();
    animate(scope.current, keyframes, options);
  }

  function handleAnimateOut(): void {
    const { keyframes, options } = Motion.scale(1).type('bounce').animate();
    animate(scope.current, keyframes, options);
  }

  return (
    <button
      className={cn('flex h-8 w-full items-center pb-6 text-muted-foreground', menuExpanded ? 'justify-start px-5' : 'justify-center')}
      onClick={handleHelp}
      onMouseOver={handleAnimateOver}
      onMouseOut={handleAnimateOut}
    >
      {help ? (
        <div className='flex min-w-5 items-center'>
          <CircleCheck ref={scope} size={20} strokeWidth={2} className='stroke-emerald-400' />
          {menuExpanded && (
            <motion.span className='pl-2 text-xs' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1, delay: 0.2 }}>
              {t('button.disableHelp')}
            </motion.span>
          )}
        </div>
      ) : (
        <div className='flex min-w-5 items-center'>
          <CircleHelp ref={scope} size={20} strokeWidth={2} />
          {menuExpanded && (
            <motion.span className='pl-2 text-xs' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1, delay: 0.2 }}>
              {t('button.activateHelp')}
            </motion.span>
          )}
        </div>
      )}
    </button>
  );
}
