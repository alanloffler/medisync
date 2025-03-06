// Icons: https://lucide.dev/icons/
import { Clock, ClockAlert, IdCard } from 'lucide-react';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { StatusSelect } from '@appointments/components/common/StatusSelect';
// External imports
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
// Imports
import type { IAppointmentView, ITimeSlot } from '@appointments/interfaces/appointment.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppoSchedule } from '@appointments/services/schedule.service';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { UtilsString } from '@core/services/utils/string.service';
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
      {timeSlots.map((slot) =>
        slot.available ? (
          <section
            key={crypto.randomUUID()}
            className={`flex h-10 flex-row items-center space-x-4 text-xsm ${slot.available ? 'text-foreground' : 'bg-slate-100 text-slate-400'}`}
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
              <section className='flex flex-1 flex-row items-center rounded-md px-2 py-1'>
                <div className='flex h-fit w-3/4 flex-row items-center space-x-4 text-xsm leading-none text-slate-600'>
                  <span className='text-sm font-medium'>
                    {UtilsString.upperCase(`${slot.appointment.user.firstName} ${slot.appointment.user.lastName}`, 'each')}
                  </span>
                  <div className='hidden items-center space-x-2 text-muted-foreground lg:flex'>
                    <IdCard size={18} strokeWidth={1.5} />
                    <span>{i18n.format(slot.appointment.user.dni, 'integer', i18n.resolvedLanguage)}</span>
                  </div>
                </div>
                <div className='flex w-1/4'>
                  <StatusSelect appointment={slot.appointment} mode='update' showLabel className='justify-start text-xs text-muted-foreground' />
                </div>
              </section>
            ) : (
              <div className='relative flex h-px flex-1 flex-row items-center justify-end bg-slate-200'></div>
            )}
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
    </section>
  );
}
