// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
// External imports
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import { cn } from '@lib/utils';
import { socket } from '@core/services/socket.service';
// Interface
interface IProps {
  className?: string;
}

interface ISocketStatus {
  connected: boolean;
  data: string;
  message: string;
}
// React component
export function MessageStatus({ className }: IProps) {
  const [status, setStatus] = useState<boolean>();
  const { t } = useTranslation();

  useEffect(() => {
    socket.connect();

    socket.on('status', socketStatus);

    return () => {
      socket.off('status', socketStatus);
      socket.disconnect();
    };
  }, []);

  function socketStatus(status: ISocketStatus): void {
    const { connected } = status;
    setStatus(connected);
  }

  return (
    <main className={cn(className, 'flex items-center space-x-4 text-xsm')}>
      <section className='flex items-center space-x-2'>
        <div className={cn('flex h-4 w-4 items-center justify-center rounded-full bg-rose-200', status ? 'bg-emerald-200' : 'bg-rose-200')}>
          <span className={cn('h-2.5 w-2.5 rounded-full bg-rose-400', status ? 'bg-emerald-400' : 'bg-rose-400')}></span>
        </div>
        <div>{status !== undefined && status ? t('whatsapp.status.connected') : t('whatsapp.status.disconnected')}</div>
      </section>
      {(!status) && (
        <Button size='xs' className='bg-foreground text-xs text-background hover:bg-foreground/80'>
          {t('button.connect')}
        </Button>
      )}
    </main>
  );
}
