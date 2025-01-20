// Icons: https://lucide.dev/icons/
import { CalendarCheck, Users } from 'lucide-react';
import { HealthBadgeId } from '@core/components/icons/HealthIcons';
// Components
import { AppoFlowCard } from '@appointments/components/AppoFlowCard';
import { DashboardTitle } from '@dashboard/components/common/DashboardTitle';
import { Statistic } from '@dashboard/components/statistics/Statistic';
import { StatisticChart } from '@dashboard/components/statistics/StatisticChart';
// External imports
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import { DASHBOARD_CONFIG } from '@config/dashboard/dashboard.config';
import { DashboardApiService } from '@dashboard/services/dashboard-api.service';
// React component
export function StatisticGroup() {
  const { t } = useTranslation();

  const {
    data: apposData,
    error: apposError,
    isLoading: apposDataIsLoading,
  } = useQuery({
    queryKey: ['dashboard', 'appos'],
    queryFn: async () => await DashboardApiService.countAppointments(),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 0,
  });

  const {
    data: usersData,
    error: usersError,
    isLoading: usersDataIsLoading,
  } = useQuery({
    queryKey: ['dashboard', 'users'],
    queryFn: async () => await DashboardApiService.countUsers(),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 0,
  });

  const {
    data: professionalsData,
    error: professionalsError,
    isLoading: professionalsDataIsLoading,
  } = useQuery({
    queryKey: ['dashboard', 'professionals'],
    queryFn: async () => await DashboardApiService.countProfessionals(),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 0,
  });

  return (
    <section className='flex flex-col space-y-2'>
      <DashboardTitle title={t('cardTitle.dashboard.statistics')} />
      <section className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-8'>
        <AppoFlowCard />
        <Statistic
          content={DASHBOARD_CONFIG.statisticGroup.items[0].content}
          error={apposError}
          isLoading={apposDataIsLoading}
          path={DASHBOARD_CONFIG.statisticGroup.items[0].path}
          title={DASHBOARD_CONFIG.statisticGroup.items[0].title}
          value1={apposData?.data?.value1}
          value2={apposData?.data?.value2}
        >
          <div className='rounded-full bg-fuchsia-100 p-2'>
            <CalendarCheck size={18} strokeWidth={2} className='text-fuchsia-400' />
          </div>
        </Statistic>
        <Statistic
          content={DASHBOARD_CONFIG.statisticGroup.items[2].content}
          error={usersError}
          isLoading={usersDataIsLoading}
          path={DASHBOARD_CONFIG.statisticGroup.items[2].path}
          title={DASHBOARD_CONFIG.statisticGroup.items[2].title}
          value1={usersData?.data?.value1}
          value2={usersData?.data?.value2}
        >
          <div className='rounded-full bg-sky-100 p-2'>
            <Users size={18} strokeWidth={2} className='text-sky-400' />
          </div>
        </Statistic>
        <Statistic
          content={DASHBOARD_CONFIG.statisticGroup.items[1].content}
          error={professionalsError}
          isLoading={professionalsDataIsLoading}
          path={DASHBOARD_CONFIG.statisticGroup.items[1].path}
          title={DASHBOARD_CONFIG.statisticGroup.items[1].title}
          value1={professionalsData?.data?.value1}
          value2={professionalsData?.data?.value2}
        >
          <div className='rounded-full bg-emerald-100 p-2'>
            <HealthBadgeId size={18} strokeWidth={2} className='text-emerald-400' />
          </div>
        </Statistic>
        <StatisticChart
          fetchChartData={async (days) => await DashboardApiService.apposDaysCount(days)}
          height={DASHBOARD_CONFIG.statisticGroup.charts[0].height}
          labels={DASHBOARD_CONFIG.statisticGroup.charts[0].label}
          margin={DASHBOARD_CONFIG.statisticGroup.charts[0].margin}
          options={DASHBOARD_CONFIG.statisticGroup.charts[0].options}
          path={DASHBOARD_CONFIG.statisticGroup.charts[0].path}
          title={DASHBOARD_CONFIG.statisticGroup.charts[0].title}
        />
      </section>
    </section>
  );
}
