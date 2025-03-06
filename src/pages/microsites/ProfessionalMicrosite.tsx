// Icons: https://lucide.dev/icons
import { Package2 } from 'lucide-react';
// External imports
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@core/components/ui/card';
// React component
export default function ProfessionalMicrosite() {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <main className='flex h-screen flex-col bg-muted/70'>
      <header className='sticky top-0 z-50 flex h-16 items-center justify-between gap-4 bg-background px-4 shadow-sm md:justify-normal md:gap-8 md:px-8'>
        <div className='flex items-center gap-2 font-semibold md:text-base'>
          <Package2 size={24} strokeWidth={2} />
          <span>{t('appName')}</span>
        </div>
        <section className='text-base font-medium text-foreground'>Professional name</section>
      </header>
      <section className='flex flex-col p-6 gap-6 md:p-8 md:gap-8'>
        <Card className='p-4'>Statistics here</Card>
        <section>Professional id {id}</section>
      </section>
    </main>
  );
}
