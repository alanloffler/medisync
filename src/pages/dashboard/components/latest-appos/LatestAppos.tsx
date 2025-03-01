// Icons: https://lucide.dev/icons/
import { Clock, CalendarPlus } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardFooter } from '@core/components/ui/card';
// Components
import { DashboardTitle } from '@dashboard/components/common/DashboardTitle';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { format } from '@formkit/tempo';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { DashboardApiService } from '@dashboard/services/dashboard-api.service';
import { UtilsString } from '@core/services/utils/string.service';
// React component
export function LatestAppos() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const {
    data: latestAppos,
    error,
    isLoading,
  } = useQuery<IResponse>({
    queryKey: ['latest-appos'],
    queryFn: async () => {
      return await DashboardApiService.latestAppointments(5);
    },
  });

  const animation = {
    item: {
      initial: { scale: 1 },
      animate: { scale: 1.1 },
    },
    professional: {
      initial: { x: 0 },
      animate: { x: -5 },
    },
    user: {
      initial: { x: 0 },
      animate: { x: 5 },
    },
  };

  return (
    <main className='space-y-2'>
      <DashboardTitle title={t('cardTitle.dashboard.latestAppointments')} />
      <Card>
        <CardContent className='grid gap-2 pt-6'>
          {isLoading && <LoadingDB text={t('loading.appointments')} variant='default' />}
          {error && <InfoCard text={error.message} type='error' />}
          {!isLoading &&
            !error &&
            latestAppos?.data.map((appo: IAppointmentView) => (
              <motion.button
                className='flex flex-row items-center justify-between gap-4 rounded-md border border-slate-200 p-3 text-sm'
                key={crypto.randomUUID()}
                onClick={() => navigate(`/appointments/${appo._id}`)}
                initial='initial'
                animate='initial'
                whileHover='animate'
              >
                <div className='flex w-1/2 flex-row items-center space-x-3'>
                  <motion.div
                    variants={animation.item}
                    className='flex h-11 w-11 flex-col items-center rounded-sm bg-slate-600 pt-1.5 text-slate-200'
                  >
                    <CalendarPlus size={16} strokeWidth={2} />
                    <p className='text-[11px] font-light'>{format(appo.createdAt, 'short', i18n.resolvedLanguage).slice(0, -3)}</p>
                  </motion.div>
                  <motion.div variants={animation.user} className='flex flex-col text-left'>
                    <p className='font-bold text-dark-default'>{UtilsString.upperCase(`${appo.user.firstName} ${appo.user.lastName}`, 'each')}</p>
                    <p className='text-xs font-light text-muted-foreground'>{`${t('label.identityCard')} ${i18n.format(appo.user.dni, 'integer', i18n.resolvedLanguage)}`}</p>
                  </motion.div>
                </div>
                <div className='mr-2 flex w-1/2 flex-row items-center justify-end space-x-3 text-xs'>
                  <motion.div variants={animation.professional} className='hidden flex-col text-right md:flex lg:flex xl:flex'>
                    <p className='font-bold text-dark-default'>
                      {UtilsString.upperCase(
                        `${appo.professional.title.abbreviation} ${appo.professional.firstName} ${appo.professional.lastName}`,
                        'each',
                      )}
                    </p>
                    <p className='text-xs font-light text-muted-foreground'>{UtilsString.upperCase(appo.professional.specialization.name)}</p>
                  </motion.div>
                  <motion.div
                    variants={animation.item}
                    className='flex flex-row items-center space-x-1 rounded-sm bg-emerald-100 p-1 pr-2 text-emerald-600'
                  >
                    <Clock size={16} strokeWidth={1.5} />
                    <p>{appo.hour}</p>
                  </motion.div>
                </div>
              </motion.button>
            ))}
        </CardContent>
        <CardFooter className='flex justify-end'>
          <Button className='p-0 text-sm text-foreground' size='sm' variant='link' onClick={() => navigate('/appointments')}>
            {t('button.seeMore')}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
