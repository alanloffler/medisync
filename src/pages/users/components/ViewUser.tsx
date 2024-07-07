// Icons: https://lucide.dev/icons/
import { ArrowLeft, CreditCard, Mail, Menu, Smartphone } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/core/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/core/components/ui/tooltip';
// App components
import { InfoCard } from '@/core/components/common/InfoCard';
import { LoadingDB } from '@/core/components/common/LoadingDB';
import { PageHeader } from '@/core/components/common/PageHeader';
// App
import { APP_CONFIG } from '@/config/app.config';
import { IEmail } from '@/core/interfaces/email.interface';
import { IInfoCard } from '@/core/components/common/interfaces/infocard.interface';
import { IUser } from '@/pages/users/interfaces/user.interface';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { USER_VIEW_CONFIG as UV_CONFIG } from '@/config/user.config';
import { UserApiService } from '@/pages/users/services/user-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useDelimiter } from '@/core/hooks/useDelimiter';
import { useEffect, useState } from 'react';
import { useLegibleDate } from '@/core/hooks/useDateToString';
import { useNotificationsStore } from '@/core/stores/notifications.store';
// React component
export default function ViewUser() {
  const [emailObject, setEmailObject] = useState<IEmail>({} as IEmail);
  const [infoCard, setInfoCard] = useState<IInfoCard>({} as IInfoCard);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>({} as IUser);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const delimiter = useDelimiter();
  const legibleDate = useLegibleDate();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      UserApiService.findOne(id).then((response) => {
        if (response.statusCode === 200) {
          setUser(response.data);
          setShowCard(true);
          setEmailObject({
            to: response.data.email,
            subject: UV_CONFIG.email.subject,
            body: `${UV_CONFIG.email.body[0]} ${capitalize(response.data?.firstName)}${UV_CONFIG.email.body[1]}`,
          });
        }
        if (response.statusCode > 399) {
          addNotification({ type: 'error', message: response.message });
          setInfoCard({ text: response.message, type: 'warning' });
        }
        if (response instanceof Error) {
          addNotification({ type: 'error', message: APP_CONFIG.error.server });
          setInfoCard({ text: APP_CONFIG.error.server, type: 'error' });
        }
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={UV_CONFIG.title} breadcrumb={UV_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          {UV_CONFIG.buttons.back}
        </Button>
      </div>
      {/* Page Content */}
      <div className='mx-auto mt-4 flex w-full flex-row px-2 md:w-[500px]'>
        <Card className='w-full'>
          {showCard ? (
            <CardHeader>
              <CardTitle>
                <div className='relative flex items-center justify-center'>
                  <h1 className='text-center text-2xl font-bold'>
                    {capitalize(user.lastName)}, {capitalize(user.firstName)}
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
                          <p className='text-xs font-medium'>{UV_CONFIG.tooltip.dropdown}</p>
                        </TooltipContent>
                        <DropdownMenuContent className='w-fit' align='end'>
                          <DropdownMenuGroup>
                            {/* Send email */}
                            <Link to={`https://mail.google.com/mail/?view=cm&to=${emailObject.to}&su=${emailObject.subject}&body=${emailObject.body}`} target='_blank' className='transition-colors hover:text-indigo-500'>
                              <DropdownMenuItem>{UV_CONFIG.dropdownMenu[0].name}</DropdownMenuItem>
                            </Link>
                            {/* Send whatsapp */}
                            <Link to={`/whatsapp/${user._id}`}>
                              <DropdownMenuItem>{UV_CONFIG.dropdownMenu[1].name}</DropdownMenuItem>
                            </Link>
                            {/* Edit user */}
                            <Link to={`/users/update/${user._id}`}>
                              <DropdownMenuItem>{UV_CONFIG.dropdownMenu[2].name}</DropdownMenuItem>
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
                <div className='flex items-center space-x-4'>
                  <CreditCard className='h-6 w-6' strokeWidth={2} />
                  <span className='text-lg font-medium'>{delimiter(user.dni, '.', 3)}</span>
                </div>
                <div className='flex items-center space-x-4'>
                  <Smartphone className='h-6 w-6' strokeWidth={2} />
                  <span className='text-lg font-medium'>{delimiter(user.phone, '-', 6)}</span>
                </div>
                <div className='flex items-center space-x-4'>
                  <Mail className='h-6 w-6' strokeWidth={2} />
                  <span className='text-lg font-medium'>{user.email}</span>
                </div>
                <div className='flex justify-end pt-2 text-base leading-none text-slate-500'>{`${UV_CONFIG.phrase.userSince} ${legibleDate(new Date(user.createdAt), 'short')}`}</div>
              </CardContent>
            )
          )}
        </Card>
      </div>
    </main>
  );
}
