// Icons: https://lucide.dev/icons
import { ArrowLeft, FilePen } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
import { Textarea } from '@/core/components/ui/textarea';
// App components
import { PageHeader } from '@/core/components/common/PageHeader';
// App
import { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { IResponse } from '@/core/interfaces/response.interface';
import { UserApiService } from '@/pages/users/services/user-api.service';
import { WHATSAPP_CONFIG } from '@/config/whatsapp.config';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// React component
export default function WhatsApp() {
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  
  useEffect(() => {

    console.log(params);

    if (id) {
      UserApiService.findOne(id).then((response: IResponse) => {
        setProfessional(response.data);
        console.log(response);
        whatsappForm.setValue('phone', response.data.phone);
      });
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
    //console.log(e.target[0].value, e.target[1].value);
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
                <FilePen className='h-4 w-4' strokeWidth={2} />
                <span>{WHATSAPP_CONFIG.title}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mt-1 text-base'>
              {WHATSAPP_CONFIG.subtitle}
              <span className='font-bold'>{` ${capitalize(professional.firstName)} ${capitalize(professional.lastName)}`}</span>.
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
