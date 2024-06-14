// Components: https://ui.shadcn.com/docs/components
import { Calendar } from '@/core/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
// App
import { es } from 'date-fns/locale';
import { useCallback, useEffect, useState } from 'react';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// import useTimeSlots from './hooks/useGenerateTimeSlots';
import { Button } from '@/core/components/ui/button';

import {AppoSchedule, IAppointment} from './test';

// React component
export default function Appointments() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedWeekDay, setSelectedWeekDay] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const capitalize = useCapitalize();

  const selectedDate = useCallback(
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
      }
    },
    [capitalize],
  );

  useEffect(() => {
    selectedDate(new Date());
    sessionStorage.setItem('menuSelected', '2');
  }, [selectedDate]);

  // Citas, esto va a venir de la base de datos
  const appointments: IAppointment[] = [
    { turn: 1, name: 'Alan Löffler', professional: 1 },
    { turn: 3, name: 'Alan Löffler', professional: 1 },
    { turn: 8, name: 'Antonio Muller', professional: 1 },
  ];

  const schedule = new AppoSchedule('Schedule 1', new Date('2024-06-04T10:00:00'), new Date('2024-06-04T17:00:00'), 30, [{ begin: new Date('2024-06-04T12:00:00'), end: new Date('2024-06-04T13:00:00') }]);
  schedule.insertAppointments(appointments);
  const timeSlots = schedule.timeSlots;
  
  // const _date = new Date();
  // console.log(_date.toISOString().slice(0, 19));

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
      <div className='flex flex-col gap-4 overflow-x-auto md:flex-row lg:flex-row'>
        <div className='mx-auto flex flex-row justify-center md:w-1/3 lg:w-1/3'>
          {/* prettier-ignore */}
          <Calendar 
            captionLayout={'dropdown-buttons'}
            className='rounded-lg bg-card text-card-foreground shadow-sm h-fit' 
            disabled={[
              { dayOfWeek: [0, 6] }, 
              { before: new Date() }, 
              { from: new Date(2024, 5, 5) },
              { from: new Date(2024, 5, 18) },
            ]}
            
            footer={<div className="flex justify-start text-xs text-slate-500 p-2">Selecciona el día</div>}
            locale={es} 
            mode='single'
            modifiersClassNames={{
              today: 'bg-slate-300',
              selected: 'bg-indigo-500 text-white',
            }}
            onSelect={(e) => selectedDate(e)} 
            selected={date}
            showOutsideDays={false}
          />
        </div>
        <div className='flex flex-row md:w-2/3 lg:w-2/3'>
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className='text-base'>Turnos diarios</CardTitle>
              <div className='text-base font-semibold text-indigo-500'>{`${selectedWeekDay}, ${selectedDay} de ${selectedMonth} de ${selectedYear}`}</div>
            </CardHeader>
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
                          <div className='flex space-x-4'>
                            <div className='w-28'>{slot.begin} - {slot.end}</div>
                            <div className='text-indigo-500'>Turno {index}</div>
                            <div>{slot.appointment?.name}</div>
                          </div>
                          <div className='flex space-x-4'>
                            {!slot.appointment?.name && <Button variant={'outline'} size={'sm'} className='h-7'>Reservar</Button>}
                            <Button variant={'outline'} size={'sm'} className='h-7'>Ver</Button>
                          </div>
                        </div>
                      ):(
                        <>{slot.begin} - {slot.end}</>
                      )
                    }
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
