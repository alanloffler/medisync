// Icons: https://lucide.dev/icons/
import { Clock, ClockAlert, IdCard } from 'lucide-react';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { StatusSelect } from '@appointments/components/common/StatusSelect';
// External imports
import { isAfter, parse } from '@formkit/tempo';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IAppointmentView, ITimeSlot } from '@appointments/interfaces/appointment.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppoSchedule } from '@appointments/services/schedule.service';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { UtilsString } from '@core/services/utils/string.service';
import { cn } from '@lib/utils';
// React component
export function MicrositeSchedule({ day, professional }: { day: string; professional: IProfessional }) {
  const [schedule, setSchedule] = useState<AppoSchedule | null>(null);
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([] as ITimeSlot[]);
  const { i18n, t } = useTranslation();

  const {
    mutate: fetchAppos,
    error: apposError,
    isError: apposIsError,
  } = useMutation<IResponse<IAppointmentView[]>, Error>({
    mutationKey: ['appointments', 'by-professional', professional?._id, day],
    mutationFn: async () => {
      if (!professional._id || !day) throw new Error('Dev Error: No ID or day provided');
      return await AppointmentApiService.findAllByProfessional(professional._id, day);
    },
    onSuccess: (response) => {
      schedule?.insertAppointments(response.data);
    },
  });

  useEffect(() => {
    const schedule: AppoSchedule = new AppoSchedule(
      `Schedule ${day}`,
      new Date(`${day}T${professional.configuration.scheduleTimeInit}`),
      new Date(`${day}T${professional.configuration.scheduleTimeEnd}`),
      Number(professional.configuration.slotDuration),
      [
        {
          begin: new Date(`${day}T${professional.configuration.unavailableTimeSlot?.timeSlotUnavailableInit}`),
          end: new Date(`${day}T${professional.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd}`),
        },
      ],
    );

    setSchedule(schedule);
    setTimeSlots(schedule.timeSlots);
    fetchAppos();
  }, [day, fetchAppos, professional.configuration]);

  if (apposIsError) return <InfoCard text={apposError.message} variant='error' />;

  return (
    <section>
      {timeSlots.map((slot, index) => {
        const nextSlot = timeSlots[index + 1];
        const isLastAvailableBeforeUnavailable = !nextSlot?.available;

        return slot.available ? (
          <section
            key={crypto.randomUUID()}
            className={cn(
              'flex flex-row items-center gap-3 md:gap-4',
              index === timeSlots.length - 1 || isLastAvailableBeforeUnavailable ? 'border-b-0' : 'border-b',
            )}
            // className={`flex flex-row items-center gap-3 border-b last:border-none md:gap-4 ${slot.available ? 'text-foreground' : 'bg-slate-100 !text-purple-400'}`}
          >
            {/* Slot info */}
            <div className='flex w-fit flex-col py-2 text-xs font-medium leading-3 md:flex-row md:items-center md:justify-between md:gap-2'>
              <div className='flex flex-row rounded-t-md bg-purple-500 p-1.5 text-purple-100'>{`${t('Turno ')}${slot.id < 10 ? `0${slot.id}` : slot.id}`}</div>
              <div className='flex flex-row items-center space-x-2 rounded-b-md bg-purple-100 p-1.5 text-purple-500'>
                <Clock size={13} strokeWidth={3} />
                <span>{slot.begin}</span>
              </div>
            </div>
            {/* Appointment Section */}
            {slot.appointment?.user ? (
              <section className='flex flex-1 flex-row items-center justify-between pl-2'>
                <div className='flex flex-col gap-1 leading-none'>
                  <span className='text-sm text-foreground'>
                    {UtilsString.upperCase(`${slot.appointment.user.firstName} ${slot.appointment.user.lastName}`, 'each')}
                  </span>
                  <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                    <IdCard size={18} strokeWidth={1.5} />
                    <span>{i18n.format(slot.appointment.user.dni, 'integer', i18n.resolvedLanguage)}</span>
                  </div>
                </div>
                <div>
                  <StatusSelect appointment={slot.appointment} mode='update' showLabel={false} />
                </div>
              </section>
            ) : (
              <div className='flex flex-1 flex-row justify-center text-xsm'>
                {isAfter(new Date(), parse(slot.begin, 'HH:mm')) ? (
                  <span className='rounded-md bg-amber-200 px-2 py-1 text-amber-700'>Turno sin reserva</span>
                ) : (
                  <span className='rounded-md bg-green-200 px-2 py-1 text-green-700'>Turno disponible</span>
                )}
              </div>
            )}
          </section>
        ) : (
          <section
            key={crypto.randomUUID()}
            className='flex w-full items-center justify-center space-x-2 border-y border-rose-200 bg-rose-50 py-3 text-center text-xsm text-rose-400'
          >
            <ClockAlert size={16} strokeWidth={2} className='text-rose-400' />
            <div>{slot.available ? slot.begin : t('warning.hourRangeNotAvailable', { begin: slot.begin, end: slot.end })}</div>
          </section>
        );
      })}
    </section>
  );
}
