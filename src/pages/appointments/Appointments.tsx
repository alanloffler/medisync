// Icons: https://lucide.dev/icons
// import { Check, ChevronsUpDown } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Calendar } from '@/core/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
// App
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// import useTimeSlots from './hooks/useGenerateTimeSlots';
import { Button } from '@/core/components/ui/button';

import { AppoSchedule, IAppointment, ITimeSlot } from './test';
import { IProfessional } from '../professionals/interfaces/professional.interface';
import { ProfessionalsCombobox } from '../professionals/components/ProfessionalsCombobox';
import { Steps } from '@/core/components/common/Steps';
import { CalendarDays, Check } from 'lucide-react';
import { useDateToString, useLegibleDate } from '@/core/hooks/useDateToString';
import { cn } from '@/lib/utils';

// Citas, esto va a venir de la base de datos
const appointments: IAppointment[] = [
  { date: '2024-06-18', turn: 1, name: 'Alan Löffler', professional: 1 },
  { date: '2024-06-18', turn: 3, name: 'Alan Löffler', professional: 1 },
  { date: '2024-06-19', turn: 8, name: 'Antonio Muller', professional: 1 },
];

// React component
export default function Appointments() {
  const [professionalSelected, setProfessionalSelected] = useState<IProfessional>({} as IProfessional);
  const [actualSchedule, setActualSchedule] = useState<AppoSchedule>({} as AppoSchedule);
  const [date, setDate] = useState<Date | undefined>(new Date());
  // const [selectedDay, setSelectedDay] = useState<string>('');
  // const [selectedMonth, setSelectedMonth] = useState<string>('');
  // const [selectedWeekDay, setSelectedWeekDay] = useState<string>('');
  // const [selectedYear, setSelectedYear] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([] as ITimeSlot[]);

  const [ND, setND] = useState<number>(0);

  const capitalize = useCapitalize();
  const dateToString = useDateToString();
  const legibleDate = useLegibleDate();
  const [selectedLegibleDate, setSelectedLegibleDate] = useState<string>('');

  // Initial load
  useEffect(() => {
    // const date = dateToString(new Date());
    // console.log('from hook', date);
    setSelectedLegibleDate(legibleDate(new Date()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectedDate(event: Date | undefined) {
    if (event) {
      setDate(event);
      // Set legible date for table header
      setSelectedLegibleDate(legibleDate(event));
      // Convert date to string for schedule
      const selectedDate = dateToString(event);
      // Reset schedule and time slots
      setActualSchedule({} as AppoSchedule);
      setTimeSlots([]);
      // Schedule creation
      // prettier-ignore
      const schedule = new AppoSchedule(
        `Schedule ${selectedDate}`, 
        new Date(`${selectedDate}T${professionalSelected.configuration.scheduleTimeInit}`), 
        new Date(`${selectedDate}T${professionalSelected.configuration.scheduleTimeEnd}`), 
        professionalSelected.configuration.slotDuration, 
        [{
          begin: new Date(`${selectedDate}T${professionalSelected.configuration.timeSlotUnavailableInit}`),
          end: new Date(`${selectedDate}T${professionalSelected.configuration.timeSlotUnavailableEnd}`)
        }]
      );
      setActualSchedule(schedule);
      setTimeSlots(schedule.timeSlots);
      schedule.insertAppointments(appointments.filter((appo) => appo.date === `${selectedDate}`));
    }
  }

  function handleSelectedProfessional(data: IProfessional) {
    if (data) {
      // Set selected professional
      setProfessionalSelected(data);
      // Set selected date (today at initial load)
      const selectedDate = dateToString(new Date());
      // Schedule creation
      // prettier-ignore
      const schedule = new AppoSchedule(
        `Schedule for ${data.lastName}`, 
        new Date(`${selectedDate}T${data.configuration.scheduleTimeInit}:00`), 
        new Date(`${selectedDate}T${data.configuration.scheduleTimeEnd}:00`), 
        data.configuration.slotDuration, 
        [{
          begin: new Date(`${selectedDate}T${data.configuration.timeSlotUnavailableInit}`),
          end: new Date(`${selectedDate}T${data.configuration.timeSlotUnavailableEnd}`)
        }]
      );
      //
      setActualSchedule(schedule);
      setTimeSlots(schedule.timeSlots);
      setShowTimeSlots(true);
      // Show calendar
      setShowCalendar(true);
      // TODO: Filter by date (this must come filtered from the database)
      const appos = appointments.filter((appo) => appo.date === selectedDate);
      schedule.insertAppointments(appos);
      // TODO this doesn't work
      setND(parseInt(data.configuration.timeSlotUnavailableEnd) - parseInt(data.configuration.timeSlotUnavailableInit));
    }
  }

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
      <div className='flex flex-col gap-4 overflow-x-auto md:flex-row lg:flex-row'>
        <div className='flex h-fit flex-col gap-6 md:mx-auto md:w-1/3 lg:mx-auto lg:w-1/3'>
          <div className='flex flex-col space-y-4 w-fit'>
            <Steps text='Seleccionar profesional' step='1' className='bg-indigo-200 text-indigo-500' />
            <ProfessionalsCombobox onSelectProfessional={handleSelectedProfessional} />
          </div>
          <div className={cn('flex flex-col space-y-4', showCalendar ? 'pointer-events-auto' : 'pointer-events-none')}>
            <Steps text='Seleccionar fecha' step='2' className='bg-indigo-200 text-indigo-500' />
            {/* prettier-ignore */}
            <Calendar
              captionLayout={'dropdown-buttons'}
              className='rounded-lg bg-card text-card-foreground shadow-sm h-fit flex-row w-fit' 
              disabled={[
                { dayOfWeek: [0, 6] }, 
                { before: new Date() }, 
                { from: new Date(2024, 5, 5) },
                { from: new Date(2024, 5, 21) },
              ]}
              footer={<div className="flex justify-start text-xs text-slate-500 p-2">Selecciona el día</div>}
              locale={es} 
              mode='single'
              modifiersClassNames={{
                today: 'bg-indigo-300 text-white',
                selected: 'bg-indigo-500 text-white',
              }}
              onSelect={(e) => selectedDate(e)} 
              selected={date}
              showOutsideDays={false}
            />
          </div>
        </div>
        <div className='flex flex-col gap-4 md:w-2/3 lg:w-2/3'>
          <Steps text='Seleccionar turno' step='3' className='bg-indigo-200 text-indigo-500' />
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className='px-3 text-base'>
                <div className='flex flex-row justify-between'>
                  <div className='flex flex-row items-center gap-2'>
                    <CalendarDays className='h-4 w-4' />
                    Turnos diarios
                  </div>
                  {professionalSelected._id && <h1>{`${capitalize(professionalSelected?.titleAbbreviation)} ${capitalize(professionalSelected?.lastName)}, ${capitalize(professionalSelected?.firstName)}`}</h1>}
                </div>
              </CardTitle>
              <div className='text-base font-semibold text-indigo-500 text-center'>{selectedLegibleDate}</div>
            </CardHeader>
            {showTimeSlots && (
              <CardContent>
                {/* prettier-ignore */}
                <ul>
                {timeSlots.map((slot, index) => (
                  <li 
                    key={index} 
                    className={
                      `p-1 text-base
                      ${slot.available ? 'text-foreground' : 'text-muted-foreground/50'} 
                      ${index === timeSlots.length - 1 ? 'border-none' : 'border-b'}`
                    }
                  >
                    {slot.available ?
                      (
                        <div className='flex flex-row justify-between items-center'>
                          <div className='flex space-x-4 items-center'>
                            <div className='text-sm font-semibold'>T{index}</div>
                            <div className='w-28'>{slot.begin} hs</div>
                            <div>{slot.appointment?.name}</div>
                          </div>
                          <div className='flex space-x-4'>
                            {!slot.appointment?.name && <Button variant={'outline'} size={'sm'} className='h-7'>Reservar</Button>}
                            <Button variant={'outline'} size={'sm'} className='h-7'>Ver</Button>
                          </div>
                        </div>
                      ):(
                        <div className='flex flex-row gap-4'>
                        <div className=' text-sm font-semibold'>ND</div>  
                          <div className='w-28'>{slot.begin} hs</div>
                        </div>
                      )
                    }
                  </li>
                ))}
              </ul>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
