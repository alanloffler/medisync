// Icons: https://lucide.dev/icons/
import { FilePlus2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Input } from '@core/components/ui/input';
// Components
import { BackButton } from '@core/components/common/BackButton';
import { CardHeaderPrimary } from '@core/components/common/header/CardHeaderPrimary';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { SelectPhoneArea } from '@core/components/common/SelectPhoneArea';
// External imports
import { MouseEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { USER_CREATE_CONFIG as UC_CONFIG } from '@config/users/user-create.config';
import { USER_SCHEMA } from '@config/schemas/user.schema';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { userSchema } from '@users/schemas/user.schema';
// React component
export default function CreateUser() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const defaultValues = {
    areaCode: undefined,
    dni: '' as unknown as number,
    email: '',
    firstName: '',
    lastName: '',
    phone: '' as unknown as number,
  };

  const createForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues,
  });

  const {
    error,
    mutate: handleCreateUser,
    isError,
    isPending,
  } = useMutation<IResponse<IUser>, Error, z.infer<typeof userSchema>>({
    mutationKey: ['users', 'create'],
    mutationFn: async (data: z.infer<typeof userSchema>) => await UserApiService.create(data),
    onError: (error) => {
      setOpenDialog(true);
      addNotification({ type: 'error', message: error.message });
    },
    onSuccess: (response) => {
      navigate(`/users/${response.data._id}`);
      addNotification({
        type: 'success',
        message: `${response.message} - ${UtilsString.upperCase(response.data.firstName, 'each')} ${UtilsString.upperCase(response.data.lastName, 'each')}`,
      });
    },
    retry: 1,
  });

  function handleCancel(event: MouseEvent<HTMLButtonElement | HTMLDivElement | HTMLInputElement>): void {
    event.preventDefault();
    createForm.reset();
  }

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.createUser')} breadcrumb={UC_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </header>
      {/* Section: Form */}
      <section className='mx-auto mt-6 flex w-full flex-col gap-4 md:w-[550px]'>
        <Card className='w-full'>
          <CardHeaderPrimary title={t('cardTitle.createUser')}>
            <FilePlus2 size={18} strokeWidth={2} />
          </CardHeaderPrimary>
          <CardContent>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit((data) => handleCreateUser(data))} className='space-y-4 pt-6'>
                {/* Form field: DNI */}
                <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <FormField
                    control={createForm.control}
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
                    control={createForm.control}
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
                    control={createForm.control}
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
                    control={createForm.control}
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
                      control={createForm.control}
                      name='areaCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('label.phone')}</FormLabel>
                          <FormControl className='h-9'>
                            <SelectPhoneArea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
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
                    {isPending ? <LoadingDB text={t('loading.creating')} variant='button' /> : t('button.addUser')}
                  </Button>
                  <Button variant='ghost' size='sm' onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                    {t('button.cancel')}
                  </Button>
                </footer>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
      {/* Section: Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-lg'>{t('error.createUser')}</DialogTitle>
            <DialogDescription className='sr-only'></DialogDescription>
          </DialogHeader>
          {isError && <section className='flex flex-col text-sm'>{error.message}</section>}
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
