// Icons: https://lucide.dev/icons/
import { CalendarClock, CalendarPlus } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent, CardHeader, CardTitle } from '@core/components/ui/card';
// External imports
import { format } from '@formkit/tempo';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
import { DashboardApiService } from '@dashboard/services/dashboard-api.service';
import { USER_CREATE_CONFIG } from '@config/user.config';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useDelimiter } from '@core/hooks/useDelimiter';
// React component
export function LatestAppos() {
  const capitalize = useCapitalize();
  const delimiter = useDelimiter();

  const { data: latestAppos } = useQuery<IResponse>({
    queryKey: ['latestAppos'],
    queryFn: async () => {
      return await DashboardApiService.latestAppointments(5);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{DASHBOARD_CONFIG.latestAppos.title}</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-2'>
        {latestAppos &&
          latestAppos.data.map((appo: IAppointmentView) => (
            <section className='flex flex-row items-center justify-between gap-4 rounded-md border border-slate-200 p-3 text-sm'>
              <div className='flex w-1/2 flex-row items-center space-x-3'>
                <div className='flex h-11 w-11 flex-col items-center rounded-sm bg-slate-600 pt-1.5 text-slate-200'>
                  <CalendarPlus size={16} strokeWidth={2} />
                  <p className='text-[11px] font-light'>{format(appo.createdAt, 'DD/MM')}</p>
                </div>
                <div className='flex flex-col'>
                  <p className='font-bold text-dark-default'>{`${capitalize(appo.user.firstName)} ${capitalize(appo.user.lastName)}`}</p>
                  <p className='text-xs font-light text-muted-foreground'>{`${USER_CREATE_CONFIG.labels.dni} ${delimiter(appo.user.dni, '.', 3)}`}</p>
                </div>
              </div>
              <div className='mr-2 flex w-1/2 flex-row items-center justify-end space-x-3 text-xs'>
                <div className='flex flex-col text-right'>
                  <p className='font-bold text-dark-default'>{`${capitalize(appo.professional.title.abbreviation)} ${capitalize(appo.professional.firstName)} ${capitalize(appo.professional.lastName)}`}</p>
                  <p className='text-xs font-light text-muted-foreground'>{capitalize(appo.professional.specialization.name)}</p>
                </div>
                <div className='flex flex-row items-center space-x-2 rounded-sm bg-slate-200 p-1 pr-2 text-slate-600'>
                  <CalendarClock size={16} strokeWidth={1.5} />
                  <p>{`${format(appo.day, 'DD/MM')} - ${appo.hour}`}</p>
                </div>
              </div>
            </section>
          ))}
      </CardContent>
    </Card>
  );
}
