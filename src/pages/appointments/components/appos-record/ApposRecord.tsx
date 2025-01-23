// Icons: https://lucide.dev/icons/
import { CalendarClock } from 'lucide-react';
// External components
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { ApposFilters } from '@appointments/components/appos-record/ApposFilters';
import { ApposTable } from '@appointments/components/appos-record/ApposTable';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { useApposFilters } from '@appointments/hooks/useApposFilters';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export function ApposRecord({ userId }: { userId: string }) {
  const [appointments, setAppointments] = useState<IAppointmentView[]>([]);
  const [disabledFilters, setDisabledFilters] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<string>('');
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { i18n, t } = useTranslation();
  const { professional, year } = useApposFilters();

  useEffect(() => {
    setIsLoading(true);

    AppointmentApiService.findApposRecordWithFilters(userId, professional, year)
      .then((response: IResponse) => {
        if (response.statusCode === 200) {
          if (response.data.length > 0) {
            setAppointments(response.data);
          } else {
            setAppointments([]);
            setDisabledFilters(true);
          }
        }
        if (response.statusCode > 399) {
          setError(true);
          setErrorMessage(response.message);
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          setError(true);
          setErrorMessage(i18n.t('error.internalServer'));
          addNotification({ type: 'error', message: i18n.t('error.internalServer') });
        }
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professional, year, userId, refresh]);

  useEffect(() => {
    setErrorMessage(i18n.t('error.internalServer'));
  }, [i18n.language, i18n]);

  return (
    <main>
      <Card className='flex w-full flex-col gap-3'>
        <section className='flex flex-row items-center space-x-4 border-b border-slate-200 p-4'>
          <CalendarClock size={18} strokeWidth={2} />
          <span className='text-base font-semibold'>{t('cardTitle.appointmentsRecord')}</span>
        </section>
        <CardContent className='flex flex-col gap-3'>
          <ApposFilters userId={userId} disabled={disabledFilters} />
          {isLoading && <LoadingDB variant='default' text={t('loading.appointments')} className='pt-4' />}
          {!error ? (
            appointments.length > 0 ? (
              !isLoading && <ApposTable appointments={appointments} setRefresh={setRefresh} />
            ) : (
              <InfoCard type='warning' text={t('warning.emptyAppointments')} className='pt-5' />
            )
          ) : (
            <InfoCard type='error' text={errorMessage} className='pt-5' />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
