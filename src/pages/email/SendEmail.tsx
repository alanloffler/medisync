// Icons: https://lucide.dev/icons/
import { Mail, Send, X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardTitle } from '@core/components/ui/card';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Input } from '@core/components/ui/input';
import { Textarea } from '@core/components/ui/textarea';
// Components
import { LoadingText } from '@core/components/common/LoadingText';
import { PageHeader } from '@core/components/common/PageHeader';
import { SendEmailError } from '@email/components/SendEmailError';
import { SendEmailSuccess } from '@email/components/SendEmailSuccess';
// External imports
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { EMAIL_CONFIG } from '@config/email.config';
import { EmailApiService } from '@email/services/email.service';
import { UserApiService } from '@users/services/user-api.service';
import { emailSchema } from '@email/schemas/email.schema';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { spring, animate } from 'motion/react';
// import { motion } from '@core/services/motion.service';
// React component
export default function SendEmail() {
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const sendScope = useRef(null);
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    data: user,
    isPending,
    isSuccess,
  } = useQuery<IResponse<IUser>>({
    queryKey: ['user', id],
    queryFn: async () => id && (await UserApiService.findOne(id)),
    retry: 1,
  });

  const defaultValues = {
    to: [user?.data.email],
    subject: '',
    body: '',
  };

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (isSuccess) emailForm.setValue('to', [user?.data.email] || []);
  }, [emailForm, isSuccess, user?.data.email]);

  const {
    isError: isErrorMutation,
    isPending: isPendingMutation,
    isSuccess: isSuccessMutation,
    mutate,
  } = useMutation<IResponse, Error, z.infer<typeof emailSchema>>({
    mutationKey: ['sendEmail', id],
    mutationFn: async (data: z.infer<typeof emailSchema>) => await EmailApiService.sendEmail(data),
    retry: 0,
    onSuccess: (success) => addNotification({ type: 'success', message: success.message }),
    onError: (error) => addNotification({ type: 'error', message: error.message }),
  });

// TODO: motion animation with custom class
  useEffect(() => {
    if (isPendingMutation) {
      animate(sendScope.current, 
        // { x: -3, y: 3 },
        { x: [-3, 0], y: [3, 0] },
        { duration: 1, repeatDelay:.5, type: spring, repeat: Infinity, bounce: .5 }
      );
    }
  }, [isPendingMutation]);

  function handleSendEmail(data: z.infer<typeof emailSchema>): void {
    mutate(data);
  }

  function resetForm(): void {
    emailForm.reset(defaultValues);
    navigate(-1);
  }

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      <header className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.email')} breadcrumb={EMAIL_CONFIG.breadcrumb} />
      </header>
      <section className='mx-auto w-full md:w-1/2'>
        <Card>
          <CardTitle className='flex items-center justify-between gap-2 rounded-b-none bg-card-header text-slate-700'>
            <header className='flex items-center gap-3.5 p-2'>
              <Mail size={20} strokeWidth={2} />
              {t('cardTitle.email', { username: capitalize(`${user?.data.firstName} ${user?.data.lastName}`) })}
            </header>
          </CardTitle>
          <CardContent className='pt-6'>
            {isSuccessMutation && <SendEmailSuccess />}
            {isErrorMutation && <SendEmailError />}
            {!isSuccessMutation && !isErrorMutation && (
              <Form {...emailForm}>
                <h5 className='text-xsm text-muted-foreground'>{t('email.description', { account: EMAIL_CONFIG.account })}</h5>
                <form onSubmit={emailForm.handleSubmit(handleSendEmail)} className='space-y-4 pt-6'>
                  <FormField
                    control={emailForm.control}
                    name='to'
                    render={({ field }) => (
                      <FormItem>
                        <section className='flex flex-row items-center space-x-3'>
                          <FormLabel>{t('email.to')}</FormLabel>
                          <FormControl className='h-9'>
                            <>
                              {/* <Input type='text' disabled className='disabled:!opacity-100' defaultValue={field.value} /> */}
                              <section className='flex h-10 w-full items-center rounded-md bg-slate-100/70 px-3 py-2 text-sm'>
                                <span className='flex items-center space-x-2 rounded-full bg-fuchsia-200 py-1 pl-2 pr-1 text-xsm font-light text-fuchsia-700'>
                                  <span>{field.value}</span>
                                  <button
                                    className='flex h-4 w-4 items-center justify-center rounded-full bg-fuchsia-300 hover:bg-fuchsia-500 hover:text-fuchsia-100'
                                    onClick={(e) => {
                                      e.preventDefault();
                                      resetForm();
                                    }}
                                  >
                                    <X size={10} strokeWidth={2} />
                                  </button>
                                </span>
                              </section>
                            </>
                          </FormControl>
                        </section>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name='subject'
                    render={({ field }) => (
                      <FormItem>
                        <section className='flex flex-row items-center space-x-3'>
                          <FormLabel>{t('email.subject')}</FormLabel>
                          <FormControl className='h-9'>
                            <Input type='text' {...field} />
                          </FormControl>
                        </section>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name='body'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='body'>{t('email.body')}</FormLabel>
                        <FormControl className='h-9'>
                          <Textarea id='body' rows={4} {...field} className='h-auto' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
                <footer className='flex flex-col items-center justify-end gap-6 pt-6 md:flex-row'>
                  <Button className='order-2 w-full md:order-1 md:w-fit' size='sm' variant='ghost' onClick={resetForm}>
                    {t('button.cancel')}
                  </Button>
                  <Button
                    type='submit'
                    disabled={isPending || isPendingMutation}
                    size='sm'
                    variant='default'
                    className='order-1 w-full gap-2 md:order-2 md:w-fit'
                    onClick={emailForm.handleSubmit(handleSendEmail)}
                    // onMouseOver={onover}
                  >
                    <Send ref={sendScope} size={16} strokeWidth={2} />
                    {isPendingMutation ? <LoadingText text={t('loading.sending')} suffix='...' className='text-background' /> : t('button.sendEmail')}
                  </Button>
                </footer>
              </Form>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
