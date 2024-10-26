// Icons: https://lucide.dev/icons/
import { FileText, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
// Components
import { ApposDateSelect } from '@/pages/users/components/ApposDateSelect';
import { InfoCard } from '@/core/components/common/InfoCard';
import { LoadingDB } from '@/core/components/common/LoadingDB';
import { ProfessionalsSelect } from '@/pages/professionals/components/common/ProfessionalsSelect';
// External imports
import { format } from '@formkit/tempo';
import { spring } from 'framer-motion';
import { useAnimate } from 'framer-motion/mini';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// Imports
import type { IAppointmentView } from '@/pages/appointments/interfaces/appointment.interface';
import type { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import type { IResponse } from '@/core/interfaces/response.interface';
import { APP_CONFIG } from '@/config/app.config';
import { AppointmentApiService } from '@/pages/appointments/services/appointment.service';
import { USER_VIEW_CONFIG } from '@/config/user.config';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// React component
export function AppointmentsRecord({ userId, loaderText }: { userId: string; loaderText?: string }) {
  const [appointments, setAppointments] = useState<IAppointmentView[]>([]);
  const [defaultProfessionalId, setDefaultProfessionalId] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [professionalSelectKey, setProfessionalSelectKey] = useState<string>(crypto.randomUUID());
  const [professionals, setProfessionals] = useState<IProfessional[]>([]);
  const [selectKey, setSelectKey] = useState<string>(crypto.randomUUID());
  const [professionalScope, professionalAnimation] = useAnimate();
  const [searchParams, setSearchParams] = useSearchParams();
  const capitalize = useCapitalize();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      setIsLoading(true);

      AppointmentApiService.findAllByUser(userId)
        .then((response: IResponse) => {
          if (response.statusCode === 200) {
            if (response.data.length > 0) {
              setAppointments(response.data);

              const professionalsFiltered: IProfessional[] = response.data
                .map((appointment: IAppointmentView) => appointment.professional)
                .filter(
                  (professional: IProfessional, index: number, self: IProfessional[]) => index === self.findIndex((p) => p._id === professional._id),
                )
                .sort((a: IProfessional, b: IProfessional) => a.lastName.localeCompare(b.lastName));
              setProfessionals(professionalsFiltered);
            } else setErrorMessage(response.message);
          }
          if (response.statusCode > 399) {
            setIsError(true);
            setErrorMessage(response.message);
          }
          if (response instanceof Error) {
            setIsError(true);
            setErrorMessage(APP_CONFIG.error.server);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [userId, selectKey]);

  useEffect(() => {
    if (searchParams.get('pid') === null) {
      setSelectKey(crypto.randomUUID());
      searchParams.delete('pid');
    } else {
      handleSelectProfessional(searchParams.get('pid') as string);
      setDefaultProfessionalId(searchParams.get('pid') as string);
      setProfessionalSelectKey(crypto.randomUUID());
    }

    function handleSelectProfessional(professionalId: string): void {
      if (professionalId) {
        setIsLoading(true);

        AppointmentApiService.findAllByUserAndProfessional(userId, professionalId)
          .then((response: IResponse) => {
            if (response.statusCode === 200) {
              setAppointments(response.data);
              setSearchParams({ pid: professionalId });
              if (response.data.length === 0) setErrorMessage(response.message);
            }
            if (response.statusCode > 399) {
              setIsError(true);
              setErrorMessage(response.message);
            }
            if (response instanceof Error) {
              setIsError(true);
              setErrorMessage(APP_CONFIG.error.server);
            }
          })
          .finally(() => setIsLoading(false));
      }
    }
  }, [searchParams, setSearchParams, userId]);

  function clearProfessionalSelect(): void {
    setSelectKey(crypto.randomUUID());
    setDefaultProfessionalId(undefined);
    setSearchParams({});
  }

  function handleRemoveAppointment(id: string): void {
    console.log('Remove appointment Nº', id);
  }

  // TODO: handle error and loading
  function handleDateChange(year: string | undefined, month: string | undefined): void {
    if (year === undefined) setSelectKey(crypto.randomUUID());
    AppointmentApiService.findAllByUserAndYear(userId, year, month).then((response: IResponse) => {
      if (response.statusCode === 200) {
        setAppointments(response.data);
      }
    });
  }

  return (
    <Card className='border'>
      <CardHeader>
        <CardTitle className='border border-slate-600 bg-slate-500 text-white'>{USER_VIEW_CONFIG.appointmentsRecord.title}</CardTitle>
      </CardHeader>
      <CardContent className='px-3 pb-3'>
        {/* Section: Filters */}
        <section className='mb-3 flex flex-row items-center space-x-3 bg-primary/10 p-2 text-slate-500'>
          <div className='flex w-1/2 flex-row items-center space-x-2'>
            <ProfessionalsSelect
              className='w-fit text-foreground [&>svg]:opacity-100'
              defaultValue={defaultProfessionalId}
              key={professionalSelectKey}
              onValueChange={(e) => setSearchParams({ pid: e })}
              professionals={professionals}
            />
            {defaultProfessionalId && (
              <Button
                className='h-5 w-5 rounded-full bg-black p-0 text-xs font-medium text-white hover:bg-black/70'
                ref={professionalScope}
                size='miniIcon'
                variant='default'
                onClick={clearProfessionalSelect}
                onMouseOver={() =>
                  professionalAnimation(professionalScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                }
                onMouseOut={() =>
                  professionalAnimation(professionalScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                }
              >
                <Trash2 size={14} strokeWidth={2} />
              </Button>
            )}
          </div>
          <div className='flex w-1/2 flex-row items-center space-x-2'>
            <ApposDateSelect userId={userId} onValueChange={handleDateChange} />
          </div>
        </section>
        <section className='flex border-b-2 pb-1 text-sm font-medium'>
          <div className='flex w-3/4 items-center'>
            <div className='w-1/4 text-center'>{USER_VIEW_CONFIG.appointmentsRecord.tableHeaders[0]}</div>
            <div className='w-3/4 text-center'>{USER_VIEW_CONFIG.appointmentsRecord.tableHeaders[1]}</div>
          </div>
          <div className='w-1/4 text-center'>{USER_VIEW_CONFIG.appointmentsRecord.tableHeaders[2]}</div>
        </section>
        {isLoading && <LoadingDB text={loaderText || 'Loading data'} className='p-0 pt-3' />}
        {!isLoading && isError ? (
          <InfoCard type='error' text={errorMessage} className='p-0 pt-3' />
        ) : (
          !isLoading &&
          appointments.length > 0 &&
          appointments?.map((appointment, index) => (
            <section
              key={crypto.randomUUID()}
              className={`flex flex-row items-center justify-between p-1.5 text-sm ${index % 2 === 0 && 'bg-slate-100/80'}`}
            >
              <section className='flex w-3/4 flex-row items-center'>
                <div className='w-1/4 text-center'>{format(appointment.day, 'DD/MM/YYYY')}</div>
                <div className='w-3/4'>{`${capitalize(appointment.professional.title.abbreviation)} ${capitalize(appointment.professional.lastName)}, ${capitalize(appointment.professional.firstName)}`}</div>
              </section>
              <section className='flex w-1/4 items-center justify-end space-x-1.5'>
                <Button
                  variant='tableHeader'
                  size='miniIcon'
                  onClick={() => navigate(`/appointments/${appointment._id}`)}
                  className={`border border-slate-300 shadow-sm transition-all hover:scale-110 hover:border-fuchsia-500 hover:text-fuchsia-500 ${index % 2 === 0 ? 'bg-white hover:bg-white' : 'bg-slate-100 hover:bg-white'}`}
                >
                  <FileText size={17} strokeWidth={1.5} />
                </Button>
                <Button
                  key={crypto.randomUUID()}
                  variant='tableHeader'
                  size='miniIcon'
                  onClick={() => handleRemoveAppointment(appointment._id)}
                  className={`border border-slate-300 shadow-sm transition-all hover:scale-110 hover:border-red-500 hover:text-red-500 ${index % 2 === 0 ? 'bg-white hover:bg-white' : 'bg-slate-100 hover:bg-white'}`}
                >
                  <Trash2 size={17} strokeWidth={1.5} />
                </Button>
              </section>
            </section>
          ))
        )}
      </CardContent>
    </Card>
  );
}
