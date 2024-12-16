// Icons: https://lucide.dev/icons
import {
  BriefcaseMedical,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CircleSlash2,
  ClipboardCheck,
  Clock,
  ClockAlert,
  FileWarning,
  IdCard,
  X,
} from 'lucide-react';
// External Components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Calendar } from '@core/components/ui/calendar';
import { Card, CardContent, CardTitle } from '@core/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// Components
import { CalendarFooter } from '@appointments/components/CalendarFooter';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { ProfessionalsCombobox } from '@professionals/components/common/ProfessionalsCombobox';
import { StatusSelect } from '@appointments/components/common/StatusSelect';
// import { Steps } from '@core/components/common/Steps';
import { UsersCombo } from '@users/components/UsersCombo';
// External imports
import { es, enUS, Locale } from 'date-fns/locale';
import { format, parse } from '@formkit/tempo';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IAppointment, ITimeSlot } from '@appointments/interfaces/appointment.interface';
import type { IDialog } from '@core/interfaces/dialog.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IUser } from '@users/interfaces/user.interface';
import type { IWorkingDay } from '@professionals/interfaces/working-days.interface';
import { AppoSchedule } from '@appointments/services/schedule.service';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { CalendarService } from '@appointments/services/calendar.service';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { RESERVE_APPOINTMENT_CONFIG as RA_CONFIG } from '@config/appointments/reserve-appointments.config';
import { Trans, useTranslation } from 'react-i18next';
import { UtilsString } from '@core/services/utils/string.service';
import { cn } from '@lib/utils';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Enum
enum DialogAction {
  CANCEL = 'cancel',
  RESERVE = 'reserve',
}
// React component
export default function ReserveAppointments() {
  const [appointments, setAppointments] = useState<IAppointment[]>([] as IAppointment[]);
  const [availableSlotsToReserve, setAvailableSlotsToReserve] = useState<number>(0);
  const [calendarKey, setCalendarKey] = useState<string>('');
  const [calendarLocale, setCalendarLocale] = useState<Locale>();
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
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedSlot, setSelectedSlot] = useState<ITimeSlot>({} as ITimeSlot);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([] as ITimeSlot[]);
  const [todayIsWorkingDay, setTodayIsWorkingDay] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<IUser>({} as IUser);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { i18n, t } = useTranslation();

  const selectedLocale = i18n.resolvedLanguage || i18n.language;

  useEffect(() => {
    if (selectedDate) {
      const legibleTodayDate: string = format(selectedDate, 'full', selectedLocale);
      setSelectedLegibleDate(legibleTodayDate);
      if (selectedLocale === 'es') setCalendarLocale(es);
      if (selectedLocale === 'en') setCalendarLocale(enUS);
    }
  }, [selectedLocale, selectedDate]);
  // #region professionalSelected actions
  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[1].id);
  }, [setItemSelected]);

  useEffect(() => {
    if (professionalSelected) {
      const calendarDisabledDays: number[] = CalendarService.getDisabledDays(professionalSelected.configuration.workingDays);
      setDisabledDays(calendarDisabledDays);

      const legibleWorkingDays: string = CalendarService.getLegibleWorkingDays(professionalSelected.configuration.workingDays, true, selectedLocale);
      setLegibleWorkingDays(legibleWorkingDays);

      const legibleSchedule: string = CalendarService.getLegibleSchedule(
        professionalSelected.configuration.scheduleTimeInit,
        professionalSelected.configuration.scheduleTimeEnd,
        professionalSelected.configuration.unavailableTimeSlot?.timeSlotUnavailableInit || undefined,
        professionalSelected.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd || undefined,
      );
      setLegibleSchedule(legibleSchedule);
    }

    setSelectedDate(undefined);
    setShowCalendar(true);
    setSelectedDate(new Date());

    const calendarYears: string[] = CalendarService.generateYearsRange(RA_CONFIG.calendar.yearsRange);
    setCalendarYears(calendarYears);

    const calendarMonths: string[] = CalendarService.generateMonths(selectedLocale);
    setCalendarMonths(calendarMonths);
  }, [professionalSelected, selectedLocale]);
  // #endregion
  // #region Load data, schedule creation, time slots generation and appointments insertion.
  useEffect(() => {
    if (professionalSelected) {
      if (!professionalSelected.configuration) {
        addNotification({ type: 'error', message: t('section.appointments.reserve.error.unavailableConfiguration') });
        setErrorMessage(t('section.appointments.reserve.error.unavailableConfiguration'));
        return;
      }

      if (selectedDate) {
        if (selectedDate !== date) {
          setTimeSlots([]);
          setAppointments([]);
          setErrorMessage('');
          setAvailableSlotsToReserve(0);
        }

        // Check if today is professional's working day
        const dayOfWeekSelected: number = selectedDate.getDay();
        const workingDays: IWorkingDay[] = professionalSelected.configuration.workingDays;
        const todayIsWorkingDay: boolean = CalendarService.checkTodayIsWorkingDay(workingDays, dayOfWeekSelected);
        setTodayIsWorkingDay(todayIsWorkingDay);

        if (todayIsWorkingDay) {
          // Deprecated: legible date is set on page load and on language change. Test it!
          // const legibleTodayDate: string = format(selectedDate, 'full', selectedLocale);
          // setSelectedLegibleDate(capitalizeFirstLetter(legibleTodayDate) || '');

          const scheduleDate: string = format(selectedDate, 'YYYY-MM-DD');
          setDate(selectedDate);

          const schedule: AppoSchedule = new AppoSchedule(
            `Schedule ${scheduleDate}`,
            new Date(`${scheduleDate}T${professionalSelected.configuration.scheduleTimeInit}`),
            new Date(`${scheduleDate}T${professionalSelected.configuration.scheduleTimeEnd}`),
            Number(professionalSelected.configuration.slotDuration),
            [
              {
                begin: new Date(`${scheduleDate}T${professionalSelected.configuration.unavailableTimeSlot?.timeSlotUnavailableInit}`),
                end: new Date(`${scheduleDate}T${professionalSelected.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd}`),
              },
            ],
          );

          setShowCalendar(true);
          setTimeSlots(schedule.timeSlots);
          setShowTimeSlots(true);
          setLoadingAppointments(true);

          AppointmentApiService.findAllByProfessional(professionalSelected._id, scheduleDate)
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

              if (response instanceof Error) addNotification({ type: 'error', message: t('error.internalServer') });
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
      if (newAppo instanceof Error) addNotification({ type: 'error', message: t('error.internalServer') });
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
        if (response instanceof Error) addNotification({ type: 'error', message: t('error.internalServer') });
      });
    }
  }

  useEffect(() => {
    if (openDialog === false) handleResetDialog();
  }, [openDialog]);
  // #endregion
  // #region Dialog
  function handleDialog(action: DialogAction, slot: ITimeSlot): void {
    setOpenDialog(true);
    setSelectedSlot(slot);

    if (action === DialogAction.RESERVE) {
      const reserveDialogContent: IDialog = {
        action: DialogAction.RESERVE,
        content: <UsersCombo searchBy='dni' searchResult={(e) => setUserSelected(e)} placeholder={t('placeholder.userCombobox')} />,
        description: t('dialog.reserveAppointment.description'),
        title: t('dialog.reserveAppointment.title'),
      };

      setDialogContent(reserveDialogContent);
    }

    if (action === DialogAction.CANCEL) {
      setUserSelected({} as IUser);

      const cancelDialogContent: IDialog = {
        action: DialogAction.CANCEL,
        content: (
          <div className='space-y-2'>
            <Trans
              i18nKey='dialog.deleteAppointment.contentText'
              values={{
                firstName: UtilsString.upperCase(slot.appointment?.user.firstName),
                lastName: UtilsString.upperCase(slot.appointment?.user.lastName),
              }}
              components={{
                span: <span className='font-semibold' />,
              }}
            />
            <p className='italic'>
              {`${UtilsString.upperCase(format(slot.appointment?.day as string, 'full', selectedLocale))} - ${slot.appointment?.hour} ${t('words.hoursAbbreviation')}`}
            </p>
          </div>
        ),
        description: t('dialog.deleteAppointment.description'),
        title: t('dialog.deleteAppointment.title'),
      };

      setDialogContent(cancelDialogContent);
    }
  }

  function handleResetDialog(): void {
    setOpenDialog(false);
    setUserSelected({} as IUser);
  }
  // #endregion
  function generateReservationSummary(userSelected: IUser): JSX.Element {
    return (
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <ClipboardCheck className='h-5 w-5' strokeWidth={2} />
          <div className='flex flex-row items-center gap-1'>
            <Trans
              i18nKey='dialog.reserveAppointment.content.reservedTo'
              values={{ firstName: UtilsString.upperCase(userSelected.firstName), lastName: UtilsString.upperCase(userSelected.lastName) }}
              components={{
                span: <span className='font-semibold' />,
              }}
            />
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <CalendarCheck className='h-5 w-5' strokeWidth={2} />
          <div className='flex flex-row items-center gap-1'>
            <Trans
              i18nKey='dialog.reserveAppointment.content.date'
              values={{ date: selectedLegibleDate }}
              components={{
                span: <span />,
              }}
            />
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Clock className='h-5 w-5' strokeWidth={2} />
          <div className='flex flex-row items-center gap-1'>
            <Trans
              i18nKey='dialog.reserveAppointment.content.hour'
              values={{ hour: selectedSlot.begin }}
              components={{
                span: <span />,
              }}
            />
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <BriefcaseMedical className='h-5 w-5' strokeWidth={2} />
          <span className='font-semibold'>
            {UtilsString.upperCase(
              `${professionalSelected?.title.abbreviation} ${professionalSelected?.firstName} ${professionalSelected?.lastName}`,
              'each',
            )}
          </span>
        </div>
      </div>
    );
  }
  // #region Calendar footer
  function selectYear(value: string): void {
    setSelectedYear(parseInt(value));
    setCalendarKey(crypto.randomUUID());
  }

  function selectMonth(value: string): void {
    setSelectedMonth(parseInt(value));
    setCalendarKey(crypto.randomUUID());
  }
  // #endregion

  const daysWithAppos = [
    { day: '2024-12-02', value: 5 },
    { day: '2024-12-12', value: 25 },
  ];

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6'>
      <section className='flex flex-col gap-6 overflow-x-auto md:flex-row lg:flex-row'>
        {/* Section: Left side */}
        <section className='flex h-fit flex-col gap-4 rounded-lg bg-background p-4 md:mx-auto md:w-1/3 md:gap-6 lg:mx-auto lg:w-1/3 lg:gap-6'>
          {/* Section: Select professional */}
          <section className='flex w-full flex-col space-y-4'>
            <h5 className='flex items-center gap-2 text-xsm font-semibold uppercase'>
              <span className='flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-center leading-none text-background'>1</span>
              {t('section.appointments.reserve.steps.title1')}
            </h5>
            <div className=''>
              <ProfessionalsCombobox
                onSelectProfessional={(professional) => setProfessionalSelected(professional)}
                options={{
                  loadingText: t('loading.default'),
                  notFoundText: t('error.notFoundDefault'),
                  placeholder: t('placeholder.professionalCombobox'),
                  searchText: t('search.default'),
                }}
                className='w-fit bg-input hover:bg-input-hover'
              />
            </div>
            {professionalSelected && (
              <section className='flex w-full flex-col space-y-1 text-sm font-normal text-slate-500'>
                <div className='flex flex-row items-center space-x-2'>
                  <CalendarDays size={18} strokeWidth={2} />
                  <span>{legibleWorkingDays}</span>
                </div>
                <div className='flex flex-row items-center space-x-2'>
                  <CalendarClock size={18} strokeWidth={2} />
                  <span>{legibleSchedule}</span>
                </div>
              </section>
            )}
          </section>
          {/* Section: Calendar */}
          <section className={cn('flex flex-col space-y-3', showCalendar ? 'pointer-events-auto' : 'pointer-events-none')}>
            <h5 className='flex items-center gap-2 text-xsm font-semibold uppercase'>
              <span className='flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-center leading-none text-background'>2</span>
              {t('section.appointments.reserve.steps.title2')}
            </h5>
            <Calendar
              className='mx-auto text-card-foreground'
              defaultMonth={new Date(selectedYear, selectedMonth)}
              disabled={[
                new Date(2024, 8, 17),
                new Date(2024, 8, 18),
                { dayOfWeek: disabledDays },
                // { before: new Date() }, // This is to disable past days
                { from: new Date(2024, 5, 5) },
              ]}
              fromYear={Number(calendarYears[0])}
              key={calendarKey}
              locale={calendarLocale}
              mode='single'
              onDayClick={(event) => professionalSelected && setSelectedDate(event)}
              onMonthChange={(month) => {
                setSelectedMonth(month.getMonth());
                setSelectedYear(month.getFullYear());
              }}
              selected={date}
              showOutsideDays={false}
              toYear={Number(calendarYears[calendarYears.length - 1])}
              formatters={{
                formatDay: (day) => {
                  console.log('day', day.getDate());
                  const found = daysWithAppos.find((item) => {
                    const transformed = parseInt(item.day.split('-')[2]);
                    console.log(transformed);
                    if (transformed === day.getDate()) return item;
                  });
                  console.log(found);
                  return found ? (
                    <div>
                      <span>{day.getDate()}</span>
                      <span className='border border-emerald-400 h-6 w-6 rounded-full absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2'></span>
                      {/* <span className='bg-emerald-400 text-white rounded-full w-3.5 h-3.5 absolute bottom-0 right-1 text-[9px] leading-none items-center flex justify-center'>{found.value}</span> */}
                    </div>
                  ) : (
                    day.getDate()
                  );
                },
              }}
            />
            <section className='flex w-full flex-row items-center justify-center space-x-3'>
              <Button
                variant='default'
                className='h-7 w-fit px-2 text-xs'
                onClick={() => {
                  setSelectedMonth(new Date().getMonth());
                  setSelectedYear(new Date().getFullYear());
                  setSelectedDate(new Date());
                  setCalendarKey(crypto.randomUUID());
                }}
              >
                {t('button.today')}
              </Button>
              <CalendarFooter
                calendarMonths={calendarMonths}
                calendarYears={calendarYears}
                disabled={!professionalSelected}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectMonth={selectMonth}
                selectYear={selectYear}
              />
            </section>
          </section>
        </section>
        {/* Section: Right side */}
        <section className='flex flex-col gap-4 md:w-2/3 lg:w-2/3'>
          <>
            {/* Section: Schedule */}
            {true ? (
              // {todayIsWorkingDay ? (
              loadingAppointments ? (
                <LoadingDB text={t('loading.schedule')} variant='card' size='default' />
              ) : (
                <Card className='w-full'>
                  <CardTitle className='bg-card-header! rounded-b-none border-b text-sm md:text-lg'>
                    <section className='flex flex-row justify-between p-2'>
                      <div className='flex flex-row items-center gap-3.5'>
                        <CalendarDays size={16} strokeWidth={2} />
                        <span>{t('cardTitle.appointmentsReserve')}</span>
                      </div>
                      {professionalSelected?._id && (
                        <h1>
                          {UtilsString.upperCase(
                            `${professionalSelected?.title.abbreviation} ${professionalSelected?.firstName} ${professionalSelected?.lastName}`,
                            'each',
                          )}
                        </h1>
                      )}
                    </section>
                  </CardTitle>
                  {!errorMessage && (
                    <>
                      <section className='py-2 text-center text-base font-semibold text-primary'>
                        {UtilsString.upperCase(selectedLegibleDate)}
                      </section>
                      {!professionalSelected && <InfoCard text={'Debés elegir un professional antes de generar un turno'} type='warning' />}
                    </>
                  )}
                  {showTimeSlots && (
                    <section className='flex flex-col justify-start gap-3 px-3 pb-2 text-xsm font-normal md:flex-row'>
                      <div className='flex w-fit flex-row items-center space-x-1.5 rounded-md bg-emerald-100 px-2 py-1'>
                        <div className='h-2.5 w-2.5 rounded-full border border-emerald-400 bg-emerald-300'></div>
                        <span className='text-emerald-700'>{t('table.availableItems.appointments', { count: availableSlotsToReserve })}</span>
                      </div>
                      <div className='flex w-fit flex-row items-center space-x-1.5 rounded-md bg-sky-100 px-2 py-1'>
                        <div className='h-2.5 w-2.5 rounded-full border border-sky-400 bg-sky-300'></div>
                        <span className='text-sky-700'>{t('table.reservedItems.appointments', { count: appointments.length })}</span>
                      </div>
                    </section>
                  )}
                  {errorMessage && (
                    <section className='flex items-center justify-center space-x-2 px-4 py-0 text-rose-500'>
                      <FileWarning className='h-5 w-5' strokeWidth={2} />
                      <span className='text-center font-medium'>{errorMessage}</span>
                    </section>
                  )}
                  <CardContent>
                    {showTimeSlots &&
                      timeSlots.map((slot) =>
                        slot.available ? (
                          <section
                            key={crypto.randomUUID()}
                            className={`flex h-10 flex-row items-center space-x-4 text-xsm ${
                              slot.available ? 'text-foreground' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {/* Slot info */}
                            <div className='flex w-[100px] flex-row items-center justify-between space-x-2'>
                              <div className='h-fit w-fit rounded-sm bg-slate-200 px-1.5 py-1 text-xs leading-3 text-slate-600'>
                                {`${t('words.appointmentPrefix')}${slot.id < 10 ? `0${slot.id}` : slot.id}`}
                              </div>
                              <div className='flex h-fit w-fit flex-row items-center space-x-1 rounded-sm bg-purple-100 p-1 pr-1.5 text-purple-600'>
                                <Clock size={13} strokeWidth={2} />
                                <span className='text-xs leading-3'>{slot.begin}</span>
                              </div>
                            </div>
                            {/* Appointment Section */}
                            {slot.appointment?.user ? (
                              <section className='flex flex-1 flex-row items-center justify-between rounded-md px-2 py-1 hover:bg-slate-100'>
                                <button
                                  className='flex h-fit flex-1 flex-row items-center space-x-4 text-xsm leading-none text-slate-600'
                                  onClick={() => navigate(`/appointments/${slot.appointment?._id}`)}
                                >
                                  <span className='text-sm font-medium'>
                                    {UtilsString.upperCase(`${slot.appointment.user.firstName} ${slot.appointment.user.lastName}`, 'each')}
                                  </span>
                                  <div className='hidden items-center space-x-2 text-muted-foreground lg:flex'>
                                    <IdCard size={18} strokeWidth={1.5} />
                                    <span>{i18n.format(slot.appointment.user.dni, 'number', i18n.resolvedLanguage)}</span>
                                  </div>
                                </button>
                                <div className=''>
                                  <StatusSelect appointment={slot.appointment} mode='update' showLabel className='text-xs text-muted-foreground' />
                                </div>
                              </section>
                            ) : (
                              <div className='relative flex h-px flex-1 flex-row items-center justify-end bg-slate-200'></div>
                            )}
                            {/* Buttons */}
                            <div className='flex w-[100px] flex-row justify-center'>
                              {!slot.appointment?.user && AppoSchedule.isDatetimeInFuture(date, slot.begin) && (
                                <div className='flex w-full justify-center'>
                                  <Button
                                    className='w-full space-x-1.5 bg-emerald-400 px-1.5 py-1.5 text-emerald-50 hover:bg-emerald-500 hover:text-emerald-50 md:pr-2.5'
                                    size='xs'
                                    variant='ghost'
                                    onClick={() => handleDialog(DialogAction.RESERVE, slot)}
                                  >
                                    <CalendarCheck size={16} strokeWidth={2} />
                                    <span className='hidden text-xs font-normal md:block'>{t('button.reserve')}</span>
                                  </Button>
                                </div>
                              )}
                              {slot.appointment?.user && AppoSchedule.isDatetimeInFuture(date, slot.begin) && (
                                <div className='flex w-full justify-center'>
                                  <Button
                                    className='w-full space-x-1.5 bg-rose-400 px-1.5 py-1.5 text-rose-100 hover:bg-rose-500 hover:text-rose-100'
                                    size='xs'
                                    variant='ghost'
                                    onClick={() => handleDialog(DialogAction.CANCEL, slot)}
                                  >
                                    <X size={16} strokeWidth={2} />
                                    <span className='hidden text-xs font-normal md:block'>{t('button.cancel')}</span>
                                  </Button>
                                </div>
                              )}
                              {(slot.appointment?.user || !slot.appointment?.user) && !AppoSchedule.isDatetimeInFuture(date, slot.begin) && (
                                <div className='flex flex-1 items-center justify-center rounded-md bg-slate-100 px-1.5 py-1.5 text-slate-400'>
                                  <CircleSlash2 size={16} strokeWidth={2} />
                                </div>
                              )}
                            </div>
                          </section>
                        ) : (
                          <section
                            key={crypto.randomUUID()}
                            className='mx-auto flex w-fit items-center space-x-2 rounded-md bg-slate-100 px-2 py-1 text-center text-xsm text-slate-500'
                          >
                            <ClockAlert size={16} strokeWidth={2} className='text-rose-400' />
                            <div>{slot.available ? slot.begin : t('warning.hourRangeNotAvailable', { begin: slot.begin, end: slot.end })}</div>
                          </section>
                        ),
                      )}
                  </CardContent>
                </Card>
              )
            ) : (
              <Card>
                <CardContent className='pt-6'>
                  <InfoCard type='warning' text={t('warning.selectWorkingDay')} />
                </CardContent>
              </Card>
            )}
          </>
        </section>
      </section>
      {/* Section: Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
            <section className='z-50 pt-4'>
              {dialogContent.action === DialogAction.RESERVE && !userSelected._id && dialogContent.content}
              {dialogContent.action === DialogAction.RESERVE && userSelected._id && generateReservationSummary(userSelected)}
              {dialogContent.action === DialogAction.CANCEL && dialogContent.content}
            </section>
            <footer className='flex justify-end gap-6 pt-4'>
              <Button variant='secondary' size='sm' onClick={() => handleResetDialog()}>
                {t('button.cancel')}
              </Button>
              {dialogContent.action === DialogAction.RESERVE && (
                <Button variant='default' size='sm' disabled={!userSelected._id} onClick={() => handleReserveAppointment(selectedSlot)}>
                  {t('button.reserveAppointment')}
                </Button>
              )}
              {dialogContent.action === DialogAction.CANCEL && (
                <Button variant='default' size='sm' onClick={() => handleCancelAppointment(selectedSlot)}>
                  {t('button.deleteAppointment')}
                </Button>
              )}
            </footer>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
