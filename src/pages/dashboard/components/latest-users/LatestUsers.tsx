// Icons: https://lucide.dev
import { CircleChevronRight, CalendarPlus } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { DashboardTitle } from '@dashboard/components/common/DashboardTitle';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { AxiosError } from 'axios';
import { format } from '@formkit/tempo';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IError } from '@core/interfaces/error.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { APP_CONFIG } from '@config/app.config';
import { DashboardApiService } from '@dashboard/services/dashboard-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useEffect } from 'react';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export function LatestUsers() {
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const {
    data: latestUsers,
    error,
    isError,
    isLoading,
  } = useQuery<IResponse<IUser[]>, AxiosError<IError>>({
    queryKey: ['dashboard', 'latestUsers'],
    queryFn: async () => await DashboardApiService.latestUsers(5),
  });

  useEffect(() => {
    if (isError)
      addNotification({
        message: error.response?.data.message,
        type: error.response?.data.statusCode === 404 ? 'warning' : 'error',
      });
  }, [addNotification, error, isError]);

  const animation = {
    arrow: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    date: {
      initial: { x: 0 },
      animate: { x: -5 },
    },
    line: {
      initial: { scaleX: 1, x: 0 },
      animate: { scaleX: 0.9, x: 5 },
    },
    user: {
      initial: { x: 0 },
      animate: { x: 15 },
    },
  };

  return (
    <main className='space-y-2'>
      <DashboardTitle title={t('cardTitle.dashboard.latestUsers')} />
      <Card>
        <CardContent className='flex flex-col space-y-1 pt-6'>
          {isError && <InfoCard text={error.response?.data.message} variant={error.response?.data.statusCode === 404 ? 'warning' : 'error'} />}
          {isLoading && <LoadingDB text={t('loading.users')} variant='default' />}
          {!error &&
            !isLoading &&
            latestUsers?.data.map((user: IUser) => (
              <motion.button
                className='-ml-6 flex flex-row items-center space-x-3 p-1 text-sm'
                key={crypto.randomUUID()}
                onClick={() => navigate(`${APP_CONFIG.appPrefix}/users/${user._id}`)}
                animate='initial'
                initial='initial'
                whileHover='animate'
              >
                <motion.div variants={animation.user} className='flex items-center space-x-2 py-0.5 text-left font-medium text-dark-default'>
                  <motion.span variants={animation.arrow}>
                    <CircleChevronRight size={16} strokeWidth={1.5} />
                  </motion.span>
                  <span>{UtilsString.upperCase(`${user.firstName} ${user.lastName}`, 'each')}</span>
                </motion.div>
                <motion.div className='h-[1px] grow bg-slate-200' variants={animation.line}></motion.div>
                <motion.div
                  variants={animation.date}
                  className='flex flex-row items-center space-x-2 rounded-sm bg-orange-200 p-1 pr-2 text-orange-700'
                >
                  <CalendarPlus size={16} strokeWidth={1.5} />
                  <p className='text-xs'>
                    {UtilsString.upperCase(
                      `${format(user.createdAt, 'medium', i18n.resolvedLanguage).split(' ')[0]} ${format(user.createdAt, 'medium', i18n.resolvedLanguage).split(' ')[1].replace(',', '')}`,
                      'each',
                    )}
                  </p>
                </motion.div>
              </motion.button>
            ))}
        </CardContent>
      </Card>
    </main>
  );
}
