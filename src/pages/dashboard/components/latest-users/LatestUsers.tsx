// Icons: https://lucide.dev
import { CircleChevronRight, CalendarPlus } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { DashboardTitle } from '@dashboard/components/common/DashboardTitle';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
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

  const {
    data: latestUsers,
    error,
    isLoading,
  } = useQuery<IResponse>({
    queryKey: ['dashboard', 'latestUsers'],
    queryFn: async () => {
      return await DashboardApiService.latestUsers(5);
    },
    retry: 1,
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
      <DashboardTitle title={DASHBOARD_CONFIG.latestUsers.title} />
      <Card>
        <CardContent className='flex flex-col space-y-1 pt-6'>
          {error && <InfoCard text={error.message} type='error' />}
          {isLoading && <LoadingDB text={DASHBOARD_CONFIG.latestUsers.loadingText} variant='default' />}
          {!error &&
            !isLoading &&
            latestUsers?.data.map((user: IUser) => (
              <motion.button
                className='-ml-6 flex flex-row items-center justify-between space-x-2 p-1 text-sm'
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
                  <p className='text-xs'>{`${format(user.createdAt, 'DD')} ${capitalize(format(user.createdAt, 'MMM'))}`}</p>
                </motion.div>
              </motion.button>
            ))}
        </CardContent>
      </Card>
    </main>
  );
}
