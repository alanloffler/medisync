// Icons: https://lucide.dev/icons/
import { CalendarClock, CalendarDays, Mail, PencilLine, Share2, Smartphone, Tag, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Badge } from '@core/components/ui/badge';
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardFooter } from '@core/components/ui/card';
// Components
import { AvailableProfessional } from '@professionals/components/common/AvailableProfessional';
import { BackButton } from '@core/components/common/BackButton';
import { IconMedic } from '@core/components/icons/IconMedic';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { RemoveDialog } from '@core/components/common/RemoveDialog';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Imports
import type { IEmail } from '@core/interfaces/email.interface';
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { APP_CONFIG } from '@config/app.config';
import { CalendarService } from '@appointments/services/calendar.service';
import { PROF_VIEW_CONFIG as PV_CONFIG } from '@config/professionals.config';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useCapitalizeFirstLetter } from '@core/hooks/useCapitalizeFirstLetter';
import { useDelimiter } from '@core/hooks/useDelimiter';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { useHelpStore } from '@settings/stores/help.store';
// React component
export default function ViewProfessional() {
  const [emailObject, setEmailObject] = useState<IEmail>({} as IEmail);
  const [infoCard, setInfoCard] = useState<IInfoCard>({} as IInfoCard);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [legibleWorkingDays, setLegibleWorkingDays] = useState<string>('');
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const [showCard, setShowCard] = useState<boolean>(false);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const capitalizeFirstLetter = useCapitalizeFirstLetter();
  const delimiter = useDelimiter();
  const navigate = useNavigate();
  const { help } = useHelpStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      ProfessionalApiService.findOne(id)
        .then((response: IResponse) => {
          if (response.statusCode === 200) {
            setProfessional(response.data);
            setEmailObject({
              to: response.data.email,
              subject: PV_CONFIG.email.subject,
              body: `${PV_CONFIG.email.body[0]} ${capitalize(response.data?.firstName)}${PV_CONFIG.email.body[1]}`,
            });
            setShowCard(true);

            const legibleWorkingDays: string = CalendarService.getLegibleWorkingDays(response.data.configuration.workingDays, true);
            setLegibleWorkingDays(legibleWorkingDays);
          }
          if (response.statusCode > 399) {
            setInfoCard({ type: 'warning', text: response.message });
            addNotification({ type: 'warning', message: response.message });
          }
          if (response instanceof Error) {
            setInfoCard({ type: 'error', text: APP_CONFIG.error.server });
            addNotification({ type: 'error', message: APP_CONFIG.error.server });
          }
        })
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={PV_CONFIG.title} breadcrumb={PV_CONFIG.breadcrumb} />
        <BackButton label={PV_CONFIG.button.back} />
      </header>
      {/* Section: Page content */}
      <section className='mx-auto mt-4 flex w-full flex-row px-2 md:w-[500px]'>
        <Card className='w-full'>
          {showCard ? (
            <div className='relative flex items-center justify-center rounded-t-lg bg-slate-200 p-3 text-slate-700'>
              <h1 className='text-center text-xl font-bold'>{`${capitalize(professional.title.abbreviation)} ${capitalize(professional.firstName)} ${capitalize(professional.lastName)}`}</h1>
            </div>
          ) : (
            <InfoCard type={infoCard.type} text={infoCard.text} className='py-6' />
          )}
          {isLoading ? (
            <LoadingDB text={APP_CONFIG.loadingDB.findOneUser} className='-mt-12 py-6' />
          ) : (
            showCard && (
              <>
                <CardContent className='mt-6 space-y-6'>
                  {professional.description && (
                    <section className='flex space-x-4 text-ellipsis rounded-md bg-slate-100 px-4 py-3 italic text-slate-600'>
                      <IconMedic name={professional.specialization.icon} size={20} />
                      <span>{`${capitalizeFirstLetter(professional.description)}`}</span>
                    </section>
                  )}
                  <section className='space-y-3'>
                    <h2 className='pt-2 text-xsm font-semibold uppercase leading-none text-slate-700'>{PV_CONFIG.phrases.scheduleTitle}</h2>
                    {professional.configuration?.workingDays && (
                      <div className='flex items-center space-x-3'>
                        <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                          <CalendarDays size={17} strokeWidth={2} />
                        </div>
                        <span className='text-sm'>{legibleWorkingDays}</span>
                      </div>
                    )}
                    {professional.configuration?.scheduleTimeInit && professional.configuration?.scheduleTimeEnd && (
                      <div className='flex items-center space-x-3'>
                        <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                          <CalendarClock size={17} strokeWidth={2} />
                        </div>
                        <span className='text-sm'>
                          {professional.configuration?.scheduleTimeInit &&
                            professional.configuration?.scheduleTimeEnd &&
                            !professional.configuration?.unavailableTimeSlot?.timeSlotUnavailableInit &&
                            !professional.configuration?.unavailableTimeSlot?.timeSlotUnavailableEnd &&
                            `${professional.configuration.scheduleTimeInit} ${PV_CONFIG.words.hoursSeparator} ${professional.configuration.scheduleTimeEnd}`}
                          {professional.configuration?.scheduleTimeInit &&
                            professional.configuration?.scheduleTimeEnd &&
                            professional.configuration?.unavailableTimeSlot?.timeSlotUnavailableInit &&
                            professional.configuration?.unavailableTimeSlot?.timeSlotUnavailableEnd &&
                            `${professional.configuration.scheduleTimeInit} ${PV_CONFIG.words.hoursSeparator} ${professional.configuration.unavailableTimeSlot?.timeSlotUnavailableInit} ${PV_CONFIG.words.slotsSeparator} ${professional.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd} ${PV_CONFIG.words.hoursSeparator} ${professional.configuration.scheduleTimeEnd}`}
                        </span>
                      </div>
                    )}
                  </section>
                  <section className='space-y-3'>
                    <h2 className='pt-2 text-xsm font-semibold uppercase leading-none text-slate-700'>{PV_CONFIG.phrases.contactTitle}</h2>
                    {professional.phone && (
                      <div className='flex items-center space-x-3'>
                        <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                          <Smartphone size={17} strokeWidth={2} />
                        </div>
                        <span className='text-sm'>{delimiter(professional.phone, '-', 6)}</span>
                      </div>
                    )}
                    {professional.email && (
                      <div className='flex items-center space-x-3'>
                        <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                          <Mail size={17} strokeWidth={2} />
                        </div>
                        <span className='text-sm'>{professional.email}</span>
                      </div>
                    )}
                    {professional.area && professional.specialization && (
                      <div className='flex justify-end space-x-4 pt-3'>
                        <Badge variant='default'>
                          <Tag size={13} strokeWidth={2} className='stroke-slate-600' />
                          <span>{capitalize(professional.area.name)}</span>
                        </Badge>
                        <Badge variant='default'>
                          <Tag size={13} strokeWidth={2} className='stroke-slate-600' />
                          <span>{capitalize(professional.specialization.name)}</span>
                        </Badge>
                      </div>
                    )}
                  </section>
                </CardContent>
                <CardFooter className='justify-between border-t p-2'>
                  <AvailableProfessional items={PV_CONFIG.select} data={{ _id: professional._id, available: professional.available }} />
                  <section className='space-x-2'>
                    <TooltipWrapper tooltip={PV_CONFIG.tooltip.share} help={help}>
                      <Button
                        variant='ghost'
                        size='miniIcon'
                        className='transition-transform hover:scale-110 hover:bg-white hover:text-sky-400 hover:animate-in'
                      >
                        <Share2 size={18} strokeWidth={1.5} />
                      </Button>
                    </TooltipWrapper>
                    <TooltipWrapper tooltip={PV_CONFIG.tooltip.edit} help={help}>
                      <Button
                        variant='ghost'
                        size='miniIcon'
                        onClick={() => navigate(`/professionals/update/${professional._id}`)}
                        className='transition-transform hover:scale-110 hover:bg-white hover:text-orange-400 hover:animate-in'
                      >
                        <PencilLine size={18} strokeWidth={1.5} />
                      </Button>
                    </TooltipWrapper>
                    <RemoveDialog
                      // action={() => console.log({ 'action'})}
                      dialogContent={
                        <section>
                          Vas a eliminar al profesional{' '}
                          <span className='font-semibold'>{`${capitalize(professional.title.abbreviation)} ${capitalize(professional.firstName)} ${capitalize(professional.lastName)}`}</span>
                        </section>
                      }
                      dialogTexts={{
                        title: PV_CONFIG.dialog.title,
                        description: PV_CONFIG.dialog.description,
                        cancelButton: PV_CONFIG.button.cancel,
                        removeButton: PV_CONFIG.button.deleteProfessional,
                      }}
                      help={help}
                      tooltip={PV_CONFIG.tooltip.delete}
                      triggerButton={<Trash2 size={18} strokeWidth={1.5} />}
                    />
                  </section>
                </CardFooter>
              </>
            )
          )}
        </Card>
      </section>
      {/* Section: Page footer */}
      <footer className='mx-auto pt-3'>
        <Button variant='default' size='default' onClick={() => navigate('/professionals')}>
          {PV_CONFIG.button.goToProfessionals}
        </Button>
      </footer>
    </main>
  );
}
