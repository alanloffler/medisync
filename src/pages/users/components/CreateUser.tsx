// Icons: https://lucide.dev/icons/
import { FilePlus2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
// Components
import { BackButton } from '@/core/components/common/BackButton';
import { LoadingDB } from '@/core/components/common/LoadingDB';
import { PageHeader } from '@/core/components/common/PageHeader';
// External imports
import { MouseEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Imports
import type { IResponse } from '@/core/interfaces/response.interface';
import { APP_CONFIG } from '@/config/app.config';
import { USER_CREATE_CONFIG as UC_CONFIG } from '@/config/user.config';
import { USER_SCHEMA } from '@/config/schemas/user.schema';
import { UserApiService } from '@/pages/users/services/user-api.service';
import { useNotificationsStore } from '@/core/stores/notifications.store';
import { userSchema } from '@/pages/users/schemas/user.schema';
// React component
export default function CreateUser() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();

  const defaultValues = {
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

  function handleCreateUser(data: z.infer<typeof userSchema>): void {
    setIsCreating(true);

    UserApiService.create(data)
      .then((response: IResponse) => {
        if (response.statusCode === 200) {
          navigate(`/users/${response.data._id}`);
          addNotification({ type: 'success', message: response.message });
        }
        if (response.statusCode > 399) {
          setOpenDialog(true);
          setErrorMessage(response.message);
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          setOpenDialog(true);
          setErrorMessage(APP_CONFIG.error.server);
          addNotification({ type: 'error', message: APP_CONFIG.error.server });
        }
      })
      .finally(() => setIsCreating(false));
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement | HTMLDivElement | HTMLInputElement>): void {
    event.preventDefault();
    createForm.reset();
  }

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={''} breadcrumb={UC_CONFIG.breadcrumb} />
        <BackButton label={UC_CONFIG.buttons.back} />
      </header>
      {/* Section: Form */}
      <section className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-2 lg:gap-6'>
        <Card className='w-full md:grid-cols-2'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FilePlus2 className='h-4 w-4' strokeWidth={2} />
                <span>{UC_CONFIG.formTitle}</span>
              </div>
            </CardTitle>
            <CardDescription>{UC_CONFIG.formDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateUser)} className='space-y-4'>
                {/* Form field: DNI */}
                <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <FormField
                    control={createForm.control}
                    name='dni'
                    render={({ field }) => (
                      <FormItem className=''>
                        <FormLabel>{UC_CONFIG.labels.dni}</FormLabel>
                        <FormControl className='h-9'>
                          <Input type='number' placeholder={UC_CONFIG.placeholders.dni} {...field} maxLength={USER_SCHEMA.dni.max.value} />
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
                        <FormLabel>{UC_CONFIG.labels.lastName}</FormLabel>
                        <FormControl className='h-9'>
                          <Input placeholder={UC_CONFIG.placeholders.lastName} {...field} />
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
                        <FormLabel>{UC_CONFIG.labels.firstName}</FormLabel>
                        <FormControl className='h-9'>
                          <Input placeholder={UC_CONFIG.placeholders.firstName} {...field} />
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
                        <FormLabel>{UC_CONFIG.labels.email}</FormLabel>
                        <FormControl className='h-9'>
                          <Input placeholder={UC_CONFIG.placeholders.email} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{UC_CONFIG.labels.phone}</FormLabel>
                        <FormControl className='h-9'>
                          <Input type='number' placeholder={UC_CONFIG.placeholders.phone} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
                {/* Buttons */}
                <footer className='grid grid-cols-1 space-y-2 pt-2 md:flex md:justify-end md:gap-6 md:space-y-0'>
                  <Button type='submit' className='order-1 md:order-2 lg:order-2'>
                    {isCreating ? <LoadingDB text={UC_CONFIG.buttons.creating} variant='button' /> : UC_CONFIG.buttons.create}
                  </Button>
                  <Button variant={'ghost'} onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                    {UC_CONFIG.buttons.cancel}
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
            <DialogTitle className='text-xl'>{UC_CONFIG.dialog.title}</DialogTitle>
            <DialogDescription className='sr-only'></DialogDescription>
            <div className='flex flex-col pt-2'>
              <span className=''>{errorMessage}</span>
              <div className='mt-5 flex justify-end space-x-4'>
                <Button variant='default' size='sm' onClick={() => setOpenDialog(false)}>
                  {UC_CONFIG.dialog.button.close}
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
