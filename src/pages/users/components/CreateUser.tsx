// Icons: https://lucide.dev/icons/
import { ArrowLeft, CreditCard, FilePlus, Mail, Menu, Smartphone } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
// import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
// App components
import { PageHeader } from '@/core/components/common/PageHeader';
// App
import { useNavigate } from 'react-router-dom';
import { USER_CREATE_CONFIG as UC_CONFIG } from '@/config/user.config';
import { UserApiService } from '../services/user-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useEffect, useState, MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNotificationsStore } from '@/core/stores/notifications.store';
import { userSchema } from '../schemas/user.schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { USER_SCHEMA } from '@/config/schemas/user.schema';
import { useDelimiter } from '@/core/hooks/useDelimiter';
// React component
export default function CreateUser() {
  const [showUserCard, setShowUserCard] = useState<boolean>(false);

  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const delimiter = useDelimiter();
  const navigate = useNavigate();
  // #region Form config and actions
  const defaultValues = {
    dni: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  };

  const createForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    const isDirty = createForm.formState.isDirty;
    if (isDirty) setShowUserCard(true);
    if (!isDirty) setShowUserCard(false);
  }, [createForm.formState.isDirty, showUserCard]);

  function handleCreateUser(data: z.infer<typeof userSchema>) {
    UserApiService.create(data).then((response) => {
      if (response.statusCode === 200) {
        addNotification({ type: 'success', message: response.message });
      }
      if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
      if (response instanceof Error) addNotification({ type: 'error', message: 'Error en el servidor creando el usuario' });
      createForm.reset();
      setShowUserCard(false);
    });
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement | HTMLDivElement | HTMLInputElement>) {
    event.preventDefault();
    createForm.reset();
    setShowUserCard(false);
  }
  // const dniRef = useMask({ mask: '+549 (____) ______', replacement: { _: /\d/ } });
  // #endregion
  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={''} breadcrumb={UC_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          {UC_CONFIG.buttons.back}
        </Button>
      </div>
      {/* Form */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-2 lg:gap-6'>
        <Card className='w-full md:grid-cols-2'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FilePlus className='h-4 w-4' strokeWidth={2} />
                <span>{UC_CONFIG.formTitle}</span>
              </div>
              {/* Dropdown menu */}
              <Button variant={'tableHeader'} size={'miniIcon'}>
                <Menu className='h-4 w-4' strokeWidth={2} />
              </Button>
            </CardTitle>
            <CardDescription>{UC_CONFIG.formDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateUser)} className='space-y-4'>
                {/* Form field: DNI */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <FormField
                    control={createForm.control}
                    name='dni'
                    render={({ field }) => (
                      <FormItem className=''>
                        <FormLabel>{UC_CONFIG.labels.dni}</FormLabel>
                        <FormControl className='h-9'>
                          {/* <Input placeholder={UC_CONFIG.placeholders.dni} {...field} ref={dniRef}  /> */}
                          <Input type='number' placeholder={UC_CONFIG.placeholders.dni} {...field} maxLength={USER_SCHEMA.dni.max.value} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Form fields: lastName and firstName */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
                </div>
                {/* Form fields: email and phone */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
                </div>
                {/* Buttons */}
                <div className='grid grid-cols-1 space-y-2 pt-2 md:flex md:justify-end md:gap-6 md:space-y-0'>
                  <Button type='submit' className='order-1 md:order-2 lg:order-2'>
                    {UC_CONFIG.buttons.create}
                  </Button>
                  <Button variant={'ghost'} onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                    {UC_CONFIG.buttons.cancel}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        {showUserCard && (
          <div className='mx-auto w-full animate-fadeIn justify-items-center md:grid-cols-1 lg:grid-cols-1'>
            <div className='mx-auto flex h-full items-center justify-center'>
              <Card className='w-full md:w-2/3 lg:w-2/3'>
                {createForm.watch('lastName') !== '' || createForm.watch('firstName') !== '' ? (
                  <CardHeader>
                    <CardTitle>
                      <div className='relative flex items-center justify-center'>
                        <h1 className='text-center text-2xl font-bold'>
                          {capitalize(createForm.watch('lastName'))}, {capitalize(createForm.watch('firstName'))}
                        </h1>
                      </div>
                    </CardTitle>
                  </CardHeader>
                ) : null}
                <CardContent className='mt-3 space-y-3'>
                  {createForm.watch('dni') !== '' && (
                    <div className='flex items-center space-x-4'>
                      <CreditCard className='h-6 w-6' strokeWidth={2} />
                      <span className='text-lg font-medium'>{delimiter(createForm.watch('dni'), '.', 3)}</span>
                    </div>
                  )}
                  {createForm.watch('phone') !== '' && (
                    <div className='flex items-center gap-4'>
                      <Smartphone className='h-6 w-6' strokeWidth={2} />
                      <span className='text-lg font-medium'>{delimiter(createForm.watch('phone'), '-', 6)}</span>
                    </div>
                  )}
                  {createForm.watch('email') !== '' && (
                    <div className='flex items-center space-x-4'>
                      <Mail className='h-6 w-6' strokeWidth={2} />
                      <span className='text-lg font-medium'>{createForm.watch('email')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
