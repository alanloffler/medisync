// Icons: https://lucide.dev/icons/
import { CreditCard, FilePen, Mail, Menu, MessageCircle, Send, Smartphone } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@core/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@core/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@core/components/ui/tooltip';
// Components
import { ApposRecord } from '@appointments/components/appos-record/ApposRecord';
import { BackButton } from '@core/components/common/BackButton';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
// External imports
import { Link, useNavigate, useParams } from 'react-router-dom';
import { spring } from 'framer-motion';
import { useAnimate } from 'framer-motion/mini';
import { useEffect, useState } from 'react';
// Imports
import type { IEmail } from '@core/interfaces/email.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { APP_CONFIG } from '@config/app.config';
import { USER_VIEW_CONFIG as UV_CONFIG } from '@config/user.config';
import { UserApiService } from '@users/services/user-api.service';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useDelimiter } from '@core/hooks/useDelimiter';
import { useLegibleDate } from '@core/hooks/useDateToString';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { useHelpStore } from '@settings/stores/help.store';
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
  const { help } = useHelpStore();
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
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={UV_CONFIG.title} breadcrumb={UV_CONFIG.breadcrumb} />
        <BackButton label={UV_CONFIG.buttons.back} />
      </header>
      {/* Section: Page Content */}
      <section className='grid gap-4 md:grid-cols-5 md:gap-8 lg:grid-cols-5 lg:gap-8 xl:grid-cols-6 xl:gap-8'>
        {isLoading ? (
          <LoadingDB text={APP_CONFIG.loadingDB.findOneUser} variant='card' className='border' />
        ) : (
          showCard && (
            <Card className='col-span-1 mx-auto h-fit w-full border md:col-span-2 lg:col-span-2 xl:col-span-2'>
              <CardHeader>
                <CardTitle>
                  <div className='relative flex items-center justify-center'>
                    <h1 className='text-center text-xl font-bold'>
                      {capitalize(user.lastName)}, {capitalize(user.firstName)}
                    </h1>
                    {help ? (
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
                                    dropdownAnimation(
                                      dropdownScope.current,
                                      { scale: 1.1 },
                                      { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 },
                                    )
                                  }
                                  onMouseOut={() =>
                                    dropdownAnimation(
                                      dropdownScope.current,
                                      { scale: 1 },
                                      { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 },
                                    )
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
                    ) : (
                      <DropdownMenu>
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
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='mt-3 space-y-3 overflow-auto'>
                <section className='flex items-center space-x-3'>
                  <CreditCard size={18} strokeWidth={1.5} />
                  <span className='text-base font-normal'>{delimiter(user.dni, '.', 3)}</span>
                </section>
                <section className='flex items-center space-x-3'>
                  <Smartphone size={18} strokeWidth={1.5} />
                  <span className='text-base font-normal'>{delimiter(user.phone, '-', 6)}</span>
                </section>
                <section className='flex items-center space-x-3'>
                  <Mail size={18} strokeWidth={1.5} />
                  <span className='text-base font-normal'>{user.email}</span>
                </section>
                <section className='pt-2 text-base'>{`${UV_CONFIG.phrase.userSince} ${legibleDate(new Date(user.createdAt), 'short')}`}</section>
              </CardContent>
              <section className='flex justify-end space-x-2 border-t p-2'>
                <Button
                  variant='secondary'
                  size='miniIcon'
                  className='bg-transparent transition-transform hover:scale-125 hover:bg-transparent hover:text-sky-500 hover:animate-in'
                >
                  <Send size={18} strokeWidth={1.5} />
                </Button>
                <Button
                  variant='secondary'
                  size='miniIcon'
                  className='bg-transparent transition-transform hover:scale-125 hover:bg-transparent hover:text-emerald-500 hover:animate-in'
                >
                  <MessageCircle size={18} strokeWidth={1.5} />
                </Button>
                <Button
                  variant='secondary'
                  size='miniIcon'
                  className='bg-transparent transition-transform hover:scale-125 hover:bg-transparent hover:text-amber-500 hover:animate-in'
                >
                  <FilePen size={18} strokeWidth={1.5} />
                </Button>
              </section>
            </Card>
          )
        )}
        {showCard && (
          <section className='col-span-1 overflow-y-auto md:col-span-3 lg:col-span-3 xl:col-span-4'>
            <ApposRecord userId={user._id} />
          </section>
        )}
      </section>
      <footer className='mx-auto'>
        <Button variant='default' size='default' onClick={() => navigate('/users')}>
          {UV_CONFIG.buttons.goToUsers}
        </Button>
      </footer>
    </main>
  );
}
