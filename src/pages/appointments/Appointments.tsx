// Icons: https://lucide.dev/icons/
import { CalendarIcon, List, PlusCircle, Search, X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Calendar } from '@core/components/ui/calendar';
import { Card, CardContent } from '@core/components/ui/card';
import { Input } from '@core/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@core/components/ui/popover';
// Components
import { AppoFlowCard } from '@appointments/components/AppoFlowCard';
import { ApposDataTable } from '@appointments/components/AppoDataTable';
import { CardHeaderSecondary } from '@core/components/common/header/CardHeaderSecondary';
import { DBCountAppos } from '@appointments/components/common/DBCountAppos';
import { PageHeader } from '@core/components/common/PageHeader';
// External imports
import { enUS, es, Locale } from 'date-fns/locale';
import { format } from '@formkit/tempo';
import { spring, useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import { APPO_CONFIG } from '@config/appointments/appointments.config';
import { APP_CONFIG } from '@config/app.config';
import { EAppointmentSearch, type IAppointmentSearch } from '@appointments/interfaces/appointment-search.interface';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { cn } from '@lib/utils';
import { useDebounce } from '@core/hooks/useDebounce';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
// Constants
const defaultAppoSearch: IAppointmentSearch[] = [
  { type: EAppointmentSearch.NAME, value: '' },
  { type: EAppointmentSearch.DAY, value: undefined },
];
// React component
export default function Appointments() {
  const [createScope, createAnimation] = useAnimate();
  const [date, setDate] = useState<Date>();
  const [locale, setLocale] = useState<Locale>();
  const [name, setName] = useState<string>('');
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [search, setSearch] = useState<IAppointmentSearch[]>(defaultAppoSearch);
  const debouncedSearch = useDebounce<IAppointmentSearch[]>(search, APP_CONFIG.debounceTime);
  const navigate = useNavigate();
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[1].id);
  }, [setItemSelected]);

  useEffect(() => {
    const search: IAppointmentSearch[] = [
      { type: EAppointmentSearch.NAME, value: name },
      { type: EAppointmentSearch.DAY, value: date ? format(date, 'YYYY-MM-DD') : undefined },
    ];
    setSearch(search);
    setOpenPopover(false);
  }, [date, name]);

  useEffect(() => {
    if (i18n.resolvedLanguage === 'en') setLocale(enUS);
    if (i18n.resolvedLanguage === 'es') setLocale(es);
  }, [i18n.resolvedLanguage]);

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
          <AppoFlowCard className='w-full md:max-w-[300px]' />
        </section>
        <Card className='col-span-1 h-fit space-y-4 overflow-y-auto p-0 md:col-span-4 lg:col-span-3 xl:col-span-3'>
          <CardHeaderSecondary title={t('cardTitle.appointmentsList')} icon={<List size={18} strokeWidth={2} />} />
          <CardContent className='pt-2'>
            <header className='space-y-2'>
              <section className='flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0'>
                <div className='flex items-center space-x-4'>
                  <div className='relative items-center md:w-[200px]'>
                    <Search size={16} strokeWidth={2} className='absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                      className='h-7 bg-input pl-8 text-xsm'
                      onChange={(e) => setName(e.currentTarget.value)}
                      placeholder={t('search.user')}
                      type='text'
                      value={name}
                    />
                    {name !== '' && (
                      <button
                        onClick={() => setName('')}
                        className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black'
                      >
                        <X size={16} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Popover open={openPopover} onOpenChange={setOpenPopover}>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn(
                            'h-[30px] w-[140px] justify-start border-transparent !p-0 text-left !text-xsm font-normal hover:bg-transparent data-[state=open]:border-slate-200',
                            !date && 'text-muted-foreground',
                          )}
                        >
                          <div className='flex h-[28px] w-full items-center rounded-md bg-input px-3 py-2'>
                            <CalendarIcon size={16} strokeWidth={2} className='mr-2' />
                            {date ? format(date, 'short') : <span>{t('placeholder.pickDate')}</span>}
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar initialFocus locale={locale} mode='single' onSelect={setDate} selected={date} showOutsideDays={false} />
                      </PopoverContent>
                    </Popover>
                    {date && (
                      <Button variant='clear' size='icon5' onClick={() => setDate(undefined)}>
                        <X size={14} strokeWidth={2} />
                      </Button>
                    )}
                  </div>
                  <Button size='xs' className='h-7 text-xs' onClick={() => setDate(new Date())}>
                    {t('button.today')}
                  </Button>
                </div>
                <DBCountAppos className='!text-xsm' />
              </section>
            </header>
            <ApposDataTable search={debouncedSearch} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
