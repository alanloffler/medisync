// Icons: https://lucide.dev/icons/
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react';
// External imports
import { useEffect, useState } from 'react';
// Components
import { Statistic } from '@dashboard/components/Statistic';
// Imports
import { DashboardApiService } from '@dashboard/services/dashboard-api.service';
import { useDelimiter } from '@core/hooks/useDelimiter';
// React component
export function StatisticGroup() {
  const [userStats, setUserStats] = useState<{ value1: string; value2: string }>({ value1: '', value2: '' });
  const delimiter = useDelimiter();

  useEffect(() => {
    DashboardApiService.countAll().then((response) => {
      console.log(response);
      setUserStats(response.data);
    });
  }, []);

  return (
    <main className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
      <Statistic content='Total Revenue' title='Revenue' value='$45,231.89'>
        <DollarSign className='h-4 w-4 text-muted-foreground' />
      </Statistic>
      <Statistic content={`${userStats.value2} nuevos este mes`} title='Pacientes' value={delimiter(userStats.value1, '.', 3)}>
        <Users className='h-4 w-4 text-muted-foreground' />
      </Statistic>
      <Statistic content='+19% from last month' title='Sales' value='+12,234'>
        <CreditCard className='h-4 w-4 text-muted-foreground' />
      </Statistic>
      <Statistic content='+201 since last hour' title='Active Now' value='+573'>
        <Activity className='h-4 w-4 text-muted-foreground' />
      </Statistic>
    </main>
  );
}
