// Icons: https://lucide.dev/icons/
import { ArrowLeft, Menu } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/core/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from '@/core/components/ui/dropdown-menu';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/core/components/ui/tooltip';
// App components
import { InfoCard } from '@/core/components/common/InfoCard';
import { LoadingDB } from '@/core/components/common/LoadingDB';
import { PageHeader } from '@/core/components/common/PageHeader';
// App
import { APP_CONFIG } from '@/config/app.config';
import { IInfoCard } from '@/core/components/common/interfaces/infocard.interface';
import { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { IResponse } from '@/core/interfaces/response.interface';
import { PROF_VIEW_CONFIG as PV_CONFIG } from '@/config/professionals.config';
import { ProfessionalApiService } from '@/pages/professionals/services/professional-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IEmail } from '@/core/interfaces/email.interface';
// React component
export default function ViewProfessional() {
  const [emailObject, setEmailObject] = useState<IEmail>({} as IEmail);
  const [infoCard, setInfoCard] = useState<IInfoCard>({} as IInfoCard);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // prettier-ignore
      ProfessionalApiService
      .findOne(id)
      .then((response: IResponse) => {
        console.log(response);
        if (response.statusCode === 200) {
          setProfessional(response.data);
          setEmailObject({
            to: response.data.email,
            subject: PV_CONFIG.email.subject,
            body: `${PV_CONFIG.email.body[0]} ${capitalize(response.data?.firstName)}${PV_CONFIG.email.body[1]}`,
          });
        }
        if (response.statusCode > 399) {
          setInfoCard({ text: response.message, type: 'warning' });
          setIsError(true);
        }
        if (response instanceof Error) {
          setInfoCard({ text: APP_CONFIG.error.server, type: 'error' });
          setIsError(true);
        }
      })
      .finally(() => setIsLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        <CardHeader>
              <CardTitle>
                <div className='relative flex items-center justify-center'>
                  <h1 className='text-center text-2xl font-bold'>
                    {capitalize(professional.lastName)}, {capitalize(professional.firstName)}
                  </h1>
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
                            <Link to={`https://mail.google.com/mail/?view=cm&to=${emailObject.to}&su=${emailObject.subject}&body=${emailObject.body}`} target='_blank' className='transition-colors hover:text-indigo-500'>
                              <DropdownMenuItem>{PV_CONFIG.dropdownMenu[0].name}</DropdownMenuItem>
                            </Link>
                            {/* Send whatsapp */}
                            <Link to={`/whatsapp/${professional._id}`}>
                              <DropdownMenuItem>{PV_CONFIG.dropdownMenu[1].name}</DropdownMenuItem>
                            </Link>
                            {/* Edit user */}
                            <Link to={`/users/update/${professional._id}`}>
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
        </Card>
      </div>
      {isLoading ? (
        <LoadingDB text={APP_CONFIG.loadingDB.findOneProfessional} />
      ) : isError ? (
        <InfoCard text={infoCard.text} type={infoCard.type} />
      ) : (
        <>
          <div>ViewProfessional {id}</div>
          <div>{capitalize(professional.lastName)}</div>
        </>
      )}
    </main>
  );
}
