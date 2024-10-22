// External imports
import { useEffect, useState } from 'react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
// Components
import { LoadingDB } from '@/core/components/common/LoadingDB';
// Imports
import type { IAppointment } from '@/pages/appointments/interfaces/appointment.interface';
import type { IResponse } from '@/core/interfaces/response.interface';
import { AppointmentApiService } from '@/pages/appointments/services/appointment.service';
import { USER_VIEW_CONFIG } from '@/config/user.config';
// React component
export function AppointmentsRecord({ userId, loaderText }: { userId: string; loaderText?: string }) {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);

      AppointmentApiService.findAllByUser(userId)
        .then((response: IResponse) => {
          // TODO: handle errors
          if (response.statusCode === 200) {
            setAppointments(response.data);
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
        <CardContent>
          {appointments.length > 0
            ? appointments?.map((appointment) => <div key={crypto.randomUUID()}>{appointment.day}</div>)
            : USER_VIEW_CONFIG.appointmentRecords.noAppointments}
        </CardContent>
      )}
    </Card>
  );
}
