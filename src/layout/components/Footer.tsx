// App
import { useState } from 'react';
import { FOOTER_TEXT } from '../config/footer.config';
import { useNotificationsStore } from '@/core/stores/notifications.store';
// React component
export function Footer() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const [showAll, setShowAll] = useState<boolean>(false);

  return (
    <footer className='fixed bottom-0 z-50 flex h-12 w-full items-center justify-between gap-4 border-t bg-white p-4 px-4 md:p-6 md:px-4'>
      <div className='flex w-full items-center justify-between'>
        <div className='overflow-x-hidden'>
          {notifications[notifications.length - 1] && (
            <div className={`flex items-center space-x-2 py-1`}>
              {notifications[notifications.length - 1].type === 'success' ? <div className='rounded-full bg-green-500 p-1.5'></div> : <div className='rounded-full bg-red-500 p-1.5'></div>}
              <div className='flex select-none space-x-1 text-nowrap py-3 text-xs'>
                <span className='font-medium text-slate-500'>{`[${notifications[notifications.length - 1].date}]`}</span>
                <span className='text-slate-500'>{`> ${notifications[notifications.length - 1].message}`}</span>
              </div>
            </div>
          )}
        </div>
        {false && notifications.length > 0 && <button onClick={() => setShowAll(!showAll)}>Show All</button>}
        <div className='hidden justify-end text-sm font-medium text-primary md:flex lg:flex'>{FOOTER_TEXT.title}</div>
      </div>
    </footer>
  );
}
