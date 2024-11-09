// Icons: https://lucide.dev/icons/
import { Activity, CalendarCheck, Users } from 'lucide-react';
import { HealthBadgeId } from '@core/components/icons/HealthIcons';
// Components
import { Statistic } from '@dashboard/components/statistics/Statistic';
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
  });

  const {
    data: usersData,
    error: usersError,
    isLoading: usersDataIsLoading,
  } = useQuery({
    queryKey: ['dashboard', 'users'],
    queryFn: async () => {
      return await DashboardApiService.countUsers();
    },
  });

  const {
    data: professionalsData,
    error: professionalsError,
    isLoading: professionalsDataIsLoading,
  } = useQuery({
    queryKey: ['dashboard', 'professionals'],
    queryFn: async () => {
      return await DashboardApiService.countProfessionals();
    },
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
      <Statistic
        content={DASHBOARD_CONFIG.statisticGroup.items[1].content}
        error={professionalsError}
        isLoading={professionalsDataIsLoading}
        title={DASHBOARD_CONFIG.statisticGroup.items[2].title}
        value1={professionalsData?.data?.value1}
        value2={professionalsData?.data?.value2}
      >
        <HealthBadgeId size={24} strokeWidth={2} className='text-emerald-400' />
      </Statistic>
      {/* <Statistic content='since last hour' title='Active Now' value1='573' value2='201'>
        <Activity size={24} strokeWidth={2} className='text-rose-400' />
      </Statistic> */}
    </main>
  );
}
