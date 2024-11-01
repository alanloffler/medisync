// Icons: https://lucide.dev/icons/
import { CreditCard, FilePen, Mail, MessageCircle, Send, Smartphone, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@core/components/ui/card';
// Components
import { ApposRecord } from '@appointments/components/appos-record/ApposRecord';
import { BackButton } from '@core/components/common/BackButton';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { useNavigate, useParams } from 'react-router-dom';
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
                <TooltipWrapper tooltip={'Enviar email'} help={help}>
                  <Button
                    onClick={() =>
                      window.open(
                        `https://mail.google.com/mail/?view=cm&to=${emailObject.to}&su=${emailObject.subject}&body=${emailObject.body}`,
                        '_blank',
                      )
                    }
                    variant='secondary'
                    size='miniIcon'
                    className='bg-transparent transition-transform hover:scale-125 hover:bg-transparent hover:text-sky-500 hover:animate-in'
                  >
                    <Send size={18} strokeWidth={1.5} />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltip={'Enviar WhatsApp'} help={help}>
                  <Button
                    onClick={() => navigate(`/whatsapp/${user._id}`)}
                    variant='secondary'
                    size='miniIcon'
                    className='bg-transparent transition-transform hover:scale-125 hover:bg-transparent hover:text-emerald-500 hover:animate-in'
                  >
                    <MessageCircle size={18} strokeWidth={1.5} />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltip={'Editar paciente'} help={help}>
                  <Button
                    onClick={() => navigate(`/users/update/${user._id}`)}
                    variant='secondary'
                    size='miniIcon'
                    className='bg-transparent transition-transform hover:scale-125 hover:bg-transparent hover:text-amber-500 hover:animate-in'
                  >
                    <FilePen size={18} strokeWidth={1.5} />
                  </Button>
                </TooltipWrapper>
                {/* TODO: create dialog for user delete */}
                <TooltipWrapper tooltip={'Eliminar paciente'} help={help}>
                  <Button
                    onClick={() => navigate(``)}
                    variant='secondary'
                    size='miniIcon'
                    className='bg-transparent transition-transform hover:scale-125 hover:bg-transparent hover:text-rose-500 hover:animate-in'
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                  </Button>
                </TooltipWrapper>
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
