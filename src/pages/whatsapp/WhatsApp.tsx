// Icons: https://lucide.dev/icons
import { ArrowLeft } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
import { Textarea } from '@/core/components/ui/textarea';
// App components
import { PageHeader } from '@/core/components/common/PageHeader';
// App
import { APP_CONFIG } from '@/config/app.config';
import { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { IResponse } from '@/core/interfaces/response.interface';
import { IUser } from '@/pages/users/interfaces/user.interface';
import { LoadingDB } from '@/core/components/common/LoadingDB';
import { MouseEvent, useEffect, useState } from 'react';
import { ProfessionalApiService } from '@/pages/professionals/services/professional-api.service';
import { UserApiService } from '@/pages/users/services/user-api.service';
import { WHATSAPP_CONFIG } from '@/config/whatsapp.config';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// React component
export default function WhatsApp() {
  const [addressee, setAddressee] = useState<IProfessional | IUser>({} as IProfessional | IUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const { id, type } = useParams();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // TODO: manage errors
      if (type === 'user') {
        setLoadingMessage(APP_CONFIG.loadingDB.findOneUser);
        // prettier-ignore
        UserApiService
        .findOne(id)
        .then((response: IResponse) => {
          if (response.statusCode === 200) {
            setAddressee(response.data);
            whatsappForm.setValue('phone', response.data.phone);
            setIsLoading(false);
          }
        });
      }
      if (type === 'professional') {
        setLoadingMessage(APP_CONFIG.loadingDB.findOneProfessional);
        // prettier-ignore
        ProfessionalApiService
        .findOne(id)
        .then((response: IResponse) => {
          if (response.statusCode === 200) {
            setAddressee(response.data);
            whatsappForm.setValue('phone', response.data.phone);
            setIsLoading(false);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  // #region Form
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
  // #endregion
  // #region Buttons actions
  function sendMessage(e: z.infer<typeof whatsappSchema>) {
    console.log(e);
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    navigate(-1);
  }
  // #endregion

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={''} breadcrumb={WHATSAPP_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          {WHATSAPP_CONFIG.button.back}
        </Button>
      </div>
      {/* Page Content */}
      <div className='mx-auto mt-4 flex w-full flex-row px-2 md:w-[500px]'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <svg width='100' height='100' viewBox='0 0 464 488' className='h-4 w-4'>
                  <path d='M462 228q0 93-66 159t-160 66q-56 0-109-28L2 464l40-120q-32-54-32-116q0-93 66-158.5T236 4t160 65.5T462 228zM236 39q-79 0-134.5 55.5T46 228q0 62 36 111l-24 70l74-23q49 31 104 31q79 0 134.5-55.5T426 228T370.5 94.5T236 39zm114 241q-1-1-10-7q-3-1-19-8.5t-19-8.5q-9-3-13 2q-1 3-4.5 7.5t-7.5 9t-5 5.5q-4 6-12 1q-34-17-45-27q-7-7-13.5-15t-12-15t-5.5-8q-3-7 3-11q4-6 8-10l6-9q2-5-1-10q-4-13-17-41q-3-9-12-9h-11q-9 0-15 7q-19 19-19 45q0 24 22 57l2 3q2 3 4.5 6.5t7 9t9 10.5t10.5 11.5t13 12.5t14.5 11.5t16.5 10t18 8.5q16 6 27.5 10t18 5t9.5 1t7-1t5-1q9-1 21.5-9t15.5-17q8-21 3-26z' />
                </svg>
                <span>{WHATSAPP_CONFIG.title}</span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <LoadingDB text={loadingMessage} className='mt-3' />
            ) : (
              <>
                <div className='mt-1 text-base'>
                  {WHATSAPP_CONFIG.subtitle}
                  <span className='font-bold'>{` ${capitalize(addressee.firstName)} ${capitalize(addressee.lastName)}`}</span>.
                </div>
                <Form {...whatsappForm}>
                  <form onSubmit={whatsappForm.handleSubmit(sendMessage)} className='mt-4 flex flex-col gap-4'>
                    <FormField
                      control={whatsappForm.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{WHATSAPP_CONFIG.label.phone}</FormLabel>
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
                          <FormLabel>{WHATSAPP_CONFIG.label.message}</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='grid grid-cols-1 space-y-2 pt-2 md:flex md:justify-end md:gap-6 md:space-y-0'>
                      <Button type='submit' variant={'default'} className='order-1 md:order-2 lg:order-2'>
                        {WHATSAPP_CONFIG.button.sendMessage}
                      </Button>
                      <Button variant={'ghost'} onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                        {WHATSAPP_CONFIG.button.cancel}
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
    // <div>
    //   <h1>WhatsApp for {professional.lastName} - {id}</h1>
    //   <form onSubmit={(e) => sendMessage(e)}>
    //     <input type="text" defaultValue={professional.phone} />
    //     <textarea />
    //     <button type='submit'>{WHATSAPP_CONFIG.button.sendMessage}</button>
    //   </form>
    // </div>
  );
}
