// Icons: https://lucide.dev/icons
import { CalendarDays, Clock, Link as LinkIcon, Printer, Send } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
// App
import { AppointmentApiService } from '@/pages/appointments/services/appointment.service';
import { IAppointmentView } from '@/pages/appointments/services/schedule.service';
import { IEmail } from '@/core/interfaces/email.interface';
import { VIEW_APPOINTMENT_CONFIG } from '../config/appointment.config';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useEffect, useRef, useState } from 'react';
import { useLegibleDate } from '@/core/hooks/useDateToString';
import { useParams, Link } from 'react-router-dom';
// pdf
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';

export default function ViewAppointment() {
  const [appointment, setAppointment] = useState<IAppointmentView>({} as IAppointmentView);
  const [date, setDate] = useState<string>('');
  const [email, setEmail] = useState<IEmail>({} as IEmail);
  const capitalize = useCapitalize();
  const legibleDate = useLegibleDate();
  const pdfRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      AppointmentApiService.findOne(id).then((response) => {
        setAppointment(response.data);
        setDate(legibleDate(new Date(appointment.day), 'long'));

        setEmail({
          to: response.data.user.email || 'alanmatiasloffler@gmail.com',
          subject: `${VIEW_APPOINTMENT_CONFIG.email.subject} ${capitalize(response.data.professional.title.abbreviation)} ${capitalize(response.data.professional.firstName)} ${capitalize(response.data.professional.lastName)}`,
          body: VIEW_APPOINTMENT_CONFIG.email.body,
        });
      });
    }
  }, [appointment.day, capitalize, id, legibleDate]);

  function downloadPDF() {
    const input = pdfRef.current;

    if (input) {
      htmlToImage.toCanvas(input).then(function (canvas) {
        const pdf = new jsPDF('p', 'px', 'a4', false);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        pdf.addImage(canvas, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        // TODO: rename pdf file generated with user name or email plus date to be unique
        pdf.save('turno.pdf');
      });
    }
  }

  return (
    <main ref={pdfRef} className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
      <Card className='mx-auto w-full md:w-1/2 lg:w-1/2'>
        <CardHeader>
          <CardTitle className='px-3 text-base'>
            <div className='flex flex-row justify-between'>
              <div className='flex flex-row items-center gap-2'>
                <CalendarDays className='h-4 w-4' />
                <span>{VIEW_APPOINTMENT_CONFIG.title}</span>
              </div>
              <div className='flex flex-row items-center'>{`${capitalize(appointment.professional?.title.abbreviation)} ${capitalize(appointment.professional?.lastName)}, ${capitalize(appointment.professional?.firstName)}`}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className='mt-4 space-y-4'>
          <h1 className='flex items-center justify-center gap-2 text-center text-2xl font-semibold'>
            <span>{`${capitalize(appointment.user?.lastName)}, ${capitalize(appointment.user?.firstName)}`}</span>
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
              {appointment.hour} {VIEW_APPOINTMENT_CONFIG.words.hoursAbbreviation}
            </span>
          </h2>
          <div className='flex justify-end space-x-5'>
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
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
