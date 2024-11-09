// Icons: https://lucide.dev
import { CircleChevronRight, CalendarPlus } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent } from '@core/components/ui/card';
// External imports
import { format } from '@formkit/tempo';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const { data: latestUsers } = useQuery<IResponse>({
    queryKey: ['dashboard', 'latestUsers'],
    queryFn: async () => {
      return await DashboardApiService.latestUsers(5);
    },
  });

  const animation = {
    arrow: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    date: {
      initial: { x: 0 },
      animate: { x: -5 },
    },
    user: {
      initial: { x: 0 },
      animate: { x: 15 },
    },
  };

  return (
    <main className='space-y-2'>
      <h2 className='text-xl font-medium text-dark-default'>{DASHBOARD_CONFIG.latestUsers.title}</h2>
      <Card>
        <CardContent className='flex flex-col space-y-1 pl-0 pt-6'>
          {latestUsers?.data.map((user: IUser) => (
            <motion.button
              className='flex flex-row items-center justify-between space-x-2 p-1 text-sm'
              key={crypto.randomUUID()}
              onClick={() => navigate(`/users/${user._id}`)}
              animate='initial'
              initial='initial'
              whileHover='animate'
            >
              <motion.div variants={animation.user} className='flex items-center space-x-2 py-0.5 text-left font-medium text-dark-default'>
                <motion.span variants={animation.arrow}>
                  <CircleChevronRight size={16} strokeWidth={1.5} />
                </motion.span>
                <span>{`${capitalize(user.firstName)} ${capitalize(user.lastName)}`}</span>
              </motion.div>
              <motion.div
                variants={animation.date}
                className='flex w-fit flex-row items-center space-x-2 rounded-sm bg-orange-200 p-1 pr-2 text-orange-700'
              >
                <CalendarPlus size={16} strokeWidth={1.5} />
                <p className='text-xs'>{format(user.createdAt, 'DD MMM')}</p>
              </motion.div>
            </motion.button>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
