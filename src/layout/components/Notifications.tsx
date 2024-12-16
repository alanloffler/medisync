// Icons: https://lucide.dev/icons/
import { ChevronRight } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@core/components/ui/dropdown-menu';
import { ScrollArea } from '@core/components/ui/scroll-area';
// Components
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { spring, useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import { useHelpStore } from '@settings/stores/help.store';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export function Notifications() {
  const [chevronScope, chevronAnimate] = useAnimate();
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const notifications = useNotificationsStore((state) => state.notifications);
  const { help } = useHelpStore();
  const { t } = useTranslation();

  useEffect(() => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 10000);
  }, [notifications]);

  function handleMouseOver(): void {
    chevronAnimate(chevronScope.current, { rotate: '-90deg' }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
  }

  function handleMouseOut(): void {
    chevronAnimate(chevronScope.current, { rotate: '0deg' }, { duration: 0.35, ease: 'easeOut', type: spring });
  }

  return (
    <main className='flex items-center space-x-2 overflow-hidden'>
      <DropdownMenu>
        <TooltipWrapper tooltip={t('tooltip.console')} help={help}>
          <DropdownMenuTrigger
            className='rounded-sm border-2 border-slate-700 focus:outline-none'
            disabled={notifications.length === 0}
            onClick={() => setShowAll(!showAll)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <ChevronRight ref={chevronScope} size={16} strokeWidth={2} />
          </DropdownMenuTrigger>
        </TooltipWrapper>
        <DropdownMenuContent className='ml-4 max-h-[250px] max-w-[400px]'>
          <ScrollArea className='h-[250px] p-1.5'>
            <ul className='w-full text-xs'>
              {notifications.map((notification) => (
                <li key={crypto.randomUUID()} className='flex w-full flex-row items-center space-x-2 border-t py-1.5'>
                  <div
                    className={`w-2 rounded-full p-1.5 ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}
                  ></div>
                  <span className='font-medium text-slate-500'>[{notification.date}]</span>
                  <span>{`>`}</span>
                  <span className='flex-grow text-slate-500'>{notification.message}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      {showNotification && notifications[notifications.length - 1] && (
        <div className={`flex items-center space-x-2 py-1`}>
          {notifications[0].type === 'success' ? (
            <div className='rounded-full bg-green-500 p-1.5'></div>
          ) : (
            <div className='rounded-full bg-red-500 p-1.5'></div>
          )}
          <div className='flex select-none space-x-1 text-nowrap py-3 text-xs'>
            <span className='font-medium text-slate-500'>{`[${notifications[0].date}]`}</span>
            <span className='text-slate-500'>{`> ${notifications[0].message}`}</span>
          </div>
        </div>
      )}
    </main>
  );
}
