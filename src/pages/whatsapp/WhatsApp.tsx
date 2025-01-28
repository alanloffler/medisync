// Icons: https://lucide.dev/icons/
import { Check, RefreshCw, X } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Input } from '@core/components/ui/input';
import { Textarea } from '@core/components/ui/textarea';
// QRCode: https://github.com/rosskhanas/react-qr-code#readme
import QRCode from 'react-qr-code';
// Components
import { BackButton } from '@core/components/common/BackButton';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { LoadingText } from '@core/components/common/LoadingText';
import { PageHeader } from '@core/components/common/PageHeader';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { MouseEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
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
import { WhatsappApiService } from '@whatsapp/services/whatsapp-api.service';
import { cn } from '@lib/utils';
import { socket } from '@core/services/socket.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export default function WhatsApp(): JSX.Element {
  const [qrcode, setQrcode] = useState<string | undefined>(undefined);
  const [serverError, setServerError] = useState<boolean>(false);
  const [socketId, setSocketId] = useState<string | undefined>(undefined);
  const [whatsappConnected, setWhatsappConnected] = useState<boolean>(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string | undefined>(undefined);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const { id, type } = useParams();
  const { t } = useTranslation();

  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [connectingSocket, setConnectingSocket] = useState<boolean>(true);

  function connect() {
    console.log('[STATUS]: socket connected', socket.id);
    setConnectingSocket(false);
    setSocketConnected(true);
    setSocketId(socket.id);
    setServerError(false);
    setQrcode(undefined);
  }

  function connect_error() {
    console.log('[ERROR]: internal server error');
    setServerError(true);
  }

  function disconnect(reason: string) {
    console.log('[STATUS]: socket disconnected', reason);
    setSocketConnected(false);
    setWhatsappConnected(false);
  }

  function status(status: { message: string; connected: boolean; data: string }) {
    console.log('[STATUS]: WhatsApp', { message: status.message, connected: status.connected, data: status.data });
    if (status.connected) {
      setWhatsappConnected(true);
      setWhatsappNumber(status.data);
    } else {
      setWhatsappConnected(false);
    }
  }

  function qr(qrcode: string) {
    console.log(qrcode);
    setQrcode(qrcode);
  }

  useEffect(() => {
    socket.disconnect();
    socket.connect();

    socket.on('connect', connect);
    socket.on('connect_error', connect_error);
    socket.on('disconnect', disconnect);
    socket.on('status', status);
    socket.on('qr', qr);

    return () => {
      socket.off('connect', connect);
      socket.off('connect_error', connect_error);
      socket.off('disconnect', disconnect);
      socket.off('status', status);
      socket.off('qr', qr);
      socket.disconnect();
    };
  }, []);

  function handleReconnect(): void {
    socket.disconnect();
    setConnectingSocket(true);
    socket.connect();
  }

  // Form and schema
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

  // TODO: manage errors and loading
  const { data: user, isLoading } = useQuery<IResponse<IUser | IProfessional>, Error>({
    queryKey: ['whatsapp', id, type],
    queryFn: async () => {
      if (id && type) return type === 'user' ? await UserApiService.findOne(id) : await ProfessionalApiService.findOne(id);
    },
    retry: 1,
  });

  useEffect(() => {
    // TODO: Add template message from lang files
    if (user?.data.phone) {
      let content: string = '';
      whatsappForm.setValue('phone', Number(`${user?.data.areaCode}${user?.data.phone}`));
      content += 'Hola Alan\n';
      content += 'Mensaje de WhatsApp\n';
      whatsappForm.setValue('message', content);
      whatsappForm.setFocus('message');
    }
  }, [user?.data.areaCode, user?.data.phone, whatsappForm]);

  // Actions
  // TODO: type response when setted on backend and on service
  const {
    error: errorMessage,
    mutate: sendMessage,
    isError: isErrorMessage,
    isPending: isPendingMessage,
    isSuccess: isSuccessMessage,
  } = useMutation<IResponse<any>, Error, z.infer<typeof whatsappSchema>>({
    mutationKey: ['whatsapp', 'send'],
    mutationFn: async (data) => await WhatsappApiService.send(data),
    onError: (error) => {
      console.log(error.message);
      addNotification({ type: 'error', message: error.message });
    },
    retry: 1,
  });

  async function handleSendMessage(data: z.infer<typeof whatsappSchema>): Promise<void> {
    sendMessage(data);
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    navigate(-1);
  }

  return (
    <main className='flex flex-1 flex-col gap-6 p-6 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Section: Page Header */}
      <section className='flex items-center justify-between'>
        <PageHeader title={''} breadcrumb={WHATSAPP_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </section>
      {/* Section: Page Content */}
      <section className='grid gap-6 md:grid-cols-6 md:gap-8'>
        <section className='col-span-1 border-none bg-slate-200 bg-transparent shadow-none md:col-span-3 lg:col-span-2'>
          <Card>
            <header
              className={cn(
                'flex items-center justify-between gap-3 rounded-b-none rounded-t-lg border-b bg-card text-sm font-semibold leading-none tracking-tight',
                serverError ? 'p-4' : 'p-2 pl-4',
              )}
            >
              <span>{t('cardTitle.serviceStatus')}</span>
              {!serverError && (
                <TooltipWrapper tooltip={t('tooltip.reconnect')}>
                  <Button variant='ghost' size='miniIcon' onClick={handleReconnect} className='hover:bg-fuchsia-100'>
                    <RefreshCw size={16} strokeWidth={2} className='stroke-fuchsia-400' />
                  </Button>
                </TooltipWrapper>
              )}
            </header>
            <CardContent className='space-y-4 pt-6'>
              {serverError && (
                <div className='flex flex-col items-center space-y-6'>
                  <InfoCard type='error' text={t('error.serverConnection')} className='w-full justify-start p-0 text-xsm' />
                  <Button variant='secondary' size='sm' className='text-xsm'>
                    {t('button.technicalService')}
                  </Button>
                </div>
              )}
              {!serverError && connectingSocket && <LoadingDB text={t('loading.serverConnecting')} className='p-0 !text-xsm text-foreground' />}
              {!serverError && !connectingSocket && socketConnected && (
                <div className='bg-orange-0 flex w-fit items-center justify-start space-x-3 rounded-md text-xsm'>
                  <Check size={14} strokeWidth={3} className='stroke-emerald-400' />
                  <span className='font-medium'>{t('label.socket')}</span>
                  <span className='text-xs text-orange-400'>{socketId ? socketId : t('error.serverConnection')}</span>
                </div>
              )}
              {!serverError && !connectingSocket && whatsappConnected && (
                <div className='bg-orange-0 flex w-fit items-center justify-start space-x-3 rounded-md text-xsm'>
                  <Check size={14} strokeWidth={3} className='stroke-emerald-400' />
                  <span className='font-medium'>{t('label.whatsapp')}</span>
                  <span className='text-xs text-emerald-400'>{whatsappNumber}</span>
                </div>
              )}
              {!serverError && !connectingSocket && !whatsappConnected && (
                <div className='space-y-6'>
                  <div className='bg-orange-0 flex w-fit items-center justify-start space-x-3 rounded-md text-xsm'>
                    <X size={14} strokeWidth={3} className='stroke-rose-400' />
                    <span className='font-medium'>{t('label.whatsapp')}</span>
                    <span className='text-xs text-rose-400'>{t('error.notWhatsappSession')}</span>
                  </div>
                  {!qrcode && <LoadingText text={t('loading.session')} suffix='...' className='text-left text-xsm' />}
                  {qrcode && (
                    <section className='flex flex-col space-y-3'>
                      <section className='mx-auto w-3/4 space-x-3'>
                        <QRCode size={100} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={qrcode} viewBox={`0 0 128 128`} />
                      </section>
                      <span className='text-xsm'>{t('cardContent.scanQRCode')}</span>
                    </section>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        <section className='col-span-1 h-fit overflow-y-auto md:col-span-3 lg:col-span-4 xl:col-span-4'>
          <Card className='w-full md:max-w-[500px]'>
            <header className='flex items-center justify-start gap-3 rounded-b-none rounded-t-lg border-b bg-card p-4 text-lg font-semibold leading-none tracking-tight'>
              <svg width='100' height='100' viewBox='0 0 464 488' className='h-4 w-4'>
                <path d='M462 228q0 93-66 159t-160 66q-56 0-109-28L2 464l40-120q-32-54-32-116q0-93 66-158.5T236 4t160 65.5T462 228zM236 39q-79 0-134.5 55.5T46 228q0 62 36 111l-24 70l74-23q49 31 104 31q79 0 134.5-55.5T426 228T370.5 94.5T236 39zm114 241q-1-1-10-7q-3-1-19-8.5t-19-8.5q-9-3-13 2q-1 3-4.5 7.5t-7.5 9t-5 5.5q-4 6-12 1q-34-17-45-27q-7-7-13.5-15t-12-15t-5.5-8q-3-7 3-11q4-6 8-10l6-9q2-5-1-10q-4-13-17-41q-3-9-12-9h-11q-9 0-15 7q-19 19-19 45q0 24 22 57l2 3q2 3 4.5 6.5t7 9t9 10.5t10.5 11.5t13 12.5t14.5 11.5t16.5 10t18 8.5q16 6 27.5 10t18 5t9.5 1t7-1t5-1q9-1 21.5-9t15.5-17q8-21 3-26z' />
              </svg>
              <span>{t('cardTitle.phoneMessage')}</span>
            </header>
            <CardContent className='pt-5'>
              {isLoading ? (
                <LoadingDB text={t(type === 'user' ? 'loading.userDetails' : 'loading.professionalDetails')} />
              ) : isSuccessMessage ? (
                <InfoCard type='success' text='Mensaje enviado exitosamente' />
              ) : (
                <>
                  <section className='text-sm'>
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
                    <form onSubmit={whatsappForm.handleSubmit(handleSendMessage)} className='mt-4 flex flex-col gap-4'>
                      <FormField
                        control={whatsappForm.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>{t('label.phone')}</FormLabel>
                            <FormControl className='h-9'>
                              <Input className='pointer-events-none' {...field} />
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
                      {JSON.stringify(errorMessage?.message)}
                      {isPendingMessage && <LoadingDB text={t('loading.sendingPhoneMessage')} className='w-full justify-start p-0 text-primary' />}
                      {isErrorMessage && <InfoCard type='error' text={errorMessage.message} className='justify-start p-0 text-rose-400' />}
                      <footer className='grid grid-cols-1 space-y-2 md:flex md:justify-end md:gap-6 md:space-y-0'>
                        <Button
                          type='submit'
                          disabled={whatsappForm.watch('message') === '' || !user?.data.phone || !whatsappConnected}
                          variant='default'
                          className='order-1 md:order-2 lg:order-2'
                        >
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
      </section>
    </main>
  );
}
