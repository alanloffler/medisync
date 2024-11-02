// Icons: https://lucide.dev/icons/
import { Activity, CalendarCheck, CreditCard, Users } from 'lucide-react';
// External imports
import { useEffect, useState } from 'react';
// Components
import { Statistic } from '@dashboard/components/Statistic';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import { DashboardApiService } from '@dashboard/services/dashboard-api.service';
import { useDelimiter } from '@core/hooks/useDelimiter';
// React component
export function StatisticGroup() {
  const [apposStats, setApposStats] = useState<IResponse>({} as IResponse);
  const [userStats, setUserStats] = useState<IResponse>({} as IResponse);
  const delimiter = useDelimiter();

  useEffect(() => {
    // TODO: handle errors
    DashboardApiService.countAppointments().then((response: IResponse) => {
      if (response.statusCode === 200) setApposStats(response);
    });

    DashboardApiService.countAllUsers().then((response: IResponse) => {
      if (response.statusCode === 200) setUserStats(response);
      if (response.statusCode > 399) setUserStats({ statusCode: response.statusCode, message: response.message, data: undefined });
    });
  }, []);

  return (
    <main className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
      <Statistic content='el último mes' title='Turnos' value1={apposStats.data?.value1} value2={apposStats.data?.value2}>
        <CalendarCheck size={24} strokeWidth={2} className='text-fuchsia-400' />
      </Statistic>
      <Statistic content={`${userStats.data?.value2} nuevos este mes`} title='Pacientes' value1={delimiter(userStats.data?.value1, '.', 3)} value2=''>
        <Users size={24} strokeWidth={2} className='text-sky-400' />
      </Statistic>
      <Statistic content='from last month' title='Sales' value1='+12,234' value2='+19%'>
        <CreditCard size={24} strokeWidth={2} className='text-emerald-400' />
      </Statistic>
      <Statistic content='since last hour' title='Active Now' value1='+573' value2='+201'>
        <Activity size={24} strokeWidth={2} className='text-rose-400' />
      </Statistic>
    </main>
  );
}
