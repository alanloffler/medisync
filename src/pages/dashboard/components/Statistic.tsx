// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent, CardHeader, CardTitle } from '@core/components/ui/card';
// Imports
import type { IStatistic } from '@dashboard/interfaces/statistic.interface';
// React component
export function Statistic({ children, content, title, value }: IStatistic) {
  return (
    <Card className='bg-dark-bg'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='flex bg-primary px-2 py-1 text-primary-foreground'>
          <span className='text-xsm font-medium'>{title}</span>
        </CardTitle>
        {children}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-primary'>{content}</p>
      </CardContent>
    </Card>
  );
}
