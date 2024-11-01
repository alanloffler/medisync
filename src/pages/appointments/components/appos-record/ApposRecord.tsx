// External components
import { Card, CardContent, CardHeader, CardTitle } from '@core/components/ui/card';
// Components
import { ApposFilters } from '@appointments/components/appos-record/ApposFilters';
import { ApposTable } from '@appointments/components/appos-record/ApposTable';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useEffect, useState } from 'react';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { APP_CONFIG } from '@config/app.config';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { USER_VIEW_CONFIG } from '@config/user.config';
import { useApposFilters } from '@appointments/hooks/useApposFilters';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export function ApposRecord({ userId }: { userId: string }) {
  const [appointments, setAppointments] = useState<IAppointmentView[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<string>('');
  const { professional, year, clearFilters } = useApposFilters();
  const addNotification = useNotificationsStore((state) => state.addNotification);

  useEffect(() => {
    setIsLoading(true);

    AppointmentApiService.findApposRecordWithFilters(userId, professional, year)
      .then((response: IResponse) => {
        if (response.statusCode === 200) {
          if (response.data.length > 0) {
            setAppointments(response.data);
          } else {
            setAppointments([]);
            clearFilters({ professional: undefined, year: undefined });
            // TODO: useState here setDisabledFilters and pass to ApposFilters and disabled selects if no appos found
          }
        }
        if (response.statusCode > 399) {
          setError(true);
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          setError(true);
          addNotification({ type: 'error', message: APP_CONFIG.error.server });
        }
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professional, year, userId, refresh]);

  return (
    <main>
      <Card className='flex w-full flex-col gap-3 border'>
        <CardHeader>
          <CardTitle>{USER_VIEW_CONFIG.apposRecord.title}</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-3'>
          <ApposFilters userId={userId} />
          {isLoading && <LoadingDB variant='default' text={USER_VIEW_CONFIG.apposRecord.table.loadingText} />}
          {!error ? (
            appointments.length > 0 ? (
              <ApposTable appointments={appointments} setRefresh={setRefresh} />
            ) : (
              <InfoCard type='warning' text={USER_VIEW_CONFIG.apposRecord.table.emptyList} className='pt-5' />
            )
          ) : (
            <InfoCard type='error' text={USER_VIEW_CONFIG.apposRecord.table.errorText} className='pt-5' />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
