// Icons: https://lucide.dev/icons
import { BriefcaseMedical, CalendarCheck, CalendarDays, ClipboardCheck, Clock, FileWarning } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Calendar } from '@/core/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components/ui/table';
// App components
import { InfoCard } from '@/core/components/common/InfoCard';
import { LoadingDB } from '@/core/components/common/LoadingDB';
import { ProfessionalsCombobox } from '@/pages/professionals/components/common/ProfessionalsCombobox';
import { Steps } from '@/core/components/common/Steps';
import { UsersCombo } from '@/pages/users/components/UsersCombo';
// App
import { APPO_CONFIG } from '@/config/appointment.config';
import { APP_CONFIG } from '@/config/app.config';
import { AppoSchedule } from '@/pages/appointments/services/schedule.service';
import { AppointmentApiService } from '@/pages/appointments/services/appointment.service';
import { CalendarService } from '@/pages/appointments/services/calendar.service';
import { IAppointment, ITimeSlot } from '@/pages/appointments/interfaces/appointment.interface';
import { IDialog } from '@/core/interfaces/dialog.interface';
import { INotification, useNotificationsStore } from '@/core/stores/notifications.store';
import { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import { IUser } from '@/pages/users/interfaces/user.interface';
import { IWorkingDay } from '@/pages/professionals/interfaces/working-days.interface';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { es, enUS } from 'date-fns/locale';
import { format } from '@formkit/tempo';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useCapitalizeFirstLetter } from '@/core/hooks/useCapitalizeFirstLetter';
import { useEffect, useState } from 'react';
// React component
export default function Appointments() {
  const [appointments, setAppointments] = useState<IAppointment[]>([] as IAppointment[]);
  const [availableSlotsToReserve, setAvailableSlotsToReserve] = useState<number | string>(0);
  const [calendarMonths, setCalendarMonths] = useState<string[]>([]);
  const [calendarYears, setCalendarYears] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dialogContent, setDialogContent] = useState<IDialog>({} as IDialog);
  const [disabledDays, setDisabledDays] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [legibleSchedule, setLegibleSchedule] = useState<string>('');
  const [legibleWorkingDays, setLegibleWorkingDays] = useState<string>('');
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [professionalSelected, setProfessionalSelected] = useState<IProfessional>();
  const [refreshAppos, setRefreshAppos] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedLegibleDate, setSelectedLegibleDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<ITimeSlot>({} as ITimeSlot);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([] as ITimeSlot[]);
  const [todayIsWorkingDay, setTodayIsWorkingDay] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<IUser>({} as IUser);
  const addNotification: (notification: INotification) => void = useNotificationsStore((state) => state.addNotification);
  const capitalize: (sentence: string | undefined) => string | undefined = useCapitalize();
  const capitalizeFirstLetter: (sentence: string | undefined) => string | undefined = useCapitalizeFirstLetter();
  const navigate: NavigateFunction = useNavigate();

  // WIP: working, see comments on calendar
  const [calendarKey, setCalendarKey] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());


  // #region professionalSelected actions
  useEffect(() => {
    if (professionalSelected) {
      const calendarDisabledDays: number[] = CalendarService.getDisabledDays(professionalSelected.configuration.workingDays);
      setDisabledDays(calendarDisabledDays);

      const legibleWorkingDays: string = CalendarService.getLegibleWorkingDays(professionalSelected.configuration.workingDays, true);
      setLegibleWorkingDays(legibleWorkingDays);

      const legibleSchedule: string = CalendarService.getLegibleSchedule(
        professionalSelected.configuration.scheduleTimeInit,
        professionalSelected.configuration.scheduleTimeEnd,
        professionalSelected.configuration.timeSlotUnavailableInit || undefined,
        professionalSelected.configuration.timeSlotUnavailableEnd || undefined,
      );
      setLegibleSchedule(legibleSchedule);
    }

    setSelectedDate(undefined);
    setShowCalendar(true);
    setSelectedDate(new Date());
    // TODO: make both language and years range by admin configuration (db entity)
    const calendarYears: string[] = CalendarService.generateYearsRange(APPO_CONFIG.calendar.yearsRange);
    setCalendarYears(calendarYears);

    const calendarMonths: string[] = CalendarService.generateMonths(APPO_CONFIG.calendar.language);
    setCalendarMonths(calendarMonths);
  }, [professionalSelected]);
  // #endregion
  // #region Load data, schedule creation, time slots generation and appointments insertion.
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
          setAvailableSlotsToReserve(0);
        }

        // Check if today is professional working day
        const dayOfWeekSelected: number = selectedDate.getDay();
        const workingDays: IWorkingDay[] = professionalSelected.configuration.workingDays;
        const todayIsWorkingDay: boolean = CalendarService.checkTodayIsWorkingDay(workingDays, dayOfWeekSelected);
        setTodayIsWorkingDay(todayIsWorkingDay);

        if (todayIsWorkingDay) {
          const legibleTodayDate: string = format(selectedDate, 'full');
          setSelectedLegibleDate(capitalizeFirstLetter(legibleTodayDate) || '');

          const scheduleDate: string = format(selectedDate, 'YYYY-MM-DD');
          setDate(selectedDate);

          const schedule: AppoSchedule = new AppoSchedule(
            `Schedule ${scheduleDate}`,
            new Date(`${scheduleDate}T${professionalSelected.configuration.scheduleTimeInit}`),
            new Date(`${scheduleDate}T${professionalSelected.configuration.scheduleTimeEnd}`),
            Number(professionalSelected.configuration.slotDuration),
            [
              {
                begin: new Date(`${scheduleDate}T${professionalSelected.configuration.timeSlotUnavailableInit}`),
                end: new Date(`${scheduleDate}T${professionalSelected.configuration.timeSlotUnavailableEnd}`),
              },
            ],
          );

          setShowCalendar(true);
          setTimeSlots(schedule.timeSlots);
          setShowTimeSlots(true);
          setLoadingAppointments(true);
          // prettier-ignore
          AppointmentApiService
          .findAllByProfessional(professionalSelected._id, scheduleDate)
          .then((response) => {
            if (response.statusCode === 200) {
              setAppointments(response.data);
              schedule.insertAppointments(response.data);

              const availableSlotsToReserve: number = schedule.availableSlotsToReserve(selectedDate, schedule.timeSlots, response.data.length);
              setAvailableSlotsToReserve(availableSlotsToReserve);
            }

            if (response.statusCode > 399) {
              const availableSlotsToReserve: number = schedule.availableSlotsToReserve(selectedDate, schedule.timeSlots, 0);
              setAvailableSlotsToReserve(availableSlotsToReserve);
            }

            if (response instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
          })
          .finally(() => setLoadingAppointments(false));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, refreshAppos]);
  // #endregion
  // #region Appointment actions (reserve and cancel)
  async function handleReserveAppointment(timeSlot: ITimeSlot | undefined): Promise<void> {
    if (timeSlot && professionalSelected && selectedDate !== undefined) {
      const newAppo = await AppointmentApiService.create({
        slot: timeSlot.id,
        professional: professionalSelected?._id || '',
        day: format(date ?? new Date(), 'YYYY-MM-DD'),
        hour: timeSlot.begin,
        user: userSelected._id,
      });

      if (newAppo.statusCode === 200) {
        addNotification({ type: 'success', message: newAppo.message });
        setRefreshAppos(crypto.randomUUID());
        handleResetDialog();
      }
      if (newAppo.statusCode > 399) addNotification({ type: 'error', message: newAppo.message });
      if (newAppo instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
    }
  }

  async function handleCancelAppointment(slot: ITimeSlot): Promise<void> {
    if (slot.appointment?._id) {
      AppointmentApiService.remove(slot.appointment._id).then((response) => {
        if (response.statusCode === 200) {
          addNotification({ type: 'success', message: response.message });
          setRefreshAppos(crypto.randomUUID());
          setOpenDialog(false);
        }
        if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
        if (response instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
      });
    }
  }
  // #endregion
  // #region Dialog
  function handleDialog(action: 'reserve' | 'cancel', slot: ITimeSlot): void {
    setOpenDialog(true);
    setSelectedSlot(slot);

    if (action === 'reserve') {
      const reserveDialogContent: IDialog = {
        action: 'reserve',
        content: <UsersCombo searchBy='dni' searchResult={(e) => setUserSelected(e)} placeholder={APPO_CONFIG.dialog.userCombobox.placeholder} />,
        description: APPO_CONFIG.dialog.reserve.description,
        title: APPO_CONFIG.dialog.reserve.title,
      };

      setDialogContent(reserveDialogContent);
    }

    if (action === 'cancel') {
      setUserSelected({} as IUser);

      const cancelDialogContent: IDialog = {
        action: 'cancel',
        content: (
          <div className='space-y-2'>
            <div>
              {APPO_CONFIG.dialog.cancel.contentText}
              <span className='font-semibold'>
                {capitalize(slot.appointment?.user.lastName)}, {capitalize(slot.appointment?.user.firstName)}
              </span>
            </div>
            <div className='italic'>
              {`${capitalizeFirstLetter(format(slot.appointment?.day as string, 'full'))} - ${slot.appointment?.hour} ${APPO_CONFIG.words.hours}`}
            </div>
          </div>
        ),
        description: APPO_CONFIG.dialog.cancel.description,
        title: APPO_CONFIG.dialog.cancel.title,
      };

      setDialogContent(cancelDialogContent);
    }
  }

  function handleResetDialog(): void {
    setOpenDialog(false);
    setUserSelected({} as IUser);
  }

  function generateReservationSummary(userSelected: IUser): JSX.Element {
    return (
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <ClipboardCheck className='h-5 w-5' strokeWidth={2} />
          <div className='flex flex-row items-center space-x-1'>
            <span>{APPO_CONFIG.dialog.reserve.summary.line1}</span>
            <span className='font-bold'>{`${capitalize(userSelected.lastName)}, ${capitalize(userSelected.firstName)}`}</span>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <CalendarCheck className='h-5 w-5' strokeWidth={2} />
          <span>
            {APPO_CONFIG.dialog.reserve.summary.line2} {selectedLegibleDate}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <Clock className='h-5 w-5' strokeWidth={2} />
          <span>
            {APPO_CONFIG.dialog.reserve.summary.line3} {selectedSlot.begin}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <BriefcaseMedical className='h-5 w-5' strokeWidth={2} />
          <span className='font-semibold'>{`${capitalize(professionalSelected?.title.abbreviation)} ${capitalize(professionalSelected?.lastName)}, ${capitalize(professionalSelected?.firstName)}`}</span>
        </div>
      </div>
    );
  }
  // #endregion
  return (
    <>
      <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6'>
        <div className='flex flex-col gap-4 overflow-x-auto md:flex-row lg:flex-row'>
          <div className='flex h-fit flex-col gap-5 md:mx-auto md:w-1/3 lg:mx-auto lg:w-1/3'>
            <div className='flex w-full flex-col space-y-4'>
              <Steps text={APPO_CONFIG.steps.text1} step='1' />
              <ProfessionalsCombobox
                onSelectProfessional={(professional) => setProfessionalSelected(professional)}
                options={{
                  loadingText: APPO_CONFIG.combobox.loadingText,
                  notFoundText: APPO_CONFIG.combobox.notFoundText,
                  placeholder: APPO_CONFIG.combobox.placeholder,
                  searchText: APPO_CONFIG.combobox.searchText,
                }}
                className='w-fit'
              />
              {professionalSelected && (
                <div className='mt-2 flex w-full flex-col text-slate-500'>
                  <div className='flex flex-row gap-2 text-sm font-normal'>
                    <span className='text-sm font-semibold underline'>{APPO_CONFIG.phrases.availableDays}</span>
                    {legibleWorkingDays}
                  </div>
                  <div className='flex flex-row gap-2 text-sm font-normal'>
                    <span className='text-sm font-semibold underline'>{APPO_CONFIG.words.schedule}</span>
                    {legibleSchedule}
                  </div>
                </div>
              )}
            </div>
            <div className={cn('flex flex-col space-y-4', showCalendar ? 'pointer-events-auto' : 'pointer-events-none')}>
              {professionalSelected && (
                <>
                  <Steps text={APPO_CONFIG.steps.text2} step='2' />
                  <Calendar 
                    key={calendarKey}
                    onMonthChange={month => {setSelectedMonth(month.getMonth()); setSelectedYear(month.getFullYear());}}
                    defaultMonth={new Date(selectedYear, selectedMonth)}
                    fromYear={Number(calendarYears[0])}
                    toYear={Number(calendarYears[calendarYears.length - 1])}
                    className='h-fit w-fit flex-row rounded-lg bg-card text-card-foreground shadow-sm'
                    disabled={[
                      new Date(2024, 8, 17),
                      new Date(2024, 8, 18),
                      { dayOfWeek: disabledDays },
                      // { before: new Date() }, // This is to disable past days
                      { from: new Date(2024, 5, 5) },
                    ]}
                    locale={APPO_CONFIG.calendar.language === 'es' ? es : enUS}
                    mode='single'
                    selected={date}
                    showOutsideDays={false}
                    onDayClick={(event) => setSelectedDate(event)}
                    footer={
                      // TODO: onValueChange select the date, by year and month
                      // and set the date to calendar -> setSelectedDate()
                      // WIP: onValueChange must be refactored in a function and re-render the schedule
                      <div className='flex text-xs w-full pt-3 space-x-3'>
                        <Select value={selectedYear.toString()} onValueChange={(value) => {setSelectedYear(Number(value)); setCalendarKey(crypto.randomUUID())}}>
                          <SelectTrigger className='w-1/2 h-7 text-xs border'>
                            <SelectValue placeholder={APPO_CONFIG.calendar.placeholder.year} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {calendarYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Select value={selectedMonth.toString()} onValueChange={(value) => {setSelectedMonth(Number(value)); setCalendarKey(crypto.randomUUID())}}>
                          <SelectTrigger className='w-1/2 h-7 text-xs border'>
                            <SelectValue placeholder={APPO_CONFIG.calendar.placeholder.month} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {calendarMonths.map((month, index) => <SelectItem key={month} value={index.toString()}>{capitalize(month)}</SelectItem>)}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    }
                  />
                </>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-4 md:w-2/3 lg:w-2/3'>
            {professionalSelected && selectedDate && (
              <>
                <Steps text={APPO_CONFIG.steps.text3} step='3' />
                {todayIsWorkingDay ? (
                  loadingAppointments ? (
                    <LoadingDB text={'Cargando agenda'} variant='card' size='default' />
                  ) : (
                    <Card className='w-full'>
                      <CardHeader>
                        <CardTitle className='px-3 text-base'>
                          <div className='flex flex-row justify-between'>
                            <div className='flex flex-row items-center gap-2'>
                              <CalendarDays className='h-4 w-4' />
                              <span>{APPO_CONFIG.table.title}</span>
                            </div>
                            {professionalSelected?._id && (
                              <h1>{`${capitalize(professionalSelected?.title.abbreviation)} ${capitalize(professionalSelected?.lastName)}, ${capitalize(professionalSelected?.firstName)}`}</h1>
                            )}
                          </div>
                        </CardTitle>
                        {!errorMessage && <div className='py-2 text-center text-base font-semibold text-primary'>{selectedLegibleDate}</div>}
                        {showTimeSlots && (
                          <div className='flex justify-start space-x-3 px-3 pb-2 text-sm font-normal'>
                            <div className='flex flex-row items-center space-x-1.5'>
                              <div className='h-2.5 w-2.5 rounded-full border border-emerald-400 bg-emerald-300'></div>
                              <span>{`${availableSlotsToReserve} ${availableSlotsToReserve === 1 ? APPO_CONFIG.phrases.availableAppointmentSingular : APPO_CONFIG.phrases.availableAppointmentPlural}`}</span>
                            </div>
                            <div className='flex flex-row items-center space-x-1.5'>
                              <div className='h-2.5 w-2.5 rounded-full border border-sky-400 bg-sky-300'></div>
                              <span>{`${appointments.length} ${appointments.length === 1 ? APPO_CONFIG.phrases.alreadyReservedSingular : APPO_CONFIG.phrases.alreadyReservedPlural}`}</span>
                            </div>
                          </div>
                        )}
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
                            <TableHeader className='bg-slate-100'>
                              <TableRow>
                                <TableHead className='h-0 w-[60px] py-1 text-center font-semibold'>{APPO_CONFIG.table.headers[0]}</TableHead>
                                <TableHead className='h-0 w-[100px] px-2 py-1 text-left font-semibold'>{APPO_CONFIG.table.headers[1]}</TableHead>
                                <TableHead className='h-0 py-1 text-left font-semibold'>{APPO_CONFIG.table.headers[2]}</TableHead>
                                <TableHead className='h-0 w-[140px] px-2 py-1 text-center font-semibold'>{APPO_CONFIG.table.headers[3]}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {timeSlots.map((slot, index) =>
                                slot.available ? (
                                  <TableRow
                                    key={crypto.randomUUID()}
                                    className={`text-base ${slot.available ? 'text-foreground' : 'bg-slate-100 text-slate-400'} ${index === timeSlots.length - 1 ? 'border-none' : 'border-b'}`}
                                  >
                                    <>
                                      <TableCell className='p-1.5 text-center text-sm font-normal'>
                                        {APPO_CONFIG.words.shiftPrefix + slot.id}
                                      </TableCell>
                                      <TableCell className='p-1.5 text-left text-sm font-normal'>
                                        {slot.begin} {APPO_CONFIG.words.hours}
                                      </TableCell>
                                      {slot.appointment?.user ? (
                                        <TableCell className='p-1.5 text-base font-normal'>{`${capitalize(slot.appointment.user.lastName)}, ${capitalize(slot.appointment.user.firstName)}`}</TableCell>
                                      ) : (
                                        <TableCell className='p-1.5 text-base font-normal'></TableCell>
                                      )}
                                      <TableCell className='flex items-center justify-end space-x-4 p-1.5'>
                                        {/* Time slot reserve button */}
                                        {!slot.appointment?.user && AppoSchedule.isDatetimeInFuture(date, slot.begin) && (
                                          <Button
                                            onClick={() => handleDialog('reserve', slot)}
                                            variant='default'
                                            size='xs'
                                            className='border border-emerald-300/50 bg-emerald-200 px-2 py-1 text-xs text-emerald-700 shadow-none hover:bg-emerald-300'
                                          >
                                            {APPO_CONFIG.buttons.addAppointment}
                                          </Button>
                                        )}
                                        {/* Time slot view button */}
                                        {slot.appointment?.user && (
                                          <Button
                                            onClick={() => navigate(`/appointments/${slot.appointment?._id}`)}
                                            variant='table'
                                            size='xs'
                                            className='border border-sky-300/50 bg-sky-200 px-2 py-1 text-xs text-sky-700 shadow-none hover:bg-sky-300'
                                          >
                                            {APPO_CONFIG.buttons.viewAppointment}
                                          </Button>
                                        )}
                                        {/* Time slot cancel button */}
                                        {slot.appointment?.user && AppoSchedule.isDatetimeInFuture(date, slot.begin) && (
                                          <Button
                                            onClick={() => handleDialog('cancel', slot)}
                                            variant='table'
                                            size='xs'
                                            className='border border-rose-300/50 bg-rose-200 px-2 py-1 text-xs text-rose-700 shadow-none hover:bg-rose-300'
                                          >
                                            {APPO_CONFIG.buttons.cancelAppointment}
                                          </Button>
                                        )}
                                      </TableCell>
                                    </>
                                  </TableRow>
                                ) : (
                                  <TableRow className='bg-slate-100/60 text-slate-400'>
                                    <TableCell colSpan={4} className='p-1.5 text-center'>
                                      {slot.available
                                        ? slot.begin
                                        : `${APPO_CONFIG.phrases.notAvailable} ${APPO_CONFIG.words.from} ${slot.begin} ${APPO_CONFIG.words.to} ${slot.end}`}
                                      {APPO_CONFIG.words.hours}
                                    </TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      )}
                    </Card>
                  )
                ) : (
                  <Card>
                    <CardContent className='pt-6'>
                      <InfoCard type='warning' text={APPO_CONFIG.warning.selectWorkingDay} />
                    </CardContent>
                  </Card>
                )}
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
            <div className='pt-4'>
              {dialogContent.action === 'reserve' && !userSelected._id && dialogContent.content}
              {dialogContent.action === 'reserve' && userSelected._id && generateReservationSummary(userSelected)}
              {dialogContent.action === 'cancel' && dialogContent.content}
            </div>
            <div className='flex justify-end gap-6 pt-4'>
              <Button variant={'secondary'} size={'default'} onClick={() => handleResetDialog()}>
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
