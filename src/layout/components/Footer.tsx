// Components
import { Help } from '@layout/components/footer/Help';
import { Notifications } from '@layout/components/footer/Notifications';
import { Settings } from '@layout/components/footer/Settings';
import { User } from '@layout/components/footer/User';
import { useEffect, useState } from 'react';
// External imports
import { useTranslation } from 'react-i18next';
// React component
export function Footer() {
  const { t } = useTranslation();
  const [secs, setSecs] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => setSecs((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className='fixed bottom-0 z-50 flex h-12 w-full items-center justify-between gap-4 border-t bg-white p-4 px-4 md:p-6 md:px-4'>
      <section className='flex w-full items-center justify-between'>
        <section className='flex items-center space-x-3'>
          <User />
          <Settings />
          <Help />
          <Notifications />
          <div>{secs}</div>
        </section>
        <section className='flex items-center gap-2'>
          <div className='hidden justify-end text-sm font-medium text-primary md:flex lg:flex'>{`© ${new Date().getFullYear()} ${t('appName')}`}</div>
        </section>
      </section>
    </footer>
  );
}
