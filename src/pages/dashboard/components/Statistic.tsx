// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent, CardHeader, CardTitle } from '@core/components/ui/card';
// Imports
import type { IStatistic } from '@dashboard/interfaces/statistic.interface';
// React component
export function Statistic({ children, content, title, value1, value2 }: IStatistic) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='flex bg-primary px-2 py-1 text-primary-foreground'>
          <span className='text-xsm font-medium'>{title}</span>
        </CardTitle>
        {children}
      </CardHeader>
      <CardContent>
        {value1 || value2 ? (
          <>
            <div className='text-dark-default text-2xl font-bold'>{value1}</div>
            <p className='text-dark-default text-xs'>{`${value2} ${content}`}</p>
          </>
        ) : (
          <div className='pt-4 text-sm font-medium text-rose-500'>Error cargando estadística</div>
        )}
      </CardContent>
    </Card>
  );
}
