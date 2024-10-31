// Icons: https://lucide.dev/icons/
import { SquareChevronRight } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@core/components/ui/dropdown-menu';
import { ScrollArea } from '@core/components/ui/scroll-area';
// External imports
import { useEffect, useState } from 'react';
// Imports
import { FOOTER_CONFIG } from '@config/layout/footer.config';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export function Footer() {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const notifications = useNotificationsStore((state) => state.notifications);

  useEffect(() => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 10000);
  }, [notifications]);

  return (
    <footer className='fixed bottom-0 z-50 flex h-12 w-full items-center justify-between gap-4 border-t bg-white p-4 px-4 md:p-6 md:px-4'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-2 overflow-x-hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger disabled={notifications.length === 0} onClick={() => setShowAll(!showAll)} className='focus:outline-none'>
              <SquareChevronRight className='h-5 w-5' strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='ml-4 max-h-[250px]'>
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
          {showNotification && (
            <>
              {notifications[notifications.length - 1] && (
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
            </>
          )}
        </div>
        <div className='hidden justify-end text-sm font-medium text-primary md:flex lg:flex'>{FOOTER_CONFIG.title}</div>
      </div>
    </footer>
  );
}
