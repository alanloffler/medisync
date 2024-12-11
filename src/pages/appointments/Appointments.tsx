// Icons: https://lucide.dev/icons/
import { ChartLine, Database, List, PlusCircle } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
// https://number-flow.barvian.me/
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
// Components
import { ApposDataTable } from '@appointments/components/AppoDataTable';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
// External imports
import { clsx } from 'clsx';
import { spring, useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import { APPO_CONFIG } from '@config/appointments/appointments.config';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { EAppointmentSearch, type IAppointmentSearch } from '@appointments/interfaces/appointment-search.interface';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
import { useHelpStore } from '@settings/stores/help.store';
// React component
export default function Appointments() {
  const _limit: number =
    APPO_CONFIG.table.defaultItemsPerPage && APPO_CONFIG.table.defaultItemsPerPage > 0 ? APPO_CONFIG.table.defaultItemsPerPage : 10;
  const [limit, setLimit] = useState<number>(_limit);
  const [page, setPage] = useState<number>(0);
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

  const {
    data: totalAppointments,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['appointments', 'countTotalAppointments', page, limit],
    queryFn: () => AppointmentApiService.countTotalAppointments(),
    refetchOnWindowFocus: 'always',
    retry: 1,
  });

  const [flowValue, setFlowValue] = useState<{ value: number; label: string }>({ value: 0, label: '' });

  useEffect(() => {
    const flowContent = [
      { value: 58, label: 'en total' },
      { value: -12, label: 'esta semana' },
      { value: 4, label: 'hoy' },
    ];
    let index = 0;

    const interval = setInterval(() => {
      setFlowValue(flowContent[index]);
      index = (index + 1) % flowContent.length;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
          <Card className='space-y-4 bg-amber-200 p-4 pb-8 text-amber-600'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xsm font-semibold uppercase'>{t('pageTitle.appointments')}</h2>
              <ChartLine size={20} strokeWidth={2} className='stroke-amber-600' />
            </div>
            <NumberFlowGroup>
              <div className='flex flex-col items-center justify-center space-y-2 font-semibold'>
                <div className={'flex items-center space-x-2'}>
                  <NumberFlow
                    className={clsx('text-3xl', flowValue.value < 0 ? 'fill-rose-500 text-rose-500' : 'fill-emerald-500 text-emerald-500')}
                    format={{ style: 'decimal' }}
                    value={flowValue.value}
                    // prefix={flowValue.value > 0 ? '+' : ''}
                  />
                  <span className='text-base font-light'>{flowValue.label}</span>
                </div>
                {/* <div className='flex items-center space-x-2'>
                  <NumberFlow value={flowValue.value} suffix='' className='text-2xl font-semibold' />
                  <span className='font-light'>{flowValue.label}</span>
                </div> */}
              </div>
            </NumberFlowGroup>
          </Card>
        </section>
        <Card className='col-span-1 h-fit space-y-4 overflow-y-auto p-0 md:col-span-4 lg:col-span-3 xl:col-span-3'>
          <header className='flex items-center space-x-3.5 rounded-t-lg bg-slate-200 px-3.5 py-2 text-slate-700'>
            <List size={16} strokeWidth={2} />
            <h1 className='text-center text-lg font-semibold'>{t('cardTitle.appointmentsList')}</h1>
          </header>
          <CardContent className='space-y-2 pt-0'>
            {isLoading && <LoadingDB variant='default' text={t('loading.appointments')} />}
            {isError && <InfoCard text={error.message} type='error' />}
            {!isError && !isLoading && totalAppointments && (
              <>
                <section className='flex items-center justify-end space-x-1 px-1'>
                  <Database size={16} strokeWidth={2} className='text-blue-400' />
                  <span className='text-xsm text-slate-400'>{t('table.totalItems.appointments', { count: totalAppointments?.data })}</span>
                </section>
                <ApposDataTable search={search} reload={reload} setReload={setReload} setErrorMessage={setErrorMessage} help={help} />
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
