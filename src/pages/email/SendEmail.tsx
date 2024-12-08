// Icons: https://lucide.dev/icons/
import { Mail, Send } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardTitle } from '@core/components/ui/card';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Input } from '@core/components/ui/input';
import { Textarea } from '@core/components/ui/textarea';
// Components
import { LoadingText } from '@core/components/common/LoadingText';
import { PageHeader } from '@core/components/common/PageHeader';
import { SendEmailSuccess } from '@email/components/SendEmailSuccess';
// External imports
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
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
// React component
export default function SendEmail() {
  const capitalize = useCapitalize();
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
    isPending: isPendingMutation,
    isSuccess: isSuccessMutation,
    mutateAsync,
  } = useMutation({
    mutationKey: ['sendEmail', id],
    mutationFn: async (data: z.infer<typeof emailSchema>) => await EmailApiService.sendEmail(data),
    retry: 0,
    onSuccess: () => {
      resetForm();
      // TODO: addNotification
    },
  });

  function handleSendEmail(data: z.infer<typeof emailSchema>): void {
    mutateAsync(data);
  }

  function resetForm(): void {
    // TODO: cancel mutation too if is pending (no internet connection)
    emailForm.reset(defaultValues);
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
            {!isSuccessMutation ? (
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
                            <Input type='text' disabled className='disabled:!opacity-100' defaultValue={field.value} />
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
                    disabled={isPending}
                    size='sm'
                    variant='default'
                    className='order-1 w-full gap-2 md:order-2 md:w-fit'
                    onClick={emailForm.handleSubmit(handleSendEmail)}
                  >
                    <Send size={16} strokeWidth={2} />
                    {isPendingMutation ? <LoadingText text={t('loading.sending')} suffix='...' className='text-background' /> : t('button.sendEmail')}
                  </Button>
                </footer>
              </Form>
            ) : (
              <SendEmailSuccess />
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}