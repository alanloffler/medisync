// Icons: https://lucide.dev/icons/
import { FilePen } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Input } from '@core/components/ui/input';
// Components
import { BackButton } from '@core/components/common/BackButton';
import { CardHeaderPrimary } from '@core/components/common/header/CardHeaderPrimary';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { SelectPhoneArea } from '@core/components/common/SelectPhoneArea';
// External imports
import { MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUpdateUserVars } from '@users/interfaces/mutation-vars.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { USER_SCHEMA } from '@config/schemas/user.schema';
import { USER_UPDATE_CONFIG as UU_CONFIG } from '@config/users/user-update.config';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { userSchema } from '@users/schemas/user.schema';
// React component
export default function UpdateUser() {
  const [area, setArea] = useState<number | undefined>();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const updateForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  const {
    data: user,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useQuery<IResponse<IUser>, Error>({
    queryKey: ['users', 'findOne', id],
    queryFn: async () => await UserApiService.findOne(id!),
    retry: 1,
  });

  useEffect(() => {
    if (user) {
      updateForm.setValue('areaCode', user?.data.areaCode);
      updateForm.setValue('dni', user?.data.dni);
      updateForm.setValue('email', user?.data.email);
      updateForm.setValue('firstName', UtilsString.upperCase(user?.data.firstName, 'each'));
      updateForm.setValue('lastName', UtilsString.upperCase(user?.data.lastName, 'each'));
      updateForm.setValue('phone', user?.data.phone);

      setArea(user?.data.areaCode);
      if (isNaN(user?.data.areaCode)) setErrorMsg('must update user');
    }
  }, [user, updateForm]);

  useEffect(() => {
    isError && addNotification({ type: 'error', message: error?.message });
  }, [addNotification, error?.message, isError]);

  const {
    error: errorUpdating,
    mutate: updateUser,
    isError: isErrorUpdating,
    isPending: isUpdating,
  } = useMutation<IResponse<IUser>, Error, IUpdateUserVars>({
    mutationKey: ['users', 'update', id],
    mutationFn: async ({ id, data }) => await UserApiService.update(id, data),
    onError: (error) => {
      setOpenDialog(true);
      addNotification({ type: 'error', message: error.message });
    },
    onSuccess: (response) => {
      navigate('/users');
      addNotification({ type: 'success', message: response.message });
    },
    retry: 1,
  });

  function handleUpdateUser(data: z.infer<typeof userSchema>): void {
    if (id) {
      updateUser({ id, data });
    } else return;
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (user) {
      updateForm.reset();
      updateForm.setValue('areaCode', user?.data.areaCode);
      updateForm.setValue('dni', user?.data.dni);
      updateForm.setValue('email', user?.data.email);
      updateForm.setValue('firstName', UtilsString.upperCase(user?.data.firstName, 'each'));
      updateForm.setValue('lastName', UtilsString.upperCase(user?.data.lastName, 'each'));
      updateForm.setValue('phone', user?.data.phone);
      navigate('/users');
    }
  }

  useEffect(() => {
    updateForm.setValue('areaCode', Number(area));
  }, [area, updateForm]);

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.updateUser')} breadcrumb={UU_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </header>
      {/* Section: Form */}
      <section className='mx-auto mt-6 flex w-full flex-col gap-4 md:w-[550px]'>
        <Card className='w-full md:grid-cols-2'>
          <CardHeaderPrimary title={t('cardTitle.updateUser')}>
            <FilePen size={18} strokeWidth={2} />
          </CardHeaderPrimary>
          <CardContent className='pt-6'>
            {isError && <InfoCard type='error' text={error?.message} className='mx-auto mt-3' />}
            {isLoading && <LoadingDB text={t('loading.userDetails')} className='mt-3' />}
            {isSuccess && (
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(handleUpdateUser)} className='space-y-4'>
                  {/* Form field: DNI */}
                  <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={updateForm.control}
                      name='dni'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{t('label.identityCard')}</FormLabel>
                          <FormControl className='h-9'>
                            <Input type='number' placeholder={t('placeholder.identityCard')} {...field} maxLength={USER_SCHEMA.dni.max.value} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>
                  {/* Form fields: lastName and firstName */}
                  <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={updateForm.control}
                      name='lastName'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{t('label.lastName')}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={t('placeholder.lastName')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateForm.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{t('label.firstName')}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={t('placeholder.firstName')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>
                  {/* Form fields: email and phone */}
                  <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={updateForm.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{t('label.email')}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={t('placeholder.email')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='flex flex-row items-center space-x-3'>
                      <FormField
                        control={updateForm.control}
                        name='areaCode'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('label.phone')}</FormLabel>
                            <FormControl className='h-9'>
                              <SelectPhoneArea setArea={setArea} {...field} value={Number(field.value)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateForm.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormLabel> </FormLabel>
                            <FormControl>
                              <Input type='number' placeholder={t('placeholder.phone')} {...field} className='!mt-8 h-9' />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                  {/* Buttons */}
                  <footer className='grid grid-cols-1 space-y-2 pt-2 md:flex md:justify-end md:gap-6 md:space-y-0'>
                    <Button type='submit' size='sm' className='order-1 md:order-2 lg:order-2'>
                      {isUpdating ? <LoadingDB text={t('loading.updating')} variant='button' /> : t('button.updateUser')}
                    </Button>
                    <Button variant='ghost' size='sm' onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                      {t('button.cancel')}
                    </Button>
                  </footer>
                  {errorMsg && <div className='justify-left flex items-center text-xs text-muted-foreground'>No area, must update</div>}
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </section>
      {/* Section: Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-lg'>{t('error.updateUser')}</DialogTitle>
            <DialogDescription className='sr-only'></DialogDescription>
          </DialogHeader>
          {isErrorUpdating && <section className='flex flex-col text-sm'>{errorUpdating.message}</section>}
          <footer className='flex justify-end space-x-4'>
            <Button variant='destructive' size='sm' onClick={() => setOpenDialog(false)}>
              {t('button.close')}
            </Button>
          </footer>
        </DialogContent>
      </Dialog>
    </main>
  );
}
