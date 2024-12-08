// Icons: https://lucide.dev/icons
import { ArrowLeft, MailX, RefreshCw } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
// External imports
import { useTranslation } from 'react-i18next';
// React component
export function SendEmailError() {
  const { t } = useTranslation();

  return (
    <main className='flex flex-col space-y-6'>
      <section className='flex flex-row items-center gap-3 text-sm'>
        <MailX size={20} strokeWidth={2} className='stroke-rose-400' />
        <span>{t('email.sentError')}</span>
      </section>
      <footer className='flex justify-center space-x-6'>
        <Button variant='secondary' size='sm' className='flex items-center gap-3'>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('button.goToUsers')}
        </Button>
        <Button variant='default' size='sm' className='flex items-center gap-3'>
          <RefreshCw size={16} strokeWidth={2} />
          {t('button.tryAgain')}
        </Button>
      </footer>
    </main>
  );
}
