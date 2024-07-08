import { WHATSAPP_CONFIG } from '@/config/whatsapp.config';
import { PageHeader } from '@/core/components/common/PageHeader';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
import { Textarea } from '@/core/components/ui/textarea';
import { IResponse } from '@/core/interfaces/response.interface';
import { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { UserApiService } from '@/pages/users/services/user-api.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, FilePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

export default function WhatsApp() {
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      UserApiService
      .findOne(id)
      .then((response: IResponse) => {
        setProfessional(response.data);
        console.log(response);
        whatsappForm.setValue('phone', response.data.phone);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function sendMessage(e: any) {
    e.preventDefault();
    console.log(e.target[0].value, e.target[1].value);
  }
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
            <Form {...whatsappForm}>
              <form onSubmit={(e) => sendMessage(e)} className='mt-4 flex flex-col gap-4'>
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

                <Textarea />
                <Button type='submit' variant={'default'}>
                  {WHATSAPP_CONFIG.button.sendMessage}
                </Button>
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
