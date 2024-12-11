// Icons: https://lucide.dev/icons/
import { Database, List, PlusCircle } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { AppoFlowCard } from '@appointments/components/AppoFlowCard';
import { ApposDataTable } from '@appointments/components/AppoDataTable';
import { PageHeader } from '@core/components/common/PageHeader';
// External imports
import { spring, useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import { APPO_CONFIG } from '@config/appointments/appointments.config';
import { EAppointmentSearch, type IAppointmentSearch } from '@appointments/interfaces/appointment-search.interface';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
import { useHelpStore } from '@settings/stores/help.store';
import { DBCountAppos } from './components/common/DBCountAppos';
// React component
export default function Appointments() {
  const [createScope, createAnimation] = useAnimate();
  const navigate = useNavigate();
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { t } = useTranslation();
  // WIP: const for appos data table
  const [reload, setReload] = useState<number>(0);
  const [search, setSearch] = useState<IAppointmentSearch>({ value: '', type: EAppointmentSearch.NAME });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { help } = useHelpStore();

  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[1].id);
  }, [setItemSelected]);

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      <header className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.appointments')} breadcrumb={APPO_CONFIG.breadcrumb} />
      </header>
      <section className='grid gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4'>
        <section className='col-span-1 space-y-6 md:col-span-4 lg:col-span-1 xl:col-span-1'>
          <div className='flex'>
            <Button
              variant='default'
              size='sm'
              className='w-fit space-x-2'
              onClick={() => navigate('/reserve')}
              onMouseOver={() => createAnimation(createScope.current, { scale: 1.2 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })}
              onMouseOut={() => createAnimation(createScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })}
            >
              <PlusCircle ref={createScope} size={16} strokeWidth={2} />
              <span>{t('button.generateAppointment')}</span>
            </Button>
          </div>
          <AppoFlowCard />
        </section>
        <Card className='col-span-1 h-fit space-y-4 overflow-y-auto p-0 md:col-span-4 lg:col-span-3 xl:col-span-3'>
          <header className='flex items-center space-x-3.5 rounded-t-lg bg-slate-200 px-3.5 py-2 text-slate-700'>
            <List size={16} strokeWidth={2} />
            <h1 className='text-center text-lg font-semibold'>{t('cardTitle.appointmentsList')}</h1>
          </header>
          <CardContent className='space-y-2 pt-0'>
            <DBCountAppos className='!text-xsm' />
            <ApposDataTable search={search} reload={reload} setReload={setReload} setErrorMessage={setErrorMessage} help={help} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
