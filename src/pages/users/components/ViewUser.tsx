// Icons: https://lucide.dev/icons/
import { ArrowRight, CreditCard, Mail, MessageCircle, PencilLine, Send, Smartphone, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { ApposRecord } from '@appointments/components/appos-record/ApposRecord';
import { BackButton } from '@core/components/common/BackButton';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { TableButton } from '@core/components/common/TableButton';
// External imports
import { format } from '@formkit/tempo';
import { useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import type { IUser } from '@users/interfaces/user.interface';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { USER_VIEW_CONFIG as UV_CONFIG } from '@config/users/user-view.config';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { motion } from '@core/services/motion.service';
import { useDelimiter } from '@core/hooks/useDelimiter';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export default function ViewUser() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>({} as IUser);
  const [gotoScope, gotoAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const delimiter = useDelimiter();
  const navigate = useNavigate();
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { i18n, t } = useTranslation();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setItemSelected(HEADER_CONFIG.headerMenu[3].id);
      setIsLoading(true);

      UserApiService.findOne(id)
        .then((response) => {
          if (response.statusCode === 200) {
            setUser(response.data);
            setShowCard(true);
          }
          if (response.statusCode > 399) {
            addNotification({ type: 'error', message: response.message });
          }
          if (response instanceof Error) {
            addNotification({ type: 'error', message: t('error.internalServer') });
          }
        })
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function gotoAnimationOver(): void {
    const { keyframes, options } = motion.x(3).type('bounce').animate();
    gotoAnimation(gotoScope.current, keyframes, options);
  }

  function gotoAnimationOut(): void {
    const { keyframes, options } = motion.x(0).type('bounce').animate();
    gotoAnimation(gotoScope.current, keyframes, options);
  }

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.viewUser')} breadcrumb={UV_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </header>
      {/* Section: Page Content */}
      {/* TODO: wrong structure, loading must be full width has card. Put it inside of it */}
      <section className='grid w-full gap-4 md:grid-cols-5 md:gap-8 lg:grid-cols-5 lg:gap-8 xl:grid-cols-6 xl:gap-8'>
        {isLoading ? (
          <LoadingDB text={t('loading.userDetails')} variant='card' className='w-full!' />
        ) : (
          showCard && (
            <Card className='col-span-1 mx-auto h-fit w-full md:col-span-2 lg:col-span-2 xl:col-span-2'>
              <header className='relative flex items-center justify-center rounded-t-lg bg-slate-200 p-3 text-slate-700'>
                <h1 className='text-center text-xl font-bold'>{UtilsString.upperCase(`${user.firstName} ${user.lastName}`, 'each')}</h1>
              </header>
              <CardContent className='mt-3 space-y-3 overflow-auto'>
                <section className='flex items-center space-x-3'>
                  <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                    <CreditCard size={17} strokeWidth={2} />
                  </div>
                  <span className='text-sm'>{i18n.format(user.dni, 'number', i18n.resolvedLanguage)}</span>
                </section>
                <section className='flex items-center space-x-3'>
                  <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                    <Smartphone size={17} strokeWidth={2} />
                  </div>
                  <span className='text-sm'>{delimiter(user.phone, '-', 6)}</span>
                </section>
                {user.email && (
                  <section className='flex items-center space-x-3'>
                    <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                      <Mail size={17} strokeWidth={2} />
                    </div>
                    <span className='text-sm'>{user.email}</span>
                  </section>
                )}
                <section className='pt-2 text-sm'>
                  {t('cardContent.userSince', { date: format(user.createdAt, 'long', localStorage.getItem('i18nextLng') ?? i18n.resolvedLanguage) })}
                </section>
              </CardContent>
              <section className='flex items-center justify-end space-x-2 border-t p-2'>
                <TableButton
                  callback={() => navigate(`/email/${user._id}`)}
                  className='hover:text-sky-500'
                  disabled={!user.email}
                  tooltip={t('tooltip.sendEmail')}
                >
                  <Send size={18} strokeWidth={1.5} />
                </TableButton>
                <TableButton
                  callback={() => navigate(`/whatsapp/${user._id}`)}
                  className='hover:text-green-500'
                  tooltip={t('tooltip.sendMessage')}
                >
                  <MessageCircle size={18} strokeWidth={1.5} />
                </TableButton>
                <TableButton
                  callback={() => navigate(`/users/update/${user._id}`)}
                  className='hover:text-fuchsia-500'
                  tooltip={t('tooltip.updateUser')}
                >
                  <PencilLine size={18} strokeWidth={1.5} />
                </TableButton>
                {/* TODO: create dialog for user delete */}
                <TableButton
                  callback={() => console.log('Open dialog')}
                  className='hover:text-rose-500'
                  tooltip={t('tooltip.deleteUser')}
                >
                  <Trash2 size={18} strokeWidth={1.5} />
                </TableButton>
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
        <Button
          variant='default'
          size='default'
          className='flex items-center gap-3'
          onClick={() => navigate('/users')}
          onMouseOver={gotoAnimationOver}
          onMouseOut={gotoAnimationOut}
        >
          {t('button.goToUsers')}
          <ArrowRight ref={gotoScope} size={16} strokeWidth={2} />
        </Button>
      </footer>
    </main>
  );
}
