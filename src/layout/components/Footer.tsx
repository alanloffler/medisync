// Icons: https://lucide.dev/icons/
import { Settings } from 'lucide-react';
// Components
import { Help } from '@layout/components/footer/Help';
import { Notifications } from '@layout/components/footer/Notifications';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
import { User } from '@layout/components/footer/User';
// External imports
import { Link } from 'react-router-dom';
import { spring, useAnimate } from 'motion/react';
import { useTranslation } from 'react-i18next';
// Imports
import { useHelpStore } from '@settings/stores/help.store';
// React component
export function Footer() {
  const [settingScope, settingAnimation] = useAnimate();
  const { t } = useTranslation();
  const { help } = useHelpStore();

  return (
    <footer className='fixed bottom-0 z-50 flex h-12 w-full items-center justify-between gap-4 border-t bg-white p-4 px-4 md:p-6 md:px-4'>
      <section className='flex w-full items-center justify-between'>
        <section className='flex items-center space-x-3'>
          <User />
          <TooltipWrapper tooltip={t('tooltip.settings')} help={help}>
            <Link
              ref={settingScope}
              to='/settings'
              onMouseOver={() => settingAnimation(settingScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })}
              onMouseOut={() => settingAnimation(settingScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })}
            >
              <Settings size={20} strokeWidth={2} />
            </Link>
          </TooltipWrapper>
          <Help />
          <Notifications />
        </section>
        <section className='flex items-center gap-2'>
          <div className='hidden justify-end text-sm font-medium text-primary md:flex lg:flex'>{`© ${new Date().getFullYear()} ${t('appName')}`}</div>
        </section>
      </section>
    </footer>
  );
}
