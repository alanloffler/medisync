// Icons: https://lucide.dev/icons
import { BriefcaseMedical, CalendarCheck, CalendarDays, ClipboardCheck, Clock, FileWarning } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Calendar } from '@/core/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components/ui/table';
// App components
import { ProfessionalsCombobox } from '@/pages/professionals/components/common/ProfessionalsCombobox';
import { Steps } from '@/core/components/common/Steps';
import { UsersCombo } from '@/pages/users/components/UsersCombo';
// App
import { APPO_CONFIG } from '@/pages/appointments/config/appointment.config';
import { APP_CONFIG } from '@/config/app.config';
import { AppoSchedule, IAppointment, ITimeSlot } from '@/pages/appointments/services/schedule.service';
import { AppointmentApiService } from '@/pages/appointments/services/appointment.service';
import { CalendarService } from '@/pages/appointments/services/calendar.service';
import { IDialog } from '@/core/interfaces/dialog.interface';
import { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { IUser } from '@/pages/users/interfaces/user.interface';
import { cn } from '@/lib/utils';
import { es, enUS } from 'date-fns/locale';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useDateToString, useLegibleDate } from '@/core/hooks/useDateToString';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationsStore } from '@/core/stores/notifications.store';
// React component
export default function Appointments() {
  const [appointments, setAppointments] = useState<IAppointment[]>([] as IAppointment[]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dialogContent, setDialogContent] = useState<IDialog>({} as IDialog);
  const [disabledDays, setDisabledDays] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [legibleWorkingDays, setLegibleWorkingDays] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [professionalSelected, setProfessionalSelected] = useState<IProfessional>();
  const [refreshAppos, setRefreshAppos] = useState<string>('');
  const [sameDay, setSameDay] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedLegibleDate, setSelectedLegibleDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<ITimeSlot>({} as ITimeSlot);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([] as ITimeSlot[]);
  const [totalAvailableSlots, setTotalAvailableSlots] = useState<number>(0);
  const [userSelected, setUserSelected] = useState<IUser>({} as IUser);
  // const [now, setNow] = useState<string[]>([]);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const dateToString = useDateToString();
  const legibleDate = useLegibleDate();
  const navigate = useNavigate();

  useEffect(() => {
    if (professionalSelected) {
      const calendarDisabledDays = CalendarService.getDisabledDays(professionalSelected.configuration.workingDays);
      setDisabledDays(calendarDisabledDays);
      const legibleWorkingDays = CalendarService.getLegibleWorkingDays(professionalSelected.configuration.workingDays);
      setLegibleWorkingDays(legibleWorkingDays);
    }

    setSelectedDate(undefined);
    setShowCalendar(true);
    // WIP & TODO disabled time slots selection by day and hour
    // setNow(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }).split(':'));
    setSameDay(selectedDate ? selectedDate?.getFullYear() >= new Date().getFullYear() && selectedDate?.getMonth() >= new Date().getMonth() && selectedDate?.getDate() >= new Date().getDate() : false);
    console.log('sameDay', sameDay);
    // const notHourYet = selectedDate?.getHours() < new Date().getHours() || (selectedDate?.getHours() === new Date().getHours() && selectedDate?.getMinutes() < new Date().getMinutes());
    // console.log('notHourYet', notHourYet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionalSelected]);

  // #region Load data
  // Appointments schedule creation, time slots generation and appointments insertion.
  useEffect(() => {
    if (professionalSelected) {
      if (!professionalSelected.configuration) {
        addNotification({ type: 'error', message: APPO_CONFIG.errors.configurationUnavailable });
        setErrorMessage(APPO_CONFIG.errors.configurationUnavailable);
        return;
      }

      if (selectedDate) {
        if (selectedDate !== date) {
          setTimeSlots([]);
          setAppointments([]);
          setErrorMessage('');
          setTotalAvailableSlots(0);
        }

        setSelectedLegibleDate(legibleDate(selectedDate, 'long'));
        const scheduleDate = dateToString(selectedDate);
        setDate(selectedDate);
        // prettier-ignore
        const schedule = new AppoSchedule(
          `Schedule ${scheduleDate}`, 
          new Date(`${scheduleDate}T${professionalSelected.configuration.scheduleTimeInit}`), 
          new Date(`${scheduleDate}T${professionalSelected.configuration.scheduleTimeEnd}`), 
          Number(professionalSelected.configuration.slotDuration), 
          [{
            begin: new Date(`${scheduleDate}T${professionalSelected.configuration.timeSlotUnavailableInit}`),
            end: new Date(`${scheduleDate}T${professionalSelected.configuration.timeSlotUnavailableEnd}`),
          }]
        );
        setTimeSlots(schedule.timeSlots); // Set time slots for UI schedule table
        setShowCalendar(true); // Show calendar
        setShowTimeSlots(true); // Show time slots
        // Get appointments from database
        AppointmentApiService.findAllByProfessional(professionalSelected._id, scheduleDate).then((response) => {
          // Backend response IResponse TODO
          if (!response.statusCode) {
            setAppointments(response);
            schedule.insertAppointments(response);
          }
          if (response.statusCode) addNotification({ type: 'error', message: response.message });
          if (response instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
        });
        // Get amount of time slots available
        const totalAvailableSlots = schedule.totalAvailableSlots(schedule.timeSlots);
        setTotalAvailableSlots(totalAvailableSlots);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, refreshAppos]);
  // #endregion
  async function handleReserveAppointment(timeSlot: ITimeSlot | undefined) {
    if (timeSlot && professionalSelected && selectedDate !== undefined) {
      // TODO: data from form
      const newAppo = await AppointmentApiService.create({
        slot: timeSlot.id,
        professional: professionalSelected?._id || '',
        day: dateToString(date ?? new Date()),
        hour: timeSlot.begin,
        user: userSelected._id,
      });

      if (newAppo.statusCode === 200) {
        addNotification({ type: 'success', message: newAppo.message });
        setRefreshAppos(crypto.randomUUID());
        setOpenDialog(false);
      }
      if (newAppo.statusCode) addNotification({ type: 'error', message: newAppo.message });
      if (newAppo instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
    }
    if (!timeSlot) console.log('timeSlot undefined');
  }

  async function handleCancelAppointment(slot: ITimeSlot) {
    if (slot.appointment?._id) {
      AppointmentApiService.remove(slot.appointment._id).then((response) => {
        if (response.statusCode === 200) {
          addNotification({ type: 'success', message: response.message });
          setRefreshAppos(crypto.randomUUID());
          setOpenDialog(false);
        }
        if (response.statusCode) addNotification({ type: 'error', message: response.message });
        if (response instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
      });
    } else {
      console.log('Appo id undefined');
    }
  }
  // #region Dialog
  function handleDialog(action: 'reserve' | 'cancel', slot: ITimeSlot) {
    setOpenDialog(true);
    setSelectedSlot(slot);

    if (action === 'reserve') {
      const reserveDialogContent: IDialog = {
        action: 'reserve',
        content: '',
        description: APPO_CONFIG.dialog.reserve.description,
        title: APPO_CONFIG.dialog.reserve.title,
      };
      setDialogContent(reserveDialogContent);
    }
    if (action === 'cancel') {
      const cancelDialogContent: IDialog = {
        action: 'cancel',
        content: (
          <div className='space-y-2 pt-4'>
            <div>
              {APPO_CONFIG.dialog.cancel.contentText}
              <span className='font-semibold'>
                {slot.appointment?.user.lastName} {slot.appointment?.user.firstName}
              </span>
            </div>
            <div className='italic'>
              {legibleDate(selectedDate as Date, 'long')} - {slot.appointment?.hour} {APPO_CONFIG.words.hours}
            </div>
          </div>
        ),
        description: APPO_CONFIG.dialog.cancel.description,
        title: APPO_CONFIG.dialog.cancel.title,
      };
      setDialogContent(cancelDialogContent);
    }
  }
  // #endregion
  function handleCancelAnyAction() {
    setOpenDialog(false);
    setUserSelected({} as IUser);
  }

  return (
    <>
      <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
        <div className='flex flex-col gap-4 overflow-x-auto md:flex-row lg:flex-row'>
          <div className='flex h-fit flex-col gap-6 md:mx-auto md:w-1/3 lg:mx-auto lg:w-1/3'>
            <div className='flex w-full flex-col space-y-4'>
              <Steps text={APPO_CONFIG.steps.text1} step='1' className='bg-primary/20 text-primary' />
              {/* prettier-ignore */}
              <ProfessionalsCombobox 
                onSelectProfessional={(professional) => setProfessionalSelected(professional)} 
                options={{
                  loadingText: APPO_CONFIG.combobox.loadingText,
                  notFoundText: APPO_CONFIG.combobox.notFoundText,
                  placeholder: APPO_CONFIG.combobox.placeholder,
                  searchText: APPO_CONFIG.combobox.searchText,
                }}
                className='w-1/2'
              />
              <div className='mt-2 flex flex-col text-slate-500 w-full'>
                <div className='flex flex-row items-center space-x-1'>
                  <span className='text-sm font-semibold underline'>{APPO_CONFIG.phrases.availableDays}</span>
                  <span className='text-sm font-medium'>{legibleWorkingDays}</span>
                </div>
                <div className='flex flex-row items-center space-x-1'>
                  <span className='text-sm font-semibold underline'>{'Horarios:'}</span>
                  <span className='text-sm font-medium'>{legibleWorkingDays}</span>
                </div>
              </div>
            </div>
            <div className={cn('flex flex-col space-y-4', showCalendar ? 'pointer-events-auto' : 'pointer-events-none')}>
              {professionalSelected && (
                <>
                  <Steps text={APPO_CONFIG.steps.text2} step='2' className='bg-primary/20 text-primary' />
                  {/* prettier-ignore */}
                  <Calendar
                    captionLayout={'dropdown-buttons'}
                    className='h-fit w-fit flex-row rounded-lg bg-card text-card-foreground shadow-sm'
                    disabled={[
                      { dayOfWeek: disabledDays },
                      { before: new Date() }, // uncomment this after show reserve button works!
                      { from: new Date(2024, 5, 5) },
                    ]}
                    locale={APPO_CONFIG.calendar.language === 'es' ? es : enUS}
                    mode='single'
                    modifiersClassNames={{
                      today: 'bg-primary/30 text-primary',
                      selected: 'bg-primary text-white',
                    }}
                    selected={date}
                    showOutsideDays={false}
                    onDayClick={(event) => setSelectedDate(event)}
                  />
                </>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-4 md:w-2/3 lg:w-2/3'>
            {selectedDate && (
              <>
                <Steps text={APPO_CONFIG.steps.text3} step='3' className='bg-primary/20 text-primary' />
                <Card className='w-full'>
                  <CardHeader>
                    <CardTitle className='px-3 text-base'>
                      <div className='flex flex-row justify-between'>
                        <div className='flex flex-row items-center gap-2'>
                          <CalendarDays className='h-4 w-4' />
                          <span>{APPO_CONFIG.table.title}</span>
                        </div>
                        {professionalSelected?._id && <h1>{`${capitalize(professionalSelected?.title.abbreviation)} ${capitalize(professionalSelected?.lastName)}, ${capitalize(professionalSelected?.firstName)}`}</h1>}
                      </div>
                    </CardTitle>
                    {!errorMessage && <div className='py-2 text-center text-base font-semibold text-primary'>{selectedLegibleDate}</div>}
                    {showTimeSlots && <div className='mx-4 w-fit rounded-full bg-primary/30 px-2 py-1 text-sm font-semibold'>{`${totalAvailableSlots - appointments.length} ${APPO_CONFIG.phrases.availableAppointments}`}</div>}
                  </CardHeader>
                  {errorMessage && (
                    <div className='flex items-center justify-center space-x-2 px-4 py-0 text-rose-500'>
                      <FileWarning className='h-5 w-5' strokeWidth={2} />
                      <span className='text-center font-medium'>{errorMessage}</span>
                    </div>
                  )}
                  {showTimeSlots && (
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className='w-[60px] text-center font-semibold'>{APPO_CONFIG.table.headers[0]}</TableHead>
                            <TableHead className='w-[135px] px-2 text-left font-semibold'>{APPO_CONFIG.table.headers[1]}</TableHead>
                            <TableHead className='px-2 text-left font-semibold'>{APPO_CONFIG.table.headers[2]}</TableHead>
                            <TableHead className='w-[140px] px-2 text-center font-semibold'>{APPO_CONFIG.table.headers[3]}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {timeSlots.map((slot, index) => (
                            <TableRow key={index} className={`text-base ${slot.available ? 'text-foreground' : 'bg-slate-100 text-slate-400'} ${index === timeSlots.length - 1 ? 'border-none' : 'border-b'}`}>
                              {slot.available ? (
                                <>
                                  <TableCell className='p-1.5 text-center text-sm font-light'>{APPO_CONFIG.words.shiftPrefix + slot.id}</TableCell>
                                  <TableCell className='p-1.5 text-left text-sm font-light'>
                                    {slot.begin} {APPO_CONFIG.words.hours}
                                  </TableCell>
                                  {slot.appointment?.user ? <TableCell className='p-1.5 text-base font-medium'>{`${capitalize(slot.appointment.user.lastName)}, ${capitalize(slot.appointment.user.firstName)}`}</TableCell> : <TableCell className='p-1.5 text-base font-medium'></TableCell>}
                                  <TableCell className='flex items-center justify-end space-x-4 p-1.5'>
                                    {/* TODO: button should only be shown if the date is in the future and the time is in the future */}
                                    {/* TODO: this partially works, need some tests and usage, the hour is not sure it is working properly */}
                                    <span>{selectedDate && selectedDate.getDate() + ' - ' + new Date().getDate()}</span>
                                    {selectedDate && selectedDate?.getDate() >= new Date().getDate() && selectedDate?.getTime() >= new Date().getTime() ? <>Show button</> : <>Do not show button</>}
                                    {!slot.appointment?.user && (
                                      <Button onClick={() => handleDialog('reserve', slot)} variant={'default'} size={'xs'}>
                                        {APPO_CONFIG.buttons.addAppointment}
                                      </Button>
                                    )}
                                    {slot.appointment?.user && (
                                      <Button onClick={() => navigate(`/appointments/${slot.appointment?._id}`)} variant={'table'} size={'xs'} className='bg-slate-100 text-primary'>
                                        {APPO_CONFIG.buttons.viewAppointment}
                                      </Button>
                                    )}
                                    {slot.appointment?.user && (
                                      <Button onClick={() => handleDialog('cancel', slot)} variant={'table'} size={'xs'} className='bg-slate-100 text-primary'>
                                        {APPO_CONFIG.buttons.cancelAppointment}
                                      </Button>
                                    )}
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell className='p-1.5 text-center text-sm font-semibold'>{APPO_CONFIG.words.unavailable}</TableCell>
                                  <TableCell className='p-1.5 text-left text-sm'>
                                    {slot.available ? slot.begin : `${slot.begin} ${APPO_CONFIG.words.hoursSeparator} ${slot.end}`} {APPO_CONFIG.words.hours}
                                  </TableCell>
                                  <TableCell className='p-1.5'></TableCell>
                                  <TableCell className='p-1.5'></TableCell>
                                </>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  )}
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
            {dialogContent.action === 'reserve' && (
              <div className='pt-4'>
                <div className='pt-4'>
                  <UsersCombo searchBy='dni' searchResult={(e) => setUserSelected(e)} placeholder={APPO_CONFIG.dialog.reserve.search.placeholder} />
                  {userSelected._id && (
                    <>
                      <div className='flex items-center space-x-2 py-4'>
                        <ClipboardCheck className='h-5 w-5' strokeWidth={2} />
                        <span>
                          Reserva de turno para <span className='font-bold'>{`${capitalize(userSelected.lastName)}, ${capitalize(userSelected.firstName)}`}</span>
                        </span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <CalendarCheck className='h-5 w-5' strokeWidth={2} />
                        <span>El día {selectedLegibleDate}</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Clock className='h-5 w-5' strokeWidth={2} />
                        <span>A las {selectedSlot.begin}</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <BriefcaseMedical className='h-5 w-5' strokeWidth={2} />
                        <span className='font-semibold'>{`${capitalize(professionalSelected?.title.abbreviation)} ${capitalize(professionalSelected?.lastName)}, ${capitalize(professionalSelected?.firstName)}`}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* <>{dialogContent.content}</> */}
            <div className='flex justify-end gap-6 pt-4'>
              <Button variant={'secondary'} size={'default'} onClick={() => handleCancelAnyAction()}>
                {APPO_CONFIG.buttons.cancelAppointment}
              </Button>
              {dialogContent.action === 'reserve' && (
                <Button variant={'default'} size={'default'} onClick={() => handleReserveAppointment(selectedSlot)}>
                  {APPO_CONFIG.dialog.reserve.buttons.save}
                </Button>
              )}
              {dialogContent.action === 'cancel' && (
                <Button variant={'default'} size={'default'} onClick={() => handleCancelAppointment(selectedSlot)}>
                  {APPO_CONFIG.dialog.cancel.buttons.save}
                </Button>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
