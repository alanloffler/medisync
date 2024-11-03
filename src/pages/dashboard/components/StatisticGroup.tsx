// Icons: https://lucide.dev/icons/
import { Activity, CalendarCheck, CreditCard, Users } from 'lucide-react';
// Components
import { Statistic } from '@dashboard/components/Statistic';
// External imports
import { useQuery } from '@tanstack/react-query';
// Imports
import { DashboardApiService } from '@dashboard/services/dashboard-api.service';
import { useDelimiter } from '@core/hooks/useDelimiter';
// React component
export function StatisticGroup() {
  const delimiter = useDelimiter();

  const { data: apposData, isLoading: apposDataIsLoading } = useQuery({
    queryKey: ['appos'],
    queryFn: async () => DashboardApiService.countAppointments(),
    gcTime: 0 // No cached
  });

  const { data: usersData, isLoading: usersDataIsLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return await DashboardApiService.countAllUsers();
    }, // Cached by default
  });

  return (
    <main className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
      <Statistic
        content='el último mes'
        title='Turnos'
        value1={apposData?.data?.value1}
        value2={apposData?.data?.value2}
        isLoading={apposDataIsLoading}
      >
        <CalendarCheck size={24} strokeWidth={2} className='text-fuchsia-400' />
      </Statistic>
      <Statistic
        content='nuevos este mes'
        title='Pacientes'
        value1={delimiter(usersData?.data?.value1, '.', 3)}
        value2={usersData?.data?.value2}
        isLoading={usersDataIsLoading}
      >
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
