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
// React component
export function ApposRecord({ userId }: { userId: string }) {
  const [appointments, setAppointments] = useState<IAppointmentView[]>([]);
  const { professional, year } = useApposFilters();

  useEffect(() => {
    // TODO: manage error for all api calls
    AppointmentApiService.findApposRecordWithFilters(userId, professional, year).then((response: IResponse) => {
      if (response.statusCode === 200) {
        if (response.data.length > 0) {
          setAppointments(response.data);
        }
      }
    });
  }, [professional, year, userId]);

  return (
    <main>
      <section className='flex flex-col gap-3 w-full'>
        <ApposFilters userId={userId} />
        {appointments && <ApposList appointments={appointments} />}
      </section>
    </main>
  );
}
