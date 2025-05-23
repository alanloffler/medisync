// Icons: https://lucide.dev/icons
import { CalendarDays, Clock, Mail, MailX, MessageCircle, Printer } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent, CardTitle } from '@core/components/ui/card';
// Components
import { BackButton } from '@core/components/common/BackButton';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
// External imports
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import { format } from '@formkit/tempo';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import type { IAppointment } from '@appointments/interfaces/appointment.interface';
import type { IEmailAttachment, IEmailData } from '@email/interfaces/email.interface';
import type { IMessage } from '@whatsapp/interfaces/message.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { APP_CONFIG } from '@config/app.config';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { EmailApiService } from '@email/services/email.service';
import { UtilsString } from '@core/services/utils/string.service';
import { VIEW_APPOINTMENT_CONFIG as VA_CONFIG } from '@config/appointments/view-appointment.config';
import { WhatsappApiService } from '@whatsapp/services/whatsapp-api.service';
import { useNavMenuStore } from '@layout/stores/nav-menu.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export default function ViewAppointment() {
  const [date, setDate] = useState<string>('');
  const [pdfIsGenerating, setPdfIsGenerating] = useState<boolean>(false);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const pdfRef = useRef<HTMLDivElement>(null);
  const setItemSelected = useNavMenuStore((state) => state.setNavMenuSelected);
  const { i18n, t } = useTranslation();
  const { id } = useParams();

  useEffect(() => {
    setItemSelected(2);
  }, [setItemSelected]);

  const {
    data: appointment,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useQuery<IResponse<IAppointment>>({
    queryKey: ['appointments', 'findOne', id],
    queryFn: () => AppointmentApiService.findOne(id!),
  });

  useEffect(() => {
    if (appointment) {
      console.log(appointment);
      const legibleDate: string = format(appointment.data.day, 'full', i18n.language);
      const capitalized = UtilsString.upperCase(legibleDate, 'first');
      setDate(capitalized);
    }
  }, [appointment, i18n.language]);

  const {
    data: emailResponse,
    error: emailError,
    isError: isSendingEmailError,
    isPending: isSendingEmail,
    isSuccess: isSendingEmailSuccess,
    mutate: sendEmailWithAttachment,
    reset: resetEmailStatus,
  } = useMutation<IResponse, Error, IEmailData>({
    mutationKey: ['send-email', 'with-pdf'],
    mutationFn: async (data) => await EmailApiService.sendEmail(data),
    onError: (error) => addNotification({ type: 'error', message: error.message }),
    onSuccess: (response) => addNotification({ type: 'success', message: response.message }),
    retry: 0,
  });

  const {
    data: whatsappResponse,
    error: whatsappError,
    isError: isSendingWhatsappError,
    isPending: isSendingWhatsapp,
    isSuccess: isSendingWhatsappSuccess,
    mutate: sendWhatsappMessage,
    reset: resetWhatsappStatus,
  } = useMutation<IResponse, Error, IMessage>({
    mutationKey: ['send-whatsapp', 'message'],
    mutationFn: async (data) => await WhatsappApiService.send(data),
    onError: (error) => addNotification({ type: 'error', message: error.message }),
    onSuccess: (response) => addNotification({ type: 'success', message: response.message }),
    retry: 0,
  });

  async function generatePDF(): Promise<jsPDF | undefined> {
    const input: HTMLDivElement | null = pdfRef.current;

    if (input) {
      setPdfIsGenerating(true);

      return htmlToImage
        .toCanvas(input, { backgroundColor: '#f1f5f9' })
        .then(function (canvas) {
          const pdf: jsPDF = new jsPDF('p', 'px', 'a4', false);
          const pdfWidth: number = pdf.internal.pageSize.getWidth();
          const pdfHeight: number = pdf.internal.pageSize.getHeight();
          const imgWidth: number = canvas.width;
          const imgHeight: number = canvas.height;
          const ratio: number = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX: number = (pdfWidth - imgWidth * ratio) / 2;
          const imgY: number = 0;

          pdf.addImage(canvas, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

          return pdf;
        })
        .finally(() => setPdfIsGenerating(false));
    }
  }

  async function downloadPDF(): Promise<void> {
    const pdf: jsPDF | undefined = await generatePDF();
    if (pdf) {
      const blob: Blob = pdf.output('blob');
      window.open(URL.createObjectURL(blob));
    }
  }

  async function sendEmailWithPDF(): Promise<void> {
    if (appointment?.data.user.email) {
      resetEmailStatus();
      resetWhatsappStatus();

      const pdf: jsPDF | undefined = await generatePDF();
      const attachments: IEmailAttachment[] = [];
      const filename: string = `${appointment?.data.user.dni}-${appointment?.data.day}.pdf`;
      const output: string | undefined = pdf?.output('datauristring', { filename: filename });

      if (output) attachments.push({ filename: filename, path: output });

      const translatedData = getTranslatedData(appointment?.data);
      if (translatedData) {
        const { userName, professionalName, appointmentDay, appointmentHour, adminName } = translatedData;
        let body: string = t('email.template.appointmentReceipt.body', { userName, professionalName, appointmentDay, appointmentHour });
        body += t('email.template.appointmentReceipt.footer', { adminName, appName: t('appName') });

        const emailData: IEmailData = {
          to: [appointment.data.user.email],
          body: body,
          subject: t('email.template.appointmentReceipt.subject', { appName: t('appName') }),
          attachments,
        };

        sendEmailWithAttachment(emailData);
      }
    }
  }

  async function sendPhoneMessage(): Promise<void> {
    if (appointment?.data.user.phone) {
      resetEmailStatus();
      resetWhatsappStatus();

      // TODO: when there's a session, get the admin full name
      const translatedData = getTranslatedData(appointment.data);
      const { adminName, userName, professionalName, appointmentDay, appointmentHour } = translatedData;

      let message: string = `${t('whatsapp.template.appointmentReceipt.header', { appName: t('appName') })}`;
      message += `${t('whatsapp.template.appointmentReceipt.body', { userName, professionalName, appointmentDay, appointmentHour })}`;
      message += `${t('whatsapp.template.appointmentReceipt.footer', { appName: t('appName'), adminName })}`;

      const messageData: IMessage = {
        phone: appointment?.data.user.phone,
        message: message,
      };

      sendWhatsappMessage(messageData);
    }
  }

  function getTranslatedData(appointment: IAppointment) {
    const adminName: string = 'Admin account';
    const userName: string = UtilsString.upperCase(`${appointment.user.firstName} ${appointment.user.lastName}`, 'each');
    const professionalName: string = UtilsString.upperCase(
      `${appointment.professional.title.abbreviation} ${appointment.professional.firstName} ${appointment.professional.lastName}`,
      'each',
    );
    const appointmentDay: string = UtilsString.upperCase(format(appointment.day, 'full', i18n.language), 'first');
    const appointmentHour: string = appointment.hour;

    return { adminName, userName, professionalName, appointmentDay, appointmentHour };
  }

  return (
    <main className='flex flex-1 flex-col p-4 md:p-8'>
      <section className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.viewAppointment')} breadcrumb={VA_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </section>
      {isLoading && <LoadingDB variant='card' text={t('loading.appointmentDetails')} absolute />}
      {isError && <InfoCard className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-sm' text={error.message} variant='error' />}
      {isSuccess && (
        <>
          <div ref={pdfRef} className='mt-6 py-4'>
            <Card className='mx-auto w-full md:w-[500px] lg:w-[500px]'>
              <CardTitle className='rounded-b-none bg-primary px-4 py-3 text-base text-background'>
                <header className='flex flex-row justify-between'>
                  <div className='flex flex-row items-center gap-4'>
                    <CalendarDays size={18} strokeWidth={2} />
                    <span>{t('cardTitle.viewAppointment')}</span>
                  </div>
                  <div className='flex flex-row items-center'>
                    {UtilsString.upperCase(
                      `${appointment?.data.professional.title.abbreviation} ${appointment?.data.professional.firstName} ${appointment?.data.professional.lastName}`,
                      'each',
                    )}
                  </div>
                </header>
              </CardTitle>
              <CardContent className='space-y-3 p-6'>
                <Link to={`${APP_CONFIG.appPrefix}/users/${appointment?.data.user._id}`}>
                  <span className='flex justify-center text-xl font-semibold underline-offset-2 hover:underline'>
                    {UtilsString.upperCase(`${appointment?.data.user.firstName} ${appointment?.data.user.lastName}`, 'each')}
                  </span>
                </Link>
                <h2 className='flex items-center gap-5 pt-2 text-sm'>
                  <CalendarDays size={20} strokeWidth={2} />
                  <div>{date}</div>
                </h2>
                <h2 className='flex items-center gap-5 text-sm'>
                  <Clock size={20} strokeWidth={2} />
                  <div className='flex w-full'>{`${appointment?.data.hour} ${t('words.hoursAbbreviation')}`}</div>
                </h2>
              </CardContent>
            </Card>
          </div>
          <footer className='mx-auto flex w-full flex-col space-y-3 md:w-[500px] lg:w-[500px]'>
            <div className='flex w-full justify-between'>
              <div className='flex gap-2'>
                <button
                  className='flex items-center gap-2 rounded-sm bg-transparent px-2 py-1.5 text-xs text-stone-600 transition-colors hover:bg-stone-200 hover:text-stone-600'
                  onClick={downloadPDF}
                >
                  <Printer size={14} strokeWidth={2} />
                  <span>{t('label.print')}</span>
                </button>
              </div>
              <div className='flex items-center space-x-4'>
                <span className='text-xsm font-medium text-slate-600'>{t('label.sendBy')}</span>
                <button
                  className='flex items-center gap-2 rounded-sm bg-transparent px-2 py-1.5 text-xs text-slate-600 transition-colors hover:bg-sky-100 hover:text-sky-600 disabled:pointer-events-none'
                  disabled={!appointment.data.user.email || isSendingEmail || pdfIsGenerating}
                  onClick={sendEmailWithPDF}
                >
                  {appointment?.data.user.email ? <Mail size={14} strokeWidth={2} /> : <MailX size={14} strokeWidth={2} className='stroke-red-400' />}
                  <span>{t('button.email')}</span>
                </button>
                <button
                  className='flex items-center gap-2 rounded-sm bg-transparent px-2 py-1.5 text-xs text-slate-600 transition-colors hover:bg-emerald-100 hover:text-emerald-600'
                  onClick={sendPhoneMessage}
                >
                  <MessageCircle size={14} strokeWidth={2} />
                  <span>{t('label.message')}</span>
                </button>
              </div>
            </div>
            <section className='mx-auto flex items-center space-x-2'>
              {(pdfIsGenerating || isSendingEmail || isSendingEmailError || isSendingEmailSuccess) && (
                <Card className='p-2 pr-3'>
                  {pdfIsGenerating && (
                    <LoadingDB iconSize={17} variant='default' text={t('loading.generatingPDF')} className='!p-0 !text-xsm text-foreground' />
                  )}
                  {/* {isSendingEmail && ( */}
                  {false && <LoadingDB iconSize={17} variant='default' text={t('loading.sendingEmail')} className='!p-0 !text-xsm text-foreground' />}
                  {isSendingEmailError && <InfoCard text={t(emailError.message)} type='flat' variant='error' />}
                  {isSendingEmailSuccess && !isSendingEmailError && !pdfIsGenerating && !isSendingEmail && (
                    <InfoCard text={emailResponse.message} type='flat' variant='success' />
                  )}
                </Card>
              )}
              {(isSendingWhatsapp || isSendingWhatsappError || isSendingWhatsappSuccess) && (
                <Card className='p-2 pr-3'>
                  {isSendingWhatsapp && (
                    <LoadingDB iconSize={17} variant='default' text={t('loading.sendingPhoneMessage')} className='!p-0 !text-xsm text-foreground' />
                  )}
                  {isSendingWhatsappError && <InfoCard text={t(whatsappError.message)} type='flat' variant='error' />}
                  {isSendingWhatsappSuccess && !isSendingWhatsappError && !isSendingWhatsapp && (
                    <InfoCard text={whatsappResponse.message} type='flat' variant='success' />
                  )}
                </Card>
              )}
            </section>
          </footer>
        </>
      )}
    </main>
  );
}
