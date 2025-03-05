// Icons: https://lucide.dev/icons
import { CalendarCheck, CalendarDays, CircleSlash2, Clock, ClockAlert, IdCard, X } from 'lucide-react';
// External Components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardTitle } from '@core/components/ui/card';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { StatusSelect } from '@appointments/components/common/StatusSelect';
// External imports
import { format } from '@formkit/tempo';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import type { IAppointment, ITimeSlot } from '@appointments/interfaces/appointment.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IWorkingDay } from '@professionals/interfaces/working-days.interface';
import { AppoSchedule } from '@appointments/services/schedule.service';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { CalendarService } from '@appointments/services/calendar.service';
import { EDialogAction } from '@appointments/enums/dialog.enum';
import { UtilsString } from '@core/services/utils/string.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Interface
interface IProps {
  handleDialog: (action: EDialogAction, slot: ITimeSlot, isOnly?: boolean) => void;
  professional?: IProfessional;
  refreshAppos: string;
  selectedDate?: Date;
  selectedLegibleDate?: string;
}
// React component
export const DailySchedule = memo(({ handleDialog, professional, refreshAppos, selectedDate, selectedLegibleDate }: IProps) => {
  const [availableSlotsToReserve, setAvailableSlotsToReserve] = useState<number>(0);
  const [schedule, setSchedule] = useState<AppoSchedule | null>(null);
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([] as ITimeSlot[]);
  const [todayIsWorkingDay, setTodayIsWorkingDay] = useState<boolean>(false);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const {
    data: appointments,
    error: errorAppos,
    isPending: isLoadingAppos,
    isError: isErrorAppos,
    mutate: fetchAppos,
  } = useMutation<IResponse<IAppointment[]> | undefined>({
    mutationKey: ['appointments', professional && professional._id, selectedDate && format(selectedDate, 'YYYY-MM-DD')],
    mutationFn: async () => {
      if (professional && selectedDate) {
        return await AppointmentApiService.findAllByProfessional(professional._id, format(selectedDate, 'YYYY-MM-DD'));
      }
      return undefined;
    },
    onSuccess: (response) => {
      if (response && schedule && selectedDate) {
        if (response.statusCode === 200) schedule.insertAppointments(response.data);

        const availableSlotsToReserve: number = schedule.availableSlotsToReserve(selectedDate, schedule.timeSlots, response.data.length ?? 0);
        setAvailableSlotsToReserve(availableSlotsToReserve);
      }
    },
    onError: (error) => {
      addNotification({ type: 'error', message: error.message });
    },
  });

  useEffect(() => {
    // OK, reset calendar selected day
    // If change professional then is undefined

    if (professional && selectedDate) {
      const dayOfWeekSelected: number = selectedDate.getDay();
      const workingDays: IWorkingDay[] = professional.configuration.workingDays;
      const todayIsWorkingDay: boolean = CalendarService.checkTodayIsWorkingDay(workingDays, dayOfWeekSelected);
      const scheduleDate: string = format(selectedDate, 'YYYY-MM-DD');

      const schedule: AppoSchedule = new AppoSchedule(
        `Schedule ${scheduleDate}`,
        new Date(`${scheduleDate}T${professional.configuration.scheduleTimeInit}`),
        new Date(`${scheduleDate}T${professional.configuration.scheduleTimeEnd}`),
        Number(professional.configuration.slotDuration),
        [
          {
            begin: new Date(`${scheduleDate}T${professional.configuration.unavailableTimeSlot?.timeSlotUnavailableInit}`),
            end: new Date(`${scheduleDate}T${professional.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd}`),
          },
        ],
      );

      setSchedule(schedule);
      setTimeSlots(schedule.timeSlots);
      fetchAppos();
      setTodayIsWorkingDay(todayIsWorkingDay);
    }
  }, [addNotification, fetchAppos, professional, refreshAppos, selectedDate, t]);

  useEffect(() => {
    if (!selectedDate) setTodayIsWorkingDay(false);
  }, [selectedDate]);

  // Cached methods between re-renders
  const memoizedHandleDialog = useCallback(
    (action: EDialogAction, slot: ITimeSlot, isOnly?: boolean) => {
      handleDialog(action, slot, isOnly);
    },
    [handleDialog],
  );

  const handleReserve = useCallback(
    (slot: ITimeSlot): void => {
      memoizedHandleDialog(EDialogAction.RESERVE, slot);
    },
    [memoizedHandleDialog],
  );

  const handleCancel = useCallback(
    (slot: ITimeSlot, isOnly: boolean): void => {
      memoizedHandleDialog(EDialogAction.CANCEL, slot, isOnly);
    },
    [memoizedHandleDialog],
  );

  const derivedState = useMemo(() => {
    return {
      availableSlotsToReserve,
      schedule,
      timeSlots,
      todayIsWorkingDay,
    };
  }, [availableSlotsToReserve, schedule, timeSlots, todayIsWorkingDay]);

  if (isErrorAppos) {
    return (
      <Card className='mx-auto w-full p-6'>
        <InfoCard size='sm' text={errorAppos.message} type='flat' variant='error' />
      </Card>
    );
  }

  return professional && selectedDate && derivedState.todayIsWorkingDay ? (
    isLoadingAppos ? (
      <LoadingDB text={t('loading.schedule')} variant='card' size='big' className='w-full gap-6 text-base' />
    ) : (
      <Card className='w-full'>
        <CardTitle className='bg-card-header! rounded-b-none border-b text-sm md:text-lg'>
          <section className='flex flex-row justify-between p-2'>
            <div className='flex flex-row items-center gap-3.5'>
              <CalendarDays size={18} strokeWidth={2} />
              <span>{t('cardTitle.appointmentsReserve')}</span>
            </div>
            {professional._id && (
              <h1>{UtilsString.upperCase(`${professional.title.abbreviation} ${professional.firstName} ${professional.lastName}`, 'each')}</h1>
            )}
          </section>
        </CardTitle>
        <section className='py-2 text-center text-base font-semibold text-primary'>{UtilsString.upperCase(selectedLegibleDate)}</section>
        {derivedState.timeSlots && (
          <section className='flex flex-col justify-start gap-3 px-3 pb-2 text-xsm font-normal md:flex-row'>
            <div className='flex w-fit flex-row items-center space-x-1.5 rounded-md bg-emerald-100 px-2 py-1'>
              <div className='h-2.5 w-2.5 rounded-full border border-emerald-400 bg-emerald-300'></div>
              <span className='text-emerald-700'>{t('table.availableItems.appointments', { count: derivedState.availableSlotsToReserve })}</span>
            </div>
            <div className='flex w-fit flex-row items-center space-x-1.5 rounded-md bg-sky-100 px-2 py-1'>
              <div className='h-2.5 w-2.5 rounded-full border border-sky-400 bg-sky-300'></div>
              <span className='text-sky-700'>{t('table.reservedItems.appointments', { count: appointments?.data.length })}</span>
            </div>
          </section>
        )}
        <CardContent>
          {derivedState.timeSlots &&
            derivedState.timeSlots.map((slot) =>
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
                          <span>{i18n.format(slot.appointment.user.dni, 'integer', i18n.resolvedLanguage)}</span>
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
                    {!slot.appointment?.user && AppoSchedule.isDatetimeInFuture(selectedDate, slot.begin) && (
                      <div className='flex w-full justify-center'>
                        <Button
                          className='w-full space-x-1.5 bg-emerald-400 px-1.5 py-1.5 text-emerald-50 hover:bg-emerald-500 hover:text-emerald-50 md:pr-2.5'
                          size='xs'
                          variant='ghost'
                          onClick={() => handleReserve(slot)}
                        >
                          <CalendarCheck size={16} strokeWidth={2} />
                          <span className='hidden text-xs font-normal md:block'>{t('button.reserve')}</span>
                        </Button>
                      </div>
                    )}
                    {slot.appointment?.user && AppoSchedule.isDatetimeInFuture(selectedDate, slot.begin) && (
                      <div className='flex w-full justify-center'>
                        <Button
                          className='w-full space-x-1.5 bg-rose-400 px-1.5 py-1.5 text-rose-100 hover:bg-rose-500 hover:text-rose-100'
                          size='xs'
                          variant='ghost'
                          onClick={() => handleCancel(slot, !!(appointments?.data && appointments.data.length <= 1))}
                        >
                          <X size={16} strokeWidth={2} />
                          <span className='hidden text-xs font-normal md:block'>{t('button.cancel')}</span>
                        </Button>
                      </div>
                    )}
                    {(slot.appointment?.user || !slot.appointment?.user) && !AppoSchedule.isDatetimeInFuture(selectedDate, slot.begin) && (
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
        <InfoCard size='sm' text={t(!professional ? 'warning.selectProfessional' : 'warning.selectWorkingDay')} type='flat' variant='warning' />
      </CardContent>
    </Card>
  );
});
