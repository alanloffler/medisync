// Icons: https://lucide.dev/icons
import { CalendarClock, Package2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { CardHeaderSecondary } from '@core/components/common/header/CardHeaderSecondary';
import { DatePicker } from '@microsites/common/DatePicker';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { MicrositeSchedule } from '@microsites/MicrositeSchedule';
import { MicrositeStats } from '@microsites/MicrositeStats';
// External imports
import { format } from '@formkit/tempo';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IStats } from '@microsites/interfaces/statistics.interface';
import { CalendarService } from '@appointments/services/calendar.service';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { UtilsString } from '@core/services/utils/string.service';
// React component
export default function ProfessionalMicrosite() {
  const [apposIsLoading, setApposIsLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [todayStats, setTodayStats] = useState<IStats | undefined>(undefined);
  const [isTodayWorkingDay, setIsTodayWorkingDay] = useState<boolean>(false);
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    data: professional,
    error: profError,
    isError: profIsError,
    isLoading: profIsLoading,
    isSuccess: profIsSuccess,
  } = useQuery<IResponse<IProfessional>, Error>({
    queryKey: ['professional', 'find-one', id],
    queryFn: async () => {
      if (!id) throw new Error('Dev Error: No ID provided');
      return await ProfessionalApiService.findOne(id);
    },
  });

  useEffect(() => {
    if (professional && date) {
      const isWorkingDay: boolean = CalendarService.checkTodayIsWorkingDay(professional?.data.configuration.workingDays, date.getDay());
      setIsTodayWorkingDay(isWorkingDay);
    }
  }, [date, professional]);

  function formatDate(date: Date | undefined) {
    if (!date) return '';
    return format(date, 'YYYY-MM-DD');
  }

  if (profIsLoading)
    return (
      <main className='flex h-screen flex-col bg-muted/70'>
        <LoadingDB absolute size='default' text={t('loading.professional')} variant='card' />
      </main>
    );

  if (profIsError)
    return (
      <main className='flex h-screen flex-col bg-muted/70'>
        <InfoCard className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' text={profError.message} variant='error' />
      </main>
    );

  if (profIsSuccess)
    return (
      <main className='flex h-full min-h-dvh flex-col bg-muted/70'>
        <header className='sticky top-0 z-50 flex h-16 items-center justify-between gap-4 bg-background px-4 shadow-sm md:justify-normal md:gap-8 md:px-8'>
          <div className='flex items-center gap-2 font-semibold md:text-base'>
            <Package2 size={24} strokeWidth={2} />
            <span>{t('appName')}</span>
          </div>
          <h1 className='text-base font-medium text-foreground'>
            {UtilsString.upperCase(`${professional?.data.title.abbreviation} ${professional?.data.firstName} ${professional?.data.lastName}`, 'each')}
          </h1>
        </header>
        <section className='grid grid-cols-1 gap-6 p-6 md:grid-cols-5 md:gap-8 md:p-8'>
          <Card className='col-span-1 h-fit p-6 md:col-span-2'>
            <MicrositeStats apposIsLoading={apposIsLoading} showToday={isTodayWorkingDay} professionalId={id} todayStats={todayStats} />
          </Card>
          <Card className='col-span-1 h-fit md:col-span-3'>
            <CardHeaderSecondary
              className='p-4 pl-6 text-base md:flex-row md:items-center'
              icon={<CalendarClock size={18} strokeWidth={2} />}
              title={t('pageTitle.appointments')}
            >
              <section className='flex items-center space-x-4'>
                {formatDate(date) !== formatDate(new Date()) && (
                  <Button className='h-[35px]' size='sm' variant='default' onClick={() => setDate(new Date())}>
                    {t('button.today')}
                  </Button>
                )}
                <DatePicker
                  className='w-fit'
                  defaultDate={date}
                  disabledDays={CalendarService.getDisabledDays(professional.data.configuration.workingDays)}
                  onDateChange={(e) => setDate(e)}
                />
              </section>
            </CardHeaderSecondary>
            <CardContent>
              {date && (
                <h2 className='mb-4 mt-6 flex flex-col items-center rounded-lg bg-slate-100 py-1 text-base font-medium'>
                  {UtilsString.upperCase(`${format(date, 'full')}`, 'first')}
                </h2>
              )}
              {isTodayWorkingDay ? (
                <MicrositeSchedule
                  day={formatDate(date)}
                  professional={professional?.data}
                  setApposIsLoading={setApposIsLoading}
                  setTodayStats={setTodayStats}
                />
              ) : (
                <main className='mx-auto w-fit pt-2'>
                  <section className='flex flex-col space-y-3 text-pretty rounded-lg bg-amber-100 p-6 text-base text-amber-600'>
                    <span>Hoy no es un día laboral segun la configuración de tu agenda. </span>
                    <span>Por favor, selecciona otro día para ver tus turnos.</span>
                  </section>
                </main>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    );
}
