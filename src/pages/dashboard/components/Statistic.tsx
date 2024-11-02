// Icons: https://lucide.dev/icons/
import { DollarSign } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent, CardHeader, CardTitle } from '@core/components/ui/card';
// Imports
import type { IStatistic } from '@dashboard/interfaces/statistic.interface';
// React component
export function Statistic({ content, title, value }: IStatistic) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <DollarSign className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{content}</p>
      </CardContent>
    </Card>
  );
}
