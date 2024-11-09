// Icons: https://lucide.dev
import { CalendarPlus } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent } from '@core/components/ui/card';
// External imports
import { format } from '@formkit/tempo';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
import { DashboardApiService } from '@dashboard/services/dashboard-api.service';
import { useCapitalize } from '@core/hooks/useCapitalize';
// React component
export function LatestUsers() {
  const capitalize = useCapitalize();

  const { data: latestUsers } = useQuery<IResponse>({
    queryKey: ['dashboard', 'latestUsers'],
    queryFn: async () => {
      return await DashboardApiService.latestUsers(5);
    },
  });

  return (
    <main className='space-y-2'>
      <h2 className='text-xl font-medium text-dark-default'>{DASHBOARD_CONFIG.latestUsers.title}</h2>
      <Card>
        <CardContent className='grid space-y-2 pt-6'>
          {latestUsers?.data.map((user: IUser) => (
            <button className='flex flex-row items-center justify-between space-x-2 text-sm'>
              <span className='w-full px-1 py-0.5 text-left font-medium text-dark-default'>{`${capitalize(user.firstName)} ${capitalize(user.lastName)}`}</span>
              <div className='flex flex-row items-center space-x-2 rounded-sm bg-orange-200 p-1 pr-2 text-orange-700'>
                <CalendarPlus size={16} strokeWidth={1.5} />
                <p className='text-xs'>{format(user.createdAt, 'DD/MM/YY')}</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
