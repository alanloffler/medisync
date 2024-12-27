// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@core/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Input } from '@core/components/ui/input';
import { Textarea } from '@core/components/ui/textarea';
// Components
import { BackButton } from '@core/components/common/BackButton';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
// External imports
import { MouseEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { WHATSAPP_CONFIG } from '@config/whatsapp.config';
// React component
export default function WhatsApp() {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const { t } = useTranslation();

  const whatsappSchema = z.object({
    phone: z.coerce.number(),
    message: z.string(),
  });

  const whatsappForm = useForm<z.infer<typeof whatsappSchema>>({
    defaultValues: {
      phone: 0,
      message: '',
    },
    resolver: zodResolver(whatsappSchema),
  });

  const { data: user, isLoading } = useQuery<IResponse<IUser | IProfessional>, Error>({
    queryKey: ['whatsapp', id, type],
    queryFn: async () => {
      if (id && type) return type === 'user' ? await UserApiService.findOne(id) : await ProfessionalApiService.findOne(id);
    },
    retry: 1,
  });

  useEffect(() => {
    if (user?.data.phone) whatsappForm.setValue('phone', Number(`549${user?.data.phone}`));
  }, [user?.data.phone, whatsappForm]);

  function sendMessage(e: z.infer<typeof whatsappSchema>) {
    console.log(e);
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    navigate(-1);
  }

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Section: Page Header */}
      <section className='flex items-center justify-between'>
        <PageHeader title={''} breadcrumb={WHATSAPP_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </section>
      {/* Section: Page Content */}
      <section className='mx-auto mt-4 flex w-full flex-row px-2 md:w-[500px]'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <section className='flex items-center gap-3 px-2 py-1'>
                <svg width='100' height='100' viewBox='0 0 464 488' className='h-4 w-4'>
                  <path d='M462 228q0 93-66 159t-160 66q-56 0-109-28L2 464l40-120q-32-54-32-116q0-93 66-158.5T236 4t160 65.5T462 228zM236 39q-79 0-134.5 55.5T46 228q0 62 36 111l-24 70l74-23q49 31 104 31q79 0 134.5-55.5T426 228T370.5 94.5T236 39zm114 241q-1-1-10-7q-3-1-19-8.5t-19-8.5q-9-3-13 2q-1 3-4.5 7.5t-7.5 9t-5 5.5q-4 6-12 1q-34-17-45-27q-7-7-13.5-15t-12-15t-5.5-8q-3-7 3-11q4-6 8-10l6-9q2-5-1-10q-4-13-17-41q-3-9-12-9h-11q-9 0-15 7q-19 19-19 45q0 24 22 57l2 3q2 3 4.5 6.5t7 9t9 10.5t10.5 11.5t13 12.5t14.5 11.5t16.5 10t18 8.5q16 6 27.5 10t18 5t9.5 1t7-1t5-1q9-1 21.5-9t15.5-17q8-21 3-26z' />
                </svg>
                <span>{t('cardTitle.phoneMessage')}</span>
              </section>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingDB text={t(type === 'user' ? 'loading.userDetails' : 'loading.professionalDetails')} className='mt-3' />
            ) : (
              <>
                <section className='mt-1 text-base'>
                  {type === 'user' && (
                    <Trans
                      i18nKey='cardContent.phoneMessage.user'
                      values={{
                        patient: UtilsString.upperCase(`${user?.data.firstName} ${user?.data.lastName}`, 'each'),
                      }}
                      components={{
                        span: <span className='font-semibold' />,
                      }}
                    />
                  )}
                  {type === 'professional' && (
                    <Trans
                      i18nKey='cardContent.phoneMessage.professional'
                      values={{
                        professional: UtilsString.upperCase(`${user?.data.firstName} ${user?.data.lastName}`, 'each'),
                      }}
                      components={{
                        span: <span className='font-semibold' />,
                      }}
                    />
                  )}
                </section>
                {/* Section: Form */}
                <Form {...whatsappForm}>
                  <form onSubmit={whatsappForm.handleSubmit(sendMessage)} className='mt-4 flex flex-col gap-4'>
                    <FormField
                      control={whatsappForm.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{t('label.phone')}</FormLabel>
                          <FormControl className='h-9'>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={whatsappForm.control}
                      name='message'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('label.message')}</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <footer className='grid grid-cols-1 space-y-2 pt-2 md:flex md:justify-end md:gap-6 md:space-y-0'>
                      <Button type='submit' disabled={!whatsappForm.formState.isValid} variant='default' className='order-1 md:order-2 lg:order-2'>
                        {t('button.sendPhoneMessage')}
                      </Button>
                      <Button variant='ghost' onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                        {t('button.cancel')}
                      </Button>
                    </footer>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
