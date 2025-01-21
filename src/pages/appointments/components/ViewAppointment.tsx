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
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IAppointment } from '@appointments/interfaces/appointment.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { UtilsString } from '@core/services/utils/string.service';
import { VIEW_APPOINTMENT_CONFIG as VA_CONFIG } from '@config/appointments/view-appointment.config';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
import { EmailApiService } from '@email/services/email.service';
// React component
export default function ViewAppointment() {
  const [date, setDate] = useState<string>('');
  const [pdfIsGenerating, setPdfIsGenerating] = useState<boolean>(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { i18n, t } = useTranslation();
  const { id } = useParams();

  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[1].id);
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
    retry: 1,
  });

  useEffect(() => {
    if (appointment) {
      const legibleDate: string = format(appointment.data.day, 'full', i18n.language);
      const capitalized = UtilsString.upperCase(legibleDate, 'first');
      setDate(capitalized);
    }
  }, [appointment, i18n.language]);

  function downloadPDF(): void {
    const input: HTMLDivElement | null = pdfRef.current;
    // TODO: send pdf as attachment! Research
    if (input) {
      setPdfIsGenerating(true);

      htmlToImage
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
          sendEmail(pdf);
          // pdf.save(`${appointment?.data.user.dni}-${appointment?.data.day}.pdf`);
        })
        .finally(() => setPdfIsGenerating(false));
    }
  }

  async function sendEmail(pdf: jsPDF) {
    if (appointment?.data.user.email) {
      // const buffer = Buffer.from(pdf.output('arraybuffer'));
      // console.log(buffer.length);
      // const blob = new Blob([buffer], { type: 'application/pdf' });
      // console.log(blob.size);
      EmailApiService.sendEmail({
        to: [appointment.data.user.email],
        body: 'This is the constancy of the appointment',
        subject: 'Constancy',
        attachments:
          [{
            filename: `${appointment?.data.user.dni}-${appointment?.data.day}.pdf`,
            content: pdf.output('datauristring'),
          }],
      }).then((data) => console.log(data)).finally(() => console.log(pdf.output('datauristring').length));
    }
  }

  return (
    <main className='flex flex-1 flex-col p-4 md:p-8'>
      {/* Section: Page Header */}
      <section className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.viewAppointment')} breadcrumb={VA_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </section>
      {/* Section: Page content (Appo details card) */}
      {isLoading && <LoadingDB variant='card' text={t('loading.appointmentDetails')} absolute />}
      {isError && (
        <InfoCard
          type='error'
          text={error.message}
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-3 py-2 shadow-sm'
        />
      )}
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
                <Link to={`/users/${appointment?.data.user._id}`}>
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
          <footer className='mx-auto flex w-full justify-between md:w-[500px] lg:w-[500px]'>
            <div className='flex gap-2'>
              <button
                className='flex items-center gap-2 rounded-sm bg-transparent px-2 py-1.5 text-xs text-stone-600 transition-colors hover:bg-stone-200 hover:text-stone-600'
                onClick={downloadPDF}
              >
                {pdfIsGenerating ? (
                  <LoadingDB iconSize={16} variant='default' text={t('loading.generatingPDF')} className='p-0 text-xs text-foreground' />
                ) : (
                  <>
                    <Printer size={14} strokeWidth={2} />
                    <span>{t('label.print')}</span>
                  </>
                )}
              </button>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-xsm font-medium text-slate-600'>{t('label.sendBy')}</span>
              <button
                className='flex items-center gap-2 rounded-sm bg-transparent px-2 py-1.5 text-xs text-slate-600 transition-colors hover:bg-sky-100 hover:text-sky-600'
                onClick={() => console.log('Send by email')}
              >
                {appointment?.data.user.email ? <Mail size={14} strokeWidth={2} /> : <MailX size={14} strokeWidth={2} className='stroke-red-400' />}
                <span>{t('button.email')}</span>
              </button>
              <button
                className='flex items-center gap-2 rounded-sm bg-transparent px-2 py-1.5 text-xs text-slate-600 transition-colors hover:bg-emerald-100 hover:text-emerald-600'
                onClick={() => console.log('Send by message')}
              >
                <MessageCircle size={14} strokeWidth={2} />
                <span>{t('label.message')}</span>
              </button>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
