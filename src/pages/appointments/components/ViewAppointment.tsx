// Icons: https://lucide.dev/icons
import { CalendarDays, Clock, Link as LinkIcon, Printer, Send } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent, CardHeader, CardTitle } from '@core/components/ui/card';
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
            <CardHeader>
              <CardTitle className='px-3 text-base'>
                <header className='flex flex-row justify-between'>
                  <div className='flex flex-row items-center gap-2'>
                    <CalendarDays className='h-4 w-4' />
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
            </CardHeader>
            <CardContent className='mt-4 space-y-4'>
              <h1 className='flex items-center justify-center gap-2 text-center text-2xl font-semibold'>
                <span>{UtilsString.upperCase(`${appointment.user?.firstName} ${appointment.user?.lastName}`, 'each')}</span>
                <Link to={`/users/${appointment.user?._id}`}>
                  <LinkIcon className='h-3.5 w-3.5' strokeWidth={2} />
                </Link>
              </h1>
              <h2 className='flex items-center gap-5 text-base font-medium'>
                <CalendarDays className='h-5 w-5' strokeWidth={2} />
                <span>{date}</span>
              </h2>
              <h2 className='flex items-center gap-5 text-base font-medium'>
                <Clock className='h-5 w-5' strokeWidth={2} />
                <span>
                  {appointment.hour} {t('words.hoursAbbreviation')}
                </span>
              </h2>
              <footer className='flex justify-end space-x-5'>
                <button className='transition-colors hover:text-indigo-500' onClick={downloadPDF}>
                  <Printer className='h-5 w-5' strokeWidth={2} />
                </button>
                <a
                  href={`https://mail.google.com/mail/?view=cm&to=${email.to}&su=${email.subject}&body=${email.body}`}
                  target='_blank'
                  className='transition-colors hover:text-indigo-500'
                >
                  <Send className='h-5 w-5' strokeWidth={2} />
                </a>
                <button className='transition-colors hover:fill-indigo-500'>
                  <svg width='100' height='100' viewBox='0 0 464 488' className='h-5 w-5'>
                    <path d='M462 228q0 93-66 159t-160 66q-56 0-109-28L2 464l40-120q-32-54-32-116q0-93 66-158.5T236 4t160 65.5T462 228zM236 39q-79 0-134.5 55.5T46 228q0 62 36 111l-24 70l74-23q49 31 104 31q79 0 134.5-55.5T426 228T370.5 94.5T236 39zm114 241q-1-1-10-7q-3-1-19-8.5t-19-8.5q-9-3-13 2q-1 3-4.5 7.5t-7.5 9t-5 5.5q-4 6-12 1q-34-17-45-27q-7-7-13.5-15t-12-15t-5.5-8q-3-7 3-11q4-6 8-10l6-9q2-5-1-10q-4-13-17-41q-3-9-12-9h-11q-9 0-15 7q-19 19-19 45q0 24 22 57l2 3q2 3 4.5 6.5t7 9t9 10.5t10.5 11.5t13 12.5t14.5 11.5t16.5 10t18 8.5q16 6 27.5 10t18 5t9.5 1t7-1t5-1q9-1 21.5-9t15.5-17q8-21 3-26z' />
                  </svg>
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
