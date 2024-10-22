// Icons: https://lucide.dev/icons/
import { CreditCard, Mail, Menu, Smartphone } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/core/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/core/components/ui/tooltip';
// Components
import { AppointmentsRecord } from '@/pages/users/components/AppointmentsRecord';
import { BackButton } from '@/core/components/common/BackButton';
import { LoadingDB } from '@/core/components/common/LoadingDB';
import { PageHeader } from '@/core/components/common/PageHeader';
// External imports
import { Link, useNavigate, useParams } from 'react-router-dom';
import { spring } from 'framer-motion';
import { useAnimate } from 'framer-motion/mini';
import { useEffect, useState } from 'react';
// Imports
import type { IEmail } from '@/core/interfaces/email.interface';
import type { IUser } from '@/pages/users/interfaces/user.interface';
import { APP_CONFIG } from '@/config/app.config';
import { USER_VIEW_CONFIG, USER_VIEW_CONFIG as UV_CONFIG } from '@/config/user.config';
import { UserApiService } from '@/pages/users/services/user-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useDelimiter } from '@/core/hooks/useDelimiter';
import { useLegibleDate } from '@/core/hooks/useDateToString';
import { useNotificationsStore } from '@/core/stores/notifications.store';
// React component
export default function ViewUser() {
  const [emailObject, setEmailObject] = useState<IEmail>({} as IEmail);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>({} as IUser);
  const [dropdownScope, dropdownAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const delimiter = useDelimiter();
  const legibleDate = useLegibleDate();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      UserApiService.findOne(id)
        .then((response) => {
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
          }
          if (response instanceof Error) {
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
        <PageHeader title={UV_CONFIG.title} breadcrumb={UV_CONFIG.breadcrumb} />
        <BackButton label={UV_CONFIG.buttons.back} />
      </header>
      {/* Section: Page Content */}
      <section className='mx-auto mt-4 flex w-full flex-row px-2 md:w-[500px]'>
        <Card className='w-full'>
          {showCard && (
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
                            <Button
                              className='absolute right-1 flex items-center'
                              ref={dropdownScope}
                              size={'miniIcon'}
                              variant={'tableHeader'}
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
                          <p className='text-xs font-medium'>{UV_CONFIG.tooltip.dropdown}</p>
                        </TooltipContent>
                        <DropdownMenuContent className='w-fit' align='end'>
                          <DropdownMenuGroup>
                            {/* Send email */}
                            <Link
                              to={`https://mail.google.com/mail/?view=cm&to=${emailObject.to}&su=${emailObject.subject}&body=${emailObject.body}`}
                              target='_blank'
                              className='transition-colors hover:text-indigo-500'
                            >
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
          )}
          {isLoading ? (
            <LoadingDB text={APP_CONFIG.loadingDB.findOneUser} className='-mt-12 py-6' />
          ) : (
            showCard && (
              <CardContent className='mt-3 space-y-3'>
                <section className='flex items-center space-x-4'>
                  <CreditCard size={24} strokeWidth={2} />
                  <span className='text-lg font-medium'>{delimiter(user.dni, '.', 3)}</span>
                </section>
                <section className='flex items-center space-x-4'>
                  <Smartphone size={24} strokeWidth={2} />
                  <span className='text-lg font-medium'>{delimiter(user.phone, '-', 6)}</span>
                </section>
                <section className='flex items-center space-x-4'>
                  <Mail size={24} strokeWidth={2} />
                  <span className='text-lg font-medium'>{user.email}</span>
                </section>
                <section className='flex justify-end pt-2 text-base leading-none text-slate-500'>{`${UV_CONFIG.phrase.userSince} ${legibleDate(new Date(user.createdAt), 'short')}`}</section>
              </CardContent>
            )
          )}
        </Card>
      </section>
      {showCard && <section className='mx-auto w-3/4 pt-3'>
        <AppointmentsRecord userId={user._id} loaderText={USER_VIEW_CONFIG.appointmentRecords.loader.text} />
      </section>}
      <footer className='mx-auto pt-3'>
        <Button variant='default' size='default' onClick={() => navigate('/users')}>
          {UV_CONFIG.buttons.goToUsers}
        </Button>
      </footer>
    </main>
  );
}
