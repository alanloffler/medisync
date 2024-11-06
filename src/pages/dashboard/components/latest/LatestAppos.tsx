// Icons: https://lucide.dev/icons/
import { CalendarClock, CalendarPlus } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent } from '@core/components/ui/card';
// External imports
import { format } from '@formkit/tempo';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
import { DashboardApiService } from '@dashboard/services/dashboard-api.service';
import { USER_CREATE_CONFIG } from '@config/user.config';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useDelimiter } from '@core/hooks/useDelimiter';
import { useNavigate } from 'react-router-dom';
// React component
export function LatestAppos() {
  const capitalize = useCapitalize();
  const delimiter = useDelimiter();
  const navigate = useNavigate();

  const { data: latestAppos } = useQuery<IResponse>({
    queryKey: ['latestAppos'],
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
      <h2 className='text-xl font-medium text-dark-default'>{DASHBOARD_CONFIG.latestAppos.title}</h2>
      <Card>
        <CardContent className='grid gap-2 pt-6'>
          {latestAppos &&
            latestAppos.data.map((appo: IAppointmentView) => (
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
                    <p className='text-[11px] font-light'>{format(appo.createdAt, 'DD/MM')}</p>
                  </motion.div>
                  <motion.div variants={animation.user} className='flex flex-col text-left'>
                    <p className='font-bold text-dark-default'>{`${capitalize(appo.user.firstName)} ${capitalize(appo.user.lastName)}`}</p>
                    <p className='text-xs font-light text-muted-foreground'>{`${USER_CREATE_CONFIG.labels.dni} ${delimiter(appo.user.dni, '.', 3)}`}</p>
                  </motion.div>
                </div>
                <div className='mr-2 flex w-1/2 flex-row items-center justify-end space-x-3 text-xs'>
                  <motion.div variants={animation.professional} className='hidden flex-col text-right md:flex lg:flex xl:flex'>
                    <p className='font-bold text-dark-default'>{`${capitalize(appo.professional.title.abbreviation)} ${capitalize(appo.professional.firstName)} ${capitalize(appo.professional.lastName)}`}</p>
                    <p className='text-xs font-light text-muted-foreground'>{capitalize(appo.professional.specialization.name)}</p>
                  </motion.div>
                  <motion.div
                    variants={animation.item}
                    className='flex flex-row items-center space-x-2 rounded-sm bg-emerald-100 p-1 pr-2 text-emerald-600'
                  >
                    <CalendarClock size={16} strokeWidth={1.5} />
                    <p>{`${format(appo.day, 'DD/MM')} - ${appo.hour}`}</p>
                  </motion.div>
                </div>
              </motion.button>
            ))}
        </CardContent>
      </Card>
    </main>
  );
}
