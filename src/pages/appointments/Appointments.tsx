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
import { DBCountAppos } from '@appointments/components/common/DBCountAppos';
import { PageHeader } from '@core/components/common/PageHeader';
// External imports
import { ChangeEvent, useEffect, useState } from 'react';
import { format } from '@formkit/tempo';
import { spring, useAnimate } from 'motion/react';
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
import { useHelpStore } from '@settings/stores/help.store';
// React component
export default function Appointments() {
  const [createScope, createAnimation] = useAnimate();
  const [date, setDate] = useState<Date>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);
  const [search, setSearch] = useState<IAppointmentSearch>({ value: '', type: EAppointmentSearch.NAME });
  const debouncedSearch = useDebounce<IAppointmentSearch>(search, APP_CONFIG.debounceTime);
  const navigate = useNavigate();
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { help } = useHelpStore();
  const { t } = useTranslation();

  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[1].id);
  }, [setItemSelected]);

  function handleSearch(e: ChangeEvent<HTMLInputElement>): void {
    setSearch({ value: e.target.value, type: search.type });
  }

  function handleSetDate(date: Date | undefined): void {
    date ? setDate(date) : setDate(undefined);
    setOpenPopover(false);
  }

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
          <CardContent className='pt-2'>
            <header className='space-y-2'>
              <section className='flex flex-row items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='relative w-full items-center md:w-[200px]'>
                    <Search size={16} strokeWidth={2} className='absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                      className='h-7 bg-input pl-8 text-xsm'
                      onChange={handleSearch}
                      placeholder={t('search.user')}
                      type='text'
                      value={search.type === EAppointmentSearch.NAME ? search.value : ''}
                    />
                    {search.type === EAppointmentSearch.NAME && search.value && (
                      <button
                        onClick={() => setSearch({ value: '', type: EAppointmentSearch.NAME })}
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
                        <Calendar mode='single' selected={date} onSelect={handleSetDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                    {date && (
                      <Button variant={'clear'} size='icon5' onClick={() => handleSetDate(undefined)}>
                        <X size={14} strokeWidth={2} />
                      </Button>
                    )}
                  </div>
                </div>
                <DBCountAppos className='!text-xsm' />
              </section>
              <div className='flex h-4 text-xsm font-light text-rose-400'>{errorMessage}</div>
            </header>
            <ApposDataTable search={debouncedSearch} reload={reload} setReload={setReload} setErrorMessage={setErrorMessage} help={help} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
