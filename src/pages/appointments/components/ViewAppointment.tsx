// Icons: https://lucide.dev/icons
import { CalendarDays, Clock, Mail, MailX, MessageCircle, Printer } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent, CardTitle } from '@core/components/ui/card';
// Components
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
// External imports
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import { format } from '@formkit/tempo';
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import type { IEmail } from '@core/interfaces/email.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { BackButton } from '@core/components/common/BackButton';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { UtilsString } from '@core/services/utils/string.service';
import { VIEW_APPOINTMENT_CONFIG as VA_CONFIG } from '@config/appointments/view-appointment.config';
import { cn } from '@lib/utils';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
import { useLegibleDate } from '@core/hooks/useDateToString';
// React component
export default function ViewAppointment() {
  const [appointment, setAppointment] = useState<IAppointmentView>({} as IAppointmentView);
  const [dataIsLoading, setDataIsLoading] = useState<boolean>(false);
  const [date, setDate] = useState<string>('');
  const [email, setEmail] = useState<IEmail>({} as IEmail);
  const [pdfIsGenerating, setPdfIsGenerating] = useState<boolean>(false);
  const legibleDate = useLegibleDate();
  const pdfRef = useRef<HTMLDivElement>(null);
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { id } = useParams();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[1].id);
  }, [setItemSelected]);

  useEffect(() => {
    if (id) {
      setDataIsLoading(true);

      AppointmentApiService.findOne(id)
        .then((response) => {
          setAppointment(response.data);

          const legibleDate: string = format(appointment.day, 'full', i18n.language);
          const capitalized = UtilsString.upperCase(legibleDate, 'first');
          capitalized && setDate(capitalized);

          setEmail({
            to: response.data.user.email || VA_CONFIG.email.default,
            subject: i18n.t('email.sendAppointment.subject'),
            body: i18n.t('email.sendAppointment.body', { firstName: UtilsString.upperCase(response.data.user.firstName, 'each') }),
          });
        })
        .finally(() => setDataIsLoading(false));
    }
  }, [appointment.day, i18n.language, i18n, id, legibleDate]);

  function downloadPDF(): void {
    const input: HTMLDivElement | null = pdfRef.current;

    if (input) {
      setPdfIsGenerating(true);

      htmlToImage
        .toCanvas(input)
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
          pdf.save(`${appointment.user.dni}-${appointment.day}.pdf`);
        })
        .finally(() => setPdfIsGenerating(false));
    }
  }

  return (
    <main ref={pdfRef} className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
      {/* Section: Page Header */}
      <section className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.viewAppointment')} breadcrumb={VA_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </section>
      {/* Section: Page content (Appo details card) */}
      {dataIsLoading ? (
        <LoadingDB variant='card' text={t('loading.appointmentDetails')} absolute />
      ) : (
        <>
          <Card className='mx-auto w-full md:w-1/2 lg:w-1/2'>
            <CardTitle className='rounded-b-none bg-primary px-4 py-3 text-base text-background'>
              <header className='flex flex-row justify-between'>
                <div className='flex flex-row items-center gap-2'>
                  <CalendarDays size={18} strokeWidth={2} />
                  <span>{t('cardTitle.viewAppointment')}</span>
                </div>
                <div className='flex flex-row items-center'>
                  {UtilsString.upperCase(
                    `${appointment.professional?.title.abbreviation} ${appointment.professional?.firstName} ${appointment.professional?.lastName}`,
                    'each',
                  )}
                </div>
              </header>
            </CardTitle>
            <CardContent className='mt-6 space-y-3'>
              <Link to={`/users/${appointment.user?._id}`}>
                <span className='flex justify-center text-xl font-semibold underline-offset-2 hover:underline'>
                  {UtilsString.upperCase(`${appointment.user?.firstName} ${appointment.user?.lastName}`, 'each')}
                </span>
              </Link>
              <h2 className='flex items-center gap-5 pt-2 text-base font-medium'>
                <CalendarDays size={20} strokeWidth={2} />
                <span>{date}</span>
              </h2>
              <h2 className='flex items-center gap-5 text-base font-medium'>
                <Clock size={20} strokeWidth={2} />
                <span>
                  {appointment.hour} {t('words.hoursAbbreviation')}
                </span>
              </h2>
              <footer className='flex justify-end space-x-5'>
                {/* TODO: animate all buttons with color and bounce`` */}
                <button className='transition-colors hover:text-indigo-500' onClick={downloadPDF}>
                  <Printer size={20} strokeWidth={2} />
                </button>
                <a
                  href={`https://mail.google.com/mail/?view=cm&to=${email.to}&su=${email.subject}&body=${email.body}`}
                  target='_blank'
                  className={cn('transition-colors hover:text-indigo-500', !appointment.user?.email && 'pointer-events-none')}
                >
                  {appointment.user?.email ? <Mail size={20} strokeWidth={2} /> : <MailX size={20} strokeWidth={2} className='stroke-rose-400' />}
                </a>
                <button className='transition-colors hover:fill-indigo-500'>
                  <MessageCircle size={20} strokeWidth={2} />
                </button>
              </footer>
            </CardContent>
          </Card>
          {pdfIsGenerating && <LoadingDB variant='default' text={t('loading.generatingPDF')} className='text-slate-800' />}
        </>
      )}
    </main>
  );
}
