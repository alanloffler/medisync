// Icons: https://lucide.dev/icons/
import { CalendarClock, CalendarDays, Mail, Menu, Quote, Smartphone } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/core/components/ui/dropdown-menu';
import { Separator } from '@/core/components/ui/separator';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/core/components/ui/tooltip';
// Components
import { BackButton } from '@/core/components/common/BackButton';
import { InfoCard } from '@/core/components/common/InfoCard';
import { LoadingDB } from '@/core/components/common/LoadingDB';
import { PageHeader } from '@/core/components/common/PageHeader';
// External imports
import { Link, useNavigate, useParams } from 'react-router-dom';
import { spring } from 'framer-motion';
import { useAnimate } from 'framer-motion/mini';
import { useEffect, useState } from 'react';
// Imports
import type { IEmail } from '@/core/interfaces/email.interface';
import type { IInfoCard } from '@/core/components/common/interfaces/infocard.interface';
import type { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import type { IResponse } from '@/core/interfaces/response.interface';
import { APP_CONFIG } from '@/config/app.config';
import { CalendarService } from '@/pages/appointments/services/calendar.service';
import { PROF_VIEW_CONFIG as PV_CONFIG } from '@/config/professionals.config';
import { ProfessionalApiService } from '@/pages/professionals/services/professional-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useCapitalizeFirstLetter } from '@/core/hooks/useCapitalizeFirstLetter';
import { useDelimiter } from '@/core/hooks/useDelimiter';
import { useNotificationsStore } from '@/core/stores/notifications.store';
// React component
export default function ViewProfessional() {
  const [emailObject, setEmailObject] = useState<IEmail>({} as IEmail);
  const [infoCard, setInfoCard] = useState<IInfoCard>({} as IInfoCard);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [legibleWorkingDays, setLegibleWorkingDays] = useState<string>('');
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [dropdownScope, dropdownAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const capitalizeFirstLetter = useCapitalizeFirstLetter();
  const delimiter = useDelimiter();
  const navigate = useNavigate();
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
            <CardHeader>
              <CardTitle>
                <div className='relative flex items-center justify-center'>
                  <h1 className='text-center text-2xl font-bold'>{`${capitalize(professional.title.abbreviation)} ${capitalize(professional.lastName)}, ${capitalize(professional.firstName)}`}</h1>
                  <TooltipProvider delayDuration={0.3}>
                    <Tooltip>
                      <DropdownMenu>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className='absolute right-1 flex items-center'
                              ref={dropdownScope}
                              size='miniIcon'
                              variant='tableHeader'
                              onMouseOver={() =>
                                dropdownAnimation(dropdownScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                              }
                              onMouseOut={() =>
                                dropdownAnimation(dropdownScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                              }
                            >
                              <Menu size={16} strokeWidth={2} />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-medium'>{PV_CONFIG.tooltip.dropdown}</p>
                        </TooltipContent>
                        <DropdownMenuContent className='w-fit' align='end'>
                          <DropdownMenuGroup>
                            {/* Send email */}
                            <Link
                              to={`https://mail.google.com/mail/?view=cm&to=${emailObject.to}&su=${emailObject.subject}&body=${emailObject.body}`}
                              target='_blank'
                              className='transition-colors hover:text-indigo-500'
                            >
                              <DropdownMenuItem>{PV_CONFIG.dropdownMenu[0].name}</DropdownMenuItem>
                            </Link>
                            {/* Send whatsapp */}
                            <Link to={`/whatsapp/professional/${professional._id}`}>
                              <DropdownMenuItem>{PV_CONFIG.dropdownMenu[1].name}</DropdownMenuItem>
                            </Link>
                            {/* Edit user */}
                            <Separator />
                            <Link to={`/professionals/update/${professional._id}`}>
                              <DropdownMenuItem>{PV_CONFIG.dropdownMenu[2].name}</DropdownMenuItem>
                            </Link>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardTitle>
            </CardHeader>
          ) : (
            <InfoCard type={infoCard.type} text={infoCard.text} className='py-6' />
          )}
          {isLoading ? (
            <LoadingDB text={APP_CONFIG.loadingDB.findOneUser} className='-mt-12 py-6' />
          ) : (
            showCard && (
              <CardContent className='mt-3 space-y-3'>
                {professional.description && (
                  <div className='flex flex-row items-center space-x-1'>
                    <Quote size={8} strokeWidth={0} className='relative bottom-1 rotate-180 fill-black' />
                    <blockquote className='text-pretty text-base font-normal italic'>{`${capitalizeFirstLetter(professional.description)}`}</blockquote>
                    <Quote size={8} strokeWidth={0} className='relative bottom-1 fill-black' />
                  </div>
                )}
                <h2 className='pt-2 text-base font-semibold underline underline-offset-4'>{PV_CONFIG.phrases.scheduleTitle}</h2>
                {professional.configuration?.workingDays && (
                  <div className='flex items-center space-x-4'>
                    <CalendarDays size={20} strokeWidth={2} />
                    <span className='text-base'>{legibleWorkingDays}</span>
                  </div>
                )}
                {professional.configuration?.scheduleTimeInit && professional.configuration?.scheduleTimeEnd && (
                  <div className='flex items-center space-x-4'>
                    <CalendarClock size={20} strokeWidth={2} />
                    <span className='text-base'>
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
                <h2 className='pt-2 text-base font-semibold underline underline-offset-4'>{PV_CONFIG.phrases.contactTitle}</h2>
                {professional.phone && (
                  <div className='flex items-center space-x-4'>
                    <Smartphone size={20} strokeWidth={2} />
                    <span className='text-base font-medium'>{delimiter(professional.phone, '-', 6)}</span>
                  </div>
                )}
                {professional.email && (
                  <div className='flex items-center space-x-4'>
                    <Mail size={20} strokeWidth={2} />
                    <span className='text-base font-medium'>{professional.email}</span>
                  </div>
                )}
                {professional.area && professional.specialization && (
                  <div className='flex justify-end space-x-4 pt-3'>
                    <Badge variant='secondary' className='border border-slate-200 text-sm font-medium'>
                      {capitalize(professional.area.name)}
                    </Badge>
                    <Badge variant='secondary' className='border border-slate-200 text-sm font-medium'>
                      {capitalize(professional.specialization.name)}
                    </Badge>
                  </div>
                )}
              </CardContent>
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
