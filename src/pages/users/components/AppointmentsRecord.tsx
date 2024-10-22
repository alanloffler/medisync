// External imports
import { useEffect, useState } from 'react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
// Components
import { InfoCard } from '@/core/components/common/InfoCard';
import { LoadingDB } from '@/core/components/common/LoadingDB';
// External imports
import { format } from '@formkit/tempo';
// Imports
import type { IAppointmentView } from '@/pages/appointments/interfaces/appointment.interface';
import type { IResponse } from '@/core/interfaces/response.interface';
import { APP_CONFIG } from '@/config/app.config';
import { AppointmentApiService } from '@/pages/appointments/services/appointment.service';
import { USER_VIEW_CONFIG } from '@/config/user.config';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { Button } from '@/core/components/ui/button';
// React component
export function AppointmentsRecord({ userId, loaderText }: { userId: string; loaderText?: string }) {
  const [appointments, setAppointments] = useState<IAppointmentView[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const capitalize = useCapitalize();

  useEffect(() => {
    if (userId) {
      setIsLoading(true);

      AppointmentApiService.findAllByUser(userId)
        .then((response: IResponse) => {
          if (response.statusCode === 200) {
            response.data.length > 0 ? setAppointments(response.data) : setErrorMessage(response.message);
          }
          if (response.statusCode > 399) {
            setIsError(true);
            setErrorMessage(response.message);
          }
          if (response instanceof Error) {
            setIsError(true);
            setErrorMessage(APP_CONFIG.error.server);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{USER_VIEW_CONFIG.appointmentRecords.title}</CardTitle>
      </CardHeader>
      {isLoading ? (
        <LoadingDB text={loaderText || 'Loading data'} className='pb-4 pt-2' />
      ) : (
        <CardContent className='px-3 pb-3'>
          {isError ? (
            <InfoCard type='error' text={errorMessage} className='p-0 pt-3' />
          ) : appointments.length > 0 ? (
            appointments?.map((appointment, index) => (
              <div key={crypto.randomUUID()} className={`flex flex-row items-center justify-between p-1 text-sm ${index % 2 === 0 && 'bg-slate-100/80'}`}>
                <div className='flex flex-row items-center w-3/4'>
                  <div className='w-1/4'>{format(appointment.day, 'DD/MM/YYYY')}</div>
                  <div className='w-3/4'>{`${capitalize(appointment.professional.title.abbreviation)} ${capitalize(appointment.professional.lastName)}, ${capitalize(appointment.professional.firstName)}`}</div>
                </div>
                <div className='w-1/4 justify-end'>
                  <Button>Ver</Button>
                </div>
              </div>
            ))
          ) : (
            <InfoCard type='warning' text={errorMessage} className='p-0 pt-3' />
          )}
        </CardContent>
      )}
    </Card>
  );
}
