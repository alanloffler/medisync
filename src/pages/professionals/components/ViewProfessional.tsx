// Icons: https://lucide.dev/icons/
import { ArrowLeft, CalendarClock, CalendarDays, Mail, Menu, Smartphone } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/core/components/ui/dropdown-menu';
import { Separator } from '@/core/components/ui/separator';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/core/components/ui/tooltip';
// App components
import { InfoCard } from '@/core/components/common/InfoCard';
import { LoadingDB } from '@/core/components/common/LoadingDB';
import { PageHeader } from '@/core/components/common/PageHeader';
// App
import { APP_CONFIG } from '@/config/app.config';
import { CalendarService } from '@/pages/appointments/services/calendar.service';
import { IEmail } from '@/core/interfaces/email.interface';
import { IInfoCard } from '@/core/components/common/interfaces/infocard.interface';
import { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { IResponse } from '@/core/interfaces/response.interface';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PROF_VIEW_CONFIG as PV_CONFIG } from '@/config/professionals.config';
import { ProfessionalApiService } from '@/pages/professionals/services/professional-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useCapitalizeFirstLetter } from '@/core/hooks/useCapitalizeFirstLetter';
import { useDelimiter } from '@/core/hooks/useDelimiter';
import { useEffect, useState } from 'react';
// React component
export default function ViewProfessional() {
  const [emailObject, setEmailObject] = useState<IEmail>({} as IEmail);
  const [infoCard, setInfoCard] = useState<IInfoCard>({} as IInfoCard);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [legibleWorkingDays, setLegibleWorkingDays] = useState<string>('');
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const [showCard, setShowCard] = useState<boolean>(false);
  const capitalize = useCapitalize();
  const capitalizeFirstLetter = useCapitalizeFirstLetter();
  const delimiter = useDelimiter();
  const navigate = useNavigate();
  const { id } = useParams();
  // #region Load professional data
  useEffect(() => {
    if (id) {
      setIsLoading(true);

      ProfessionalApiService
      .findOne(id)
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
          setInfoCard({ text: response.message, type: 'warning' });
        }
        if (response instanceof Error) {
          setInfoCard({ text: APP_CONFIG.error.server, type: 'error' });
        }
      })
      .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  // #endregion
  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={PV_CONFIG.title} breadcrumb={PV_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          {PV_CONFIG.button.back}
        </Button>
      </div>
      {/* Page content */}
      <div className='mx-auto mt-4 flex w-full flex-row px-2 md:w-[500px]'>
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
                            <Button variant={'tableHeader'} size={'miniIcon'} className='absolute right-1 flex items-center'>
                              <Menu className='h-4 w-4' strokeWidth={2} />
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
            <InfoCard text={infoCard.text} type={infoCard.type} className='py-6' />
          )}
          {isLoading ? (
            <LoadingDB text={APP_CONFIG.loadingDB.findOneUser} className='-mt-12 py-6' />
          ) : (
            showCard && (
              <CardContent className='mt-3 space-y-3'>
                {professional.area && professional.specialization && (
                  <div className='space-x-4 pb-2'>
                    <Badge className='text-base'>{capitalize(professional.area.name)}</Badge>
                    <Badge className='text-base'>{capitalize(professional.specialization.name)}</Badge>
                  </div>
                )}
                {professional.configuration?.workingDays && (
                  <div className='flex items-center space-x-4'>
                    <CalendarDays className='h-6 w-6' strokeWidth={2} />
                    <span className='text-base font-medium'>{legibleWorkingDays}</span>
                  </div>
                )}
                {professional.configuration?.scheduleTimeInit &&
                  professional.configuration?.timeSlotUnavailableInit &&
                  professional.configuration?.timeSlotUnavailableEnd &&
                  professional.configuration?.scheduleTimeEnd && (
                    <div className='flex items-center space-x-4'>
                      <CalendarClock className='h-6 w-6' strokeWidth={2} />
                      <span className='text-base font-medium'>
                        {`${professional.configuration.scheduleTimeInit} ${PV_CONFIG.words.hoursSeparator} ${professional.configuration.timeSlotUnavailableInit} ${PV_CONFIG.words.slotsSeparator} ${professional.configuration.timeSlotUnavailableEnd} ${PV_CONFIG.words.hoursSeparator} ${professional.configuration.scheduleTimeEnd}`}
                      </span>
                    </div>
                  )}
                {professional.phone && (
                  <div className='flex items-center space-x-4'>
                    <Smartphone className='h-6 w-6' strokeWidth={2} />
                    <span className='text-base font-medium'>{delimiter(professional.phone, '-', 6)}</span>
                  </div>
                )}
                {professional.email && (
                  <div className='flex items-center space-x-4'>
                    <Mail className='h-6 w-6' strokeWidth={2} />
                    <span className='text-base font-medium'>{professional.email}</span>
                  </div>
                )}
                {professional.description && <div className='text-pretty pt-2 text-base'>{capitalizeFirstLetter(professional.description)}</div>}
              </CardContent>
            )
          )}
        </Card>
      </div>
    </main>
  );
}
