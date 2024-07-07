// Icons: https://lucide.dev/icons/
import { ArrowLeft, FilePen, Menu } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
// App components
import { PageHeader } from '@/core/components/common/PageHeader';
// App
import { IUser } from '@/pages/users/interfaces/user.interface';
import { USER_UPDATE_CONFIG as UU_CONFIG } from '@/config/user.config';
import { UserApiService } from '@/pages/users/services/user-api.service';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { userSchema } from '@/pages/users/schemas/user.schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/core/components/ui/input';
import { USER_SCHEMA } from '@/config/schemas/user.schema';
import { LoadingDB } from '@/core/components/common/LoadingDB';
import { APP_CONFIG } from '@/config/app.config';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// React component
export default function UpdateUser() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>({} as IUser);
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const { id } = useParams();
  // #region Form actions
  const defaultValues = {
    dni: 0,
    email: '',
    firstName: '',
    lastName: '',
    phone: 0,
  };

  const updateForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues,
  });

  function handleUpdateUser(data: z.infer<typeof userSchema>): void {
    console.log(data);
  }

  function handleCancel(): void {
    console.log('Cancel');
  }
  // #endregion
  // #region Load user data
  useEffect(() => {
    // prettier-ignore
    if (id) {
      setIsLoading(true);
      UserApiService
        .findOne(id)
        .then((response) => {
          console.log(response);
          setUser(response.data);
          setIsLoading(false);

          updateForm.setValue('dni', response.data.dni);
          updateForm.setValue('email', response.data.email);
          updateForm.setValue('firstName', capitalize(response.data.firstName) || '');
          updateForm.setValue('lastName', capitalize(response.data.lastName) || '');
          updateForm.setValue('phone', response.data.phone);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  // #endregion

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={''} breadcrumb={UU_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          {UU_CONFIG.button.back}
        </Button>
      </div>
      {/* Form */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-2 lg:gap-6'>
        <Card className='w-full md:grid-cols-2'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FilePen className='h-4 w-4' strokeWidth={2} />
                <span>{UU_CONFIG.formTitle}</span>
              </div>
              {/* Dropdown menu */}
              <Button variant={'tableHeader'} size={'miniIcon'}>
                <Menu className='h-4 w-4' strokeWidth={2} />
              </Button>
            </CardTitle>
            {!isLoading && <CardDescription>{UU_CONFIG.formDescription}</CardDescription>}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingDB text={APP_CONFIG.loadingDB.findOneUser} className='mt-3' />
            ) : (
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(handleUpdateUser)} className='space-y-4'>
                  {/* Form field: DNI */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={updateForm.control}
                      name='dni'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{UU_CONFIG.label.dni}</FormLabel>
                          <FormControl className='h-9'>
                            <Input type='number' placeholder={UU_CONFIG.placeholder.dni} {...field} maxLength={USER_SCHEMA.dni.max.value} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Form fields: lastName and firstName */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={updateForm.control}
                      name='lastName'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{UU_CONFIG.label.lastName}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={UU_CONFIG.placeholder.lastName} {...field} />
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
                          <FormLabel>{UU_CONFIG.label.firstName}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={UU_CONFIG.placeholder.firstName} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Form fields: email and phone */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={updateForm.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{UU_CONFIG.label.email}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={UU_CONFIG.placeholder.email} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateForm.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{UU_CONFIG.label.phone}</FormLabel>
                          <FormControl className='h-9'>
                            <Input type='number' placeholder={UU_CONFIG.placeholder.phone} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Buttons */}
                  <div className='grid grid-cols-1 space-y-2 pt-2 md:flex md:justify-end md:gap-6 md:space-y-0'>
                    <Button type='submit' className='order-1 md:order-2 lg:order-2'>
                      {UU_CONFIG.button.update}
                    </Button>
                    <Button variant={'ghost'} onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                      {UU_CONFIG.button.cancel}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
