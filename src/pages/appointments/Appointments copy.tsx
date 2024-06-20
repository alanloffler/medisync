// Icons: https://lucide.dev/icons
import { CalendarDays } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Calendar } from '@/core/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
// App components
import { Steps } from '@/core/components/common/Steps';
// App
import { AppoSchedule, IAppointment, ITimeSlot } from './test';
import { AppointmentApiService } from './services/appointment.service';
import { IProfessional } from '../professionals/interfaces/professional.interface';
import { ProfessionalsCombobox } from '../professionals/components/ProfessionalsCombobox';
import { cn } from '@/lib/utils';
import { es, enUS } from 'date-fns/locale';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useDateToString, useLegibleDate } from '@/core/hooks/useDateToString';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationsStore } from '@/core/stores/notifications.store';
import { APPO_CONFIG } from './config/appointment.config';
// React component
export default function Appointments() {
  const [appointments, setAppointments] = useState<IAppointment[]>([] as IAppointment[]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [professionalSelected, setProfessionalSelected] = useState<IProfessional>({} as IProfessional);
  const [selectedLegibleDate, setSelectedLegibleDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([] as ITimeSlot[]);

  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const dateToString = useDateToString();
  const legibleDate = useLegibleDate();
  const navigate = useNavigate();
  // FROM HERE NEW WAY
  const [schedule, setSchedule] = useState<AppoSchedule>({} as AppoSchedule);

  function selectedDate(event: Date | undefined) {
    if (event) {
      setDate(event);
      console.log('date from selectedDate()', event);
      // Set legible date for table header
      setSelectedLegibleDate(legibleDate(event));
      // Convert date to string for schedule
      const selectedDate = dateToString(event);
      // Reset time slots
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
      // setActualSchedule(schedule);
      setTimeSlots(schedule.timeSlots);
      // Get appointments by professional selected
      AppointmentApiService.findAllByProfessional(professionalSelected._id, selectedDate).then((response) => {
        if (!response.statusCode) {
          setAppointments(response);
          schedule.insertAppointments(response);
        }
        if (response.statusCode) addNotification({ type: 'error', message: response.message });
        if (response instanceof Error) addNotification({ type: 'error', message: 'Error en el servidor' });
      });
    }
  }

  function createSchedule() {
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
    // setActualSchedule(schedule);
    setTimeSlots(schedule.timeSlots);
    // save appointments
    setSchedule();
  }

  function handleSelectedProfessional(data: IProfessional) {
    if (data) {
      // Set selected professional
      setProfessionalSelected(data);
      // Set selected date (today at initial load)
      setDate(new Date());
      const selectedDate = dateToString(date || new Date());
      console.log(date);
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
      // Set time slots and show them, also show calendar
      setTimeSlots(schedule.timeSlots);
      setShowTimeSlots(true);
      setShowCalendar(true);
      // Get appointments by professional selected
      // prettier-ignore
      AppointmentApiService
      .findAllByProfessional(data._id, selectedDate)
      .then((response) => {
        console.log(response);
        setAppointments(response);
        schedule.insertAppointments(response);
      });
    }
  }

  async function handleReserveAppointment(timeSlot: ITimeSlot) {
    console.log(date);
    if (timeSlot) {
      // console.log(timeSlot);
      const newAppo = await AppointmentApiService.create({
        slot: timeSlot.id,
        professional: professionalSelected._id,
        day: dateToString(date ?? new Date()),
        hour: timeSlot.begin,
        user: 'Noelia Skiba',
      });

      if (!newAppo.statusCode) {
        addNotification({ type: 'success', message: newAppo.message });
        // TODO this is not working, must load again the appointments!
        // selectedDate(new Date());
        appointments.insertAppointments(); // set(professionalSelected);
      }
      if (newAppo.statusCode) addNotification({ type: 'error', message: newAppo.message });
      if (newAppo instanceof Error) addNotification({ type: 'error', message: 'Error en el servidor' });
    }
    if (!timeSlot) console.log('timeSlot undefined');
  }

  function handleCancelAppointment(id: string | undefined) {
    if (id) {
      console.log('Appo id', id);
      AppointmentApiService.remove(id).then((response) => {
        if (!response.statusCode) {
          addNotification({ type: 'success', message: response.message });
          // TODO this is not working, must load again the appointments!
          setProfessionalSelected(professionalSelected);
        }
        if (response.statusCode) addNotification({ type: 'error', message: response.message });
        if (response instanceof Error) addNotification({ type: 'error', message: 'Error en el servidor' });
      });
    } else {
      console.log('Appo id undefined');
    }
  }

  // useEffect(() => {
  //   console.log('date changed');
  // }, []);

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
      <div className='flex flex-col gap-4 overflow-x-auto md:flex-row lg:flex-row'>
        <div className='flex h-fit flex-col gap-6 md:mx-auto md:w-1/3 lg:mx-auto lg:w-1/3'>
          <div className='flex w-fit flex-col space-y-4'>
            <Steps text={APPO_CONFIG.steps.text1} step='1' className='bg-primary/20 text-primary' />
            <ProfessionalsCombobox onSelectProfessional={handleSelectedProfessional} placeholder={APPO_CONFIG.combobox.placeholder} searchText={APPO_CONFIG.combobox.searchText} />
          </div>
          <div className={cn('flex flex-col space-y-4', showCalendar ? 'pointer-events-auto' : 'pointer-events-none')}>
            <Steps text={APPO_CONFIG.steps.text2} step='2' className='bg-primary/20 text-primary' />
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
              locale={APPO_CONFIG.calendar.language === 'es' ? es : enUS}
              mode='single'
              modifiersClassNames={{
                today: 'bg-primary/30 text-primary',
                selected: 'bg-primary text-white',
              }}
              onSelect={(e) => selectedDate(e)} 
              selected={date}
              showOutsideDays={false}
            />
          </div>
        </div>
        <div className='flex flex-col gap-4 md:w-2/3 lg:w-2/3'>
          <Steps text={APPO_CONFIG.steps.text3} step='3' className='bg-primary/30 text-primary' />
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className='px-3 text-base'>
                <div className='flex flex-row justify-between'>
                  <div className='flex flex-row items-center gap-2'>
                    <CalendarDays className='h-4 w-4' />
                    <span>{APPO_CONFIG.table.title}</span>
                  </div>
                  {professionalSelected._id && <h1>{`${capitalize(professionalSelected?.titleAbbreviation)} ${capitalize(professionalSelected?.lastName)}, ${capitalize(professionalSelected?.firstName)}`}</h1>}
                </div>
              </CardTitle>
              <div className='text-center text-base font-semibold text-primary'>{selectedLegibleDate}</div>
            </CardHeader>
            {/* {showTimeSlots && ( */}
            {true && (
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
                            <div className='w-28'>{slot.begin} {APPO_CONFIG.words.hours}</div>
                            <div>{slot.appointment?.user}</div>
                          </div>
                          <div className='flex space-x-4'>
                            {!slot.appointment?.user && <Button onClick={() => handleReserveAppointment(slot)} variant={'default'} size={'xs'}>{APPO_CONFIG.buttons.addAppointment}</Button>}
                            {slot.appointment?.user && <Button onClick={() => navigate(`/appointments/${slot.appointment?._id}`)} variant={'table'} size={'xs'} className='text-primary bg-slate-100'>{APPO_CONFIG.buttons.viewAppointment}</Button>}
                            {slot.appointment?.user && <Button onClick={() => handleCancelAppointment(slot.appointment?._id)} variant={'table'} size={'xs'} className='text-primary bg-slate-100'>{APPO_CONFIG.buttons.cancelAppointment}</Button>}
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
