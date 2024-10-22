// Icons: https://lucide.dev/icons/
import { FileText, Trash2 } from 'lucide-react';
// External imports
import { useEffect, useState } from 'react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
// Components
import { InfoCard } from '@/core/components/common/InfoCard';
import { LoadingDB } from '@/core/components/common/LoadingDB';
// External imports
import { format } from '@formkit/tempo';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IAppointmentView } from '@/pages/appointments/interfaces/appointment.interface';
import type { IResponse } from '@/core/interfaces/response.interface';
import { APP_CONFIG } from '@/config/app.config';
import { AppointmentApiService } from '@/pages/appointments/services/appointment.service';
import { USER_VIEW_CONFIG } from '@/config/user.config';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// React component
export function AppointmentsRecord({ userId, loaderText }: { userId: string; loaderText?: string }) {
  const [appointments, setAppointments] = useState<IAppointmentView[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const capitalize = useCapitalize();
  const navigate = useNavigate();

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

  function handleRemoveAppointment(id: string): void {
    console.log('Remove appointment Nº', id);
  }

  return (
    <Card className='border'>
      <CardHeader>
        <CardTitle className='border border-slate-600 bg-slate-500 text-white'>{USER_VIEW_CONFIG.appointmentRecords.title}</CardTitle>
      </CardHeader>
      {isLoading ? (
        <LoadingDB text={loaderText || 'Loading data'} className='pb-4 pt-2' />
      ) : (
        <CardContent className='px-3 pb-3'>
          <section className='mb-3 bg-primary/10 p-2 text-slate-500'>Here filters and search</section>
          <section className='flex font-medium text-sm border-b-2 pb-1'>
            <div className='flex w-3/4 items-center'>
              <div className='w-1/4 text-center'>{USER_VIEW_CONFIG.appointmentRecords.tableHeaders[0]}</div>
              <div className='w-3/4 text-center'>{USER_VIEW_CONFIG.appointmentRecords.tableHeaders[1]}</div>
            </div>
            <div className='w-1/4 text-center'>{USER_VIEW_CONFIG.appointmentRecords.tableHeaders[2]}</div>
          </section>
          {isError ? (
            <InfoCard type='error' text={errorMessage} className='p-0 pt-3' />
          ) : appointments.length > 0 ? (
            appointments?.map((appointment, index) => (
              <section
                key={crypto.randomUUID()}
                className={`flex flex-row items-center justify-between p-1.5 text-sm ${index % 2 === 0 && 'bg-slate-100/80'}`}
              >
                <section className='flex w-3/4 flex-row items-center'>
                  <div className='w-1/4 text-center'>{format(appointment.day, 'DD/MM/YYYY')}</div>
                  <div className='w-3/4'>{`${capitalize(appointment.professional.title.abbreviation)} ${capitalize(appointment.professional.lastName)}, ${capitalize(appointment.professional.firstName)}`}</div>
                </section>
                <section className='flex w-1/4 items-center justify-end space-x-1.5'>
                  <Button
                    variant='tableHeader'
                    size='miniIcon'
                    onClick={() => navigate(`/appointments/${appointment._id}`)}
                    className={`border border-slate-300 shadow-sm transition-all hover:scale-110 hover:border-fuchsia-500 hover:text-fuchsia-500 ${index % 2 === 0 ? 'bg-white hover:bg-white' : 'bg-slate-100 hover:bg-white'}`}
                  >
                    <FileText size={17} strokeWidth={1.5} />
                  </Button>
                  <Button
                    key={crypto.randomUUID()}
                    variant='tableHeader'
                    size='miniIcon'
                    onClick={() => handleRemoveAppointment(appointment._id)}
                    className={`border border-slate-300 shadow-sm transition-all hover:scale-110 hover:border-red-500 hover:text-red-500 ${index % 2 === 0 ? 'bg-white hover:bg-white' : 'bg-slate-100 hover:bg-white'}`}
                  >
                    <Trash2 size={17} strokeWidth={1.5} />
                  </Button>
                </section>
              </section>
            ))
          ) : (
            <InfoCard type='warning' text={errorMessage} className='p-0 pt-3' />
          )}
        </CardContent>
      )}
    </Card>
  );
}
