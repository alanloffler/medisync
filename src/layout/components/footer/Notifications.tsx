// Icons: https://lucide.dev/icons/
import { ChevronRight } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@core/components/ui/dropdown-menu';
import { ScrollArea } from '@core/components/ui/scroll-area';
// Components
import { Dot } from '@core/components/common/ui/Dot';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import { motion } from '@core/services/motion.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export function Notifications() {
  const [scope, animate] = useAnimate();
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const notifications = useNotificationsStore((state) => state.notifications);
  const { t } = useTranslation();

  useEffect(() => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 10000);
  }, [notifications]);

  function handleMouseOver(): void {
    const { keyframes, options } = motion.rotate('-90deg').type('linear-1').animate();
    animate(scope.current, keyframes, options);
  }

  function handleMouseOut(): void {
    const { keyframes, options } = motion.rotate('0deg').type('linear-1').animate();
    animate(scope.current, keyframes, options);
  }

  return (
    <main className='flex items-center space-x-2 overflow-hidden'>
      <DropdownMenu>
        <TooltipWrapper tooltip={t('tooltip.console')}>
          <DropdownMenuTrigger
            className='rounded-sm border-2 border-slate-700 focus:outline-none'
            disabled={notifications.length === 0}
            onClick={() => setShowAll(!showAll)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <ChevronRight ref={scope} size={16} strokeWidth={2} />
          </DropdownMenuTrigger>
        </TooltipWrapper>
        <DropdownMenuContent className='ml-4 max-h-[250px] max-w-[400px]' onCloseAutoFocus={(e) => e.preventDefault()}>
          <ScrollArea className='h-[250px] p-1.5'>
            <ul className='w-full text-xs'>
              {notifications.map((notification) => (
                <li key={crypto.randomUUID()} className='flex w-full flex-row items-center space-x-2 border-t py-1.5'>
                  <Dot color={notification.type === 'success' ? 'green' : notification.type === 'error' ? 'red' : 'yellow'} size={14} />
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
          <Dot color={notifications[0].type === 'success' ? 'green' : notifications[0].type === 'error' ? 'red' : 'yellow'} size={14} />
          <div className='flex select-none space-x-1 text-nowrap py-3 text-xs'>
            <span className='font-medium text-slate-500'>{`[${notifications[0].date}]`}</span>
            <span className='text-slate-500'>{`> ${notifications[0].message}`}</span>
          </div>
        </div>
      )}
    </main>
  );
}
