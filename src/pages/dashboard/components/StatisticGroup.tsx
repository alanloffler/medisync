// Icons: https://lucide.dev/icons/
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react';
// Imports
import { Statistic } from '@dashboard/components/Statistic';
// React component
export function StatisticGroup() {
  return (
    <main className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
      <Statistic content='Total Revenue' title='Revenue' value='$45,231.89'>
        <DollarSign className='h-4 w-4 text-muted-foreground' />
      </Statistic>
      <Statistic content='47 nuevos este mes' title='Pacientes' value='2350'>
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
