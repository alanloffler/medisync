// Components
import { ApposFilters } from '@appointments/components/ApposFilters';
import { ApposList } from '@appointments/components/ApposList';
// External imports
import { useEffect, useState } from 'react';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { useApposFilters } from '@appointments/hooks/useApposFilters';
// TODO: put in an interface file
export interface IApposRecord {
  userId: string;
}
// React component
export function ApposRecord({ userId }: IApposRecord) {
  const [appointments, setAppointments] = useState<IAppointmentView[]>([]);
  const { professional } = useApposFilters();

  useEffect(() => {
    AppointmentApiService.findAllByUser(userId).then((response: IResponse) => {
      if (response.statusCode === 200) {
        if (response.data.length > 0) {
          setAppointments(response.data);
        }
      }
    });
  }, [userId]);

  useEffect(() => {
    if (professional) {
      AppointmentApiService.findAllByUserAndProfessional(userId, professional).then((response: IResponse) => {
        if (response.statusCode === 200) {
          if (response.data.length > 0) {
            setAppointments(response.data);
          }
        }
      });
    }
  }, [professional]);

  return (
    <main>
      <header>ApposRecord component for {userId}</header>
      <section>
        <ApposFilters appointments={appointments} />
        {appointments && <ApposList appointments={appointments} />}
      </section>
    </main>
  );
}
