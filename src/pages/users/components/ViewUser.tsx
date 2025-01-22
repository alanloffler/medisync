// Icons: https://lucide.dev/icons/
import { ArrowRight, CreditCard, Mail, MailX, MessageCircle, PencilLine, Smartphone, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// Components
import { ApposRecord } from '@appointments/components/appos-record/ApposRecord';
import { BackButton } from '@core/components/common/BackButton';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { format } from '@formkit/tempo';
import { useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
// Imports
import type { IDialog } from '@core/interfaces/dialog.interface';
import type { IResponse } from '@core/interfaces/response.interface';
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
  const [dialogData, setDialogData] = useState<IDialog | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [gotoScope, gotoAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const delimiter = useDelimiter();
  const navigate = useNavigate();
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { i18n, t } = useTranslation();
  const { id } = useParams();

  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[3].id);
  }, [setItemSelected]);

  const {
    data: user,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useQuery<IResponse<IUser>, Error>({
    queryKey: ['users', 'findOne', id],
    queryFn: async () => await UserApiService.findOne(id!),
  });

  useEffect(() => {
    if (isError) addNotification({ type: 'error', message: error.message });
  }, [addNotification, error?.message, isError]);

  function handleRemoveUserDialog(): void {
    setOpenDialog(true);
    setDialogData({
      title: t('dialog.deleteUser.title'),
      description: t('dialog.deleteUser.description'),
      content: (
        <div>
          <Trans
            i18nKey='dialog.deleteUser.content'
            values={{
              firstName: UtilsString.upperCase(user?.data.firstName, 'each'),
              lastName: UtilsString.upperCase(user?.data.lastName, 'each'),
              identityCard: i18n.format(user?.data.dni, 'number', i18n.resolvedLanguage),
            }}
            components={{
              span: <span className='font-semibold' />,
              i: <i />,
            }}
          />
        </div>
      ),
      callback: () => handleRemoveUser({ id: id! }),
    });
  }

  const {
    mutate: handleRemoveUser,
    isError: isErrorDeleting,
    isPending: isDeleting,
    reset: resetDeleting,
  } = useMutation<IResponse<IUser>, Error, { id: string }>({
    mutationKey: ['users', 'remove', id],
    mutationFn: async ({ id }) => await UserApiService.remove(id),
    onError: (error) => {
      setDialogData({
        title: t('dialog.error.deleteUser'),
        content: error.message,
      });
    },
    onSuccess: (response) => {
      addNotification({ type: 'success', message: response.message });
      navigate('/users');
    },
    retry: 1,
  });

  useEffect(() => {
    if (openDialog === false) {
      setTimeout(() => resetDeleting(), 1000);
    }
  }, [openDialog, resetDeleting]);

  function gotoAnimationOver(): void {
    const { keyframes, options } = motion.x(3).type('bounce').animate();
    gotoAnimation(gotoScope.current, keyframes, options);
  }

  function gotoAnimationOut(): void {
    const { keyframes, options } = motion.x(0).type('bounce').animate();
    gotoAnimation(gotoScope.current, keyframes, options);
  }

  return (
    <>
      <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
        {/* Section: Page Header */}
        <header className='flex items-center justify-between'>
          <PageHeader title={t('pageTitle.viewUser')} breadcrumb={UV_CONFIG.breadcrumb} />
          <BackButton label={t('button.back')} />
        </header>
        {/* Section: Page Content */}
        <section className='grid w-full gap-4 md:grid-cols-5 md:gap-8 lg:grid-cols-5 lg:gap-8 xl:grid-cols-6 xl:gap-8'>
          {isLoading && (
            <LoadingDB
              text={t('loading.userDetails')}
              variant='card'
              className='col-span-1 mx-auto h-fit w-full py-3 md:col-span-2 lg:col-span-2 xl:col-span-2'
            />
          )}
          {isError && (
            <Card className='col-span-1 mx-auto h-fit w-full py-3 md:col-span-2 lg:col-span-2 xl:col-span-2'>
              <InfoCard type='error' text={error.message} />
            </Card>
          )}
          {isSuccess && (
            <Card className='col-span-1 mx-auto h-fit w-full md:col-span-2 lg:col-span-2 xl:col-span-2'>
              <header className='relative flex items-center justify-center rounded-t-lg bg-slate-200 p-3 text-slate-700'>
                <h1 className='text-center text-xl font-bold'>{UtilsString.upperCase(`${user.data.firstName} ${user.data.lastName}`, 'each')}</h1>
              </header>
              <CardContent className='mt-3 space-y-3 overflow-auto'>
                <section className='flex items-center space-x-3'>
                  <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                    <CreditCard size={17} strokeWidth={2} />
                  </div>
                  <span className='text-sm'>{i18n.format(user.data.dni, 'number', i18n.resolvedLanguage)}</span>
                </section>
                <section className='flex items-center space-x-3'>
                  <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                    <Smartphone size={17} strokeWidth={2} />
                  </div>
                  <span className='text-sm'>{delimiter(user.data.phone, '-', 6)}</span>
                </section>
                {user.data.email && (
                  <section className='flex items-center space-x-3'>
                    <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                      <Mail size={17} strokeWidth={2} />
                    </div>
                    <span className='text-sm'>{user.data.email}</span>
                  </section>
                )}
                {user.data.createdAt && (
                  <section className='pt-2 text-sm'>
                    {t('cardContent.userSince', {
                      date: format(user.data.createdAt, 'long', localStorage.getItem('i18nextLng') ?? i18n.resolvedLanguage),
                    })}
                  </section>
                )}
              </CardContent>
              <section className='flex items-center justify-end space-x-2 border-t p-2'>
                <TooltipWrapper tooltip={t('tooltip.sendEmail')}>
                  <Button
                    variant='ghost'
                    size='miniIcon'
                    className='transition-transform hover:scale-110 hover:bg-purple-100 hover:text-purple-400 hover:animate-in disabled:opacity-100'
                    onClick={() => navigate(`/email/user/${user.data._id}`)}
                    disabled={!user.data.email}
                  >
                    {!user.data.email ? <MailX size={18} strokeWidth={1.5} className='stroke-red-400' /> : <Mail size={18} strokeWidth={1.5} />}
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltip={t('tooltip.sendMessage')}>
                  <Button
                    variant='ghost'
                    size='miniIcon'
                    className='transition-transform hover:scale-110 hover:bg-emerald-100 hover:text-emerald-400 hover:animate-in'
                    onClick={() => navigate(`/whatsapp/user/${user.data._id}`)}
                  >
                    <MessageCircle size={18} strokeWidth={1.5} />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltip={t('tooltip.edit')}>
                  <Button
                    variant='ghost'
                    size='miniIcon'
                    onClick={() => navigate(`/users/update/${user.data._id}`)}
                    className='transition-transform hover:scale-110 hover:bg-amber-100 hover:text-amber-400 hover:animate-in'
                  >
                    <PencilLine size={18} strokeWidth={1.5} />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltip={t('tooltip.delete')}>
                  <Button
                    variant='ghost'
                    size='miniIcon'
                    onClick={handleRemoveUserDialog}
                    className='transition-transform hover:scale-110 hover:bg-red-100 hover:text-red-400 hover:animate-in'
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                  </Button>
                </TooltipWrapper>
              </section>
            </Card>
          )}
          {isSuccess && (
            <section className='col-span-1 overflow-y-auto md:col-span-3 lg:col-span-3 xl:col-span-4'>
              <ApposRecord userId={user.data._id} />
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
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        {dialogData && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-xl'>{dialogData.title}</DialogTitle>
              {!isErrorDeleting && <DialogDescription>{dialogData.description}</DialogDescription>}
            </DialogHeader>
            <section className='flex text-sm'>{dialogData.content}</section>
            <footer className='flex flex-col gap-4 md:flex-row md:justify-end'>
              {isErrorDeleting && (
                <Button variant='default' size='sm' onClick={() => setOpenDialog(false)}>
                  {t('button.tryAgain')}
                </Button>
              )}
              {!isErrorDeleting && (
                <>
                  <Button variant='ghost' size='sm' onClick={() => setOpenDialog(false)} className='order-2 md:order-1'>
                    {t('button.cancel')}
                  </Button>
                  <Button variant='remove' size='sm' onClick={dialogData.callback} className='order-1 md:order-2'>
                    {isDeleting ? <LoadingDB className='p-0' text={t('loading.deleting')} variant='button' /> : t('button.deleteUser')}
                  </Button>
                </>
              )}
            </footer>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
