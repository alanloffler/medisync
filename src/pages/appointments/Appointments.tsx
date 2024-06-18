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
import { CalendarDays } from 'lucide-react';

  // Citas, esto va a venir de la base de datos
  const appointments: IAppointment[] = [
    { date: '2024-05-18', turn: 1, name: 'Alan Löffler', professional: 1 },
    { date: '2024-05-18', turn: 3, name: 'Alan Löffler', professional: 1 },
    { date: '2024-05-19', turn: 8, name: 'Antonio Muller', professional: 1 },
  ];

// React component
export default function Appointments() {
  const [professionalSelected, setProfessionalSelected] = useState<IProfessional>({} as IProfessional);
  const [actualSchedule, setActualSchedule] = useState<AppoSchedule>({} as AppoSchedule);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedWeekDay, setSelectedWeekDay] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([] as ITimeSlot[]);

  const [ND, setND] = useState<number>(0);

  const capitalize = useCapitalize();
  // combobox

  const selectedDate = 
    (event: Date | undefined) => {
      if (event) {
        const _day = event.getDate();
        const _month = event.getMonth();
        const _year = event.getFullYear();
        const newDate = new Date(_year, _month, _day);
        setDate(newDate);
        setSelectedWeekDay(capitalize(newDate.toLocaleString('es', { weekday: 'long' })) as string);
        setSelectedDay(newDate.toLocaleString('es', { day: 'numeric' }));
        setSelectedMonth(capitalize(event.toLocaleString('es', { month: 'long' })) || '');
        setSelectedYear(event.toLocaleString('es', { year: 'numeric' }));
        
        // console.log('Day has changed', event.getFullYear(), event.getMonth(), event.getDate());
        setTimeSlots([]);
        setActualSchedule({} as AppoSchedule);
        // console.log(`${_year}-${_month}-${_day}T${professionalSelected.configuration.scheduleTimeInit}:00`);
        const scheduleDay = _day < 10 ? `0${_day}` : _day;
        const scheduleMonth = _month < 10 ? `0${_month + 1}` : _month + 1;

        const schedule = new AppoSchedule(
          `Schedule ${_day}`, 
          new Date(`${_year}-${scheduleMonth}-${scheduleDay}T${professionalSelected.configuration.scheduleTimeInit}`), 
          new Date(`${_year}-${scheduleMonth}-${scheduleDay}T${professionalSelected.configuration.scheduleTimeEnd}`), 
          60, 
          [{ 
            begin: new Date(`${_year}-${scheduleMonth}-${scheduleDay}T${professionalSelected.configuration.timeSlotUnavailableInit}`), 
            end: new Date(`${_year}-${scheduleMonth}-${scheduleDay}T${professionalSelected.configuration.timeSlotUnavailableEnd}`) 
          }]
        );
        setTimeSlots(schedule.timeSlots);
        schedule.insertAppointments(appointments.filter(appo => appo.date === `${_year}-0${_month}-${_day}`));
        setActualSchedule(schedule);
      }
    };

  // useEffect(() => {
  //   selectedDate(new Date());
  //   // setDate(new Date());
  //   sessionStorage.setItem('menuSelected', '2');
  // }, [selectedDate]);

  useEffect(() => {
    // TODO: obtener solo los activos, TODO en api también
    // ProfessionalApiService.findAllActive().then((response) => {
    //   console.log(response);
    //   setComboboxProfessionals(response);
    // });
  }, []);



  // schedule.insertAppointments(appointments);
  // const timeSlots = schedule.timeSlots;

  // const _date = new Date();
  // console.log(_date.toISOString().slice(0, 19));
  
  function handleSelectedProfessional(data: IProfessional) {
    setProfessionalSelected(data);
    setShowTimeSlots(true);
    const schedule = new AppoSchedule(`Schedule ${crypto.randomUUID()}`, new Date(`2024-06-17T${data.configuration.scheduleTimeInit}:00`), new Date(`2024-06-17T${data.configuration.scheduleTimeEnd}:00`), 60, [{ begin: new Date(`2024-06-17T${data.configuration.timeSlotUnavailableInit}`), end: new Date(`2024-06-17T${data.configuration.timeSlotUnavailableEnd}`) }]);
    setTimeSlots(schedule.timeSlots);
    console.log(schedule.name)
    schedule.insertAppointments(appointments);
    setActualSchedule(schedule);

    setND(parseInt(data.configuration.timeSlotUnavailableEnd) - parseInt(data.configuration.timeSlotUnavailableInit));
  }

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
      <div className='flex flex-col gap-4 overflow-x-auto md:flex-row lg:flex-row'>
        <div className='md:mx-auto lg:mx-auto h-fit flex flex-col gap-6 md:w-1/3 lg:w-1/3'>
          <div className='flex w-[250px] flex-col space-y-4'>
            <Steps text='Seleccionar profesional' step='1' className='bg-indigo-200 text-indigo-500' />
            <ProfessionalsCombobox onSelectProfessional={handleSelectedProfessional} />
          </div>
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
        <div className='flex flex-col gap-4 md:w-2/3 lg:w-2/3'>
          <Steps text='Seleccionar turno' step='3' className='bg-indigo-200 text-indigo-500' />
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className='px-3 text-base'>
                <div className='flex flex-row justify-between'>
                  <div className='flex flex-row items-center gap-2'>
                    <CalendarDays className='h-4 w-4' />
                    Turnos diarios {actualSchedule.name}
                  </div>
                  {professionalSelected._id && <h1>{`${capitalize(professionalSelected?.titleAbbreviation)} ${capitalize(professionalSelected?.lastName)}, ${capitalize(professionalSelected?.firstName)}`}</h1>}
                </div>
              </CardTitle>
              <div className='text-base font-semibold text-indigo-500'>{`${selectedWeekDay}, ${selectedDay} de ${selectedMonth} de ${selectedYear}`}</div>
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
