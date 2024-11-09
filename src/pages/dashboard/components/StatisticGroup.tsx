// Icons: https://lucide.dev/icons/
import { Activity, CalendarCheck, CreditCard, Users } from 'lucide-react';
// Components
import { Statistic } from '@dashboard/components/Statistic';
// External imports
import { useQuery } from '@tanstack/react-query';
// Imports
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
import { DashboardApiService } from '@dashboard/services/dashboard-api.service';
import { useDelimiter } from '@core/hooks/useDelimiter';
// React component
export function StatisticGroup() {
  const delimiter = useDelimiter();

  const {
    data: apposData,
    error: apposError,
    isLoading: apposDataIsLoading,
  } = useQuery({
    queryKey: ['dashboard', 'appos'],
    queryFn: async () => {
      return await DashboardApiService.countAppointments();
    },
    gcTime: 0, // No cached
  });

  const {
    data: usersData,
    error: usersError,
    isLoading: usersDataIsLoading,
  } = useQuery({
    queryKey: ['dashboard', 'users'],
    queryFn: async () => {
      return await DashboardApiService.countAllUsers();
    }, // Cached by default
  });

  return (
    <main className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
      <Statistic
        content={DASHBOARD_CONFIG.statisticGroup.items[0].content}
        error={apposError}
        isLoading={apposDataIsLoading}
        title={DASHBOARD_CONFIG.statisticGroup.items[0].title}
        value1={apposData?.data?.value1}
        value2={apposData?.data?.value2}
      >
        <CalendarCheck size={24} strokeWidth={2} className='text-fuchsia-400' />
      </Statistic>
      <Statistic
        content={DASHBOARD_CONFIG.statisticGroup.items[1].content}
        error={usersError}
        isLoading={usersDataIsLoading}
        title={DASHBOARD_CONFIG.statisticGroup.items[1].title}
        value1={delimiter(usersData?.data?.value1, '.', 3)}
        value2={usersData?.data?.value2}
      >
        <Users size={24} strokeWidth={2} className='text-sky-400' />
      </Statistic>
      <Statistic content='from last month' title='Sales' value1='12234' value2='19'>
        <CreditCard size={24} strokeWidth={2} className='text-emerald-400' />
      </Statistic>
      <Statistic content='since last hour' title='Active Now' value1='573' value2='201'>
        <Activity size={24} strokeWidth={2} className='text-rose-400' />
      </Statistic>
    </main>
  );
}
