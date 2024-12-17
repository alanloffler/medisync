// Icons: https://lucide.dev/icons/
import { CalendarClock, CalendarDays } from 'lucide-react';
// Components
import { ProfessionalsCombobox } from '@professionals/components/common/ProfessionalsCombobox';
// External imports
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import { CalendarService } from '@appointments/services/calendar.service';
// Interface
interface IProps {
  professional?: IProfessional;
  setSelected: Dispatch<SetStateAction<IProfessional | undefined>>;
  setDisabledDays: Dispatch<SetStateAction<number[]>>;
}
// React component
export function ProfessionalSelection({ professional, setSelected }: IProps) {
  const [legibleSchedule, setLegibleSchedule] = useState<string>('');
  const { i18n, t } = useTranslation();
  const locale: string = i18n.resolvedLanguage || i18n.language;

  const legibleWorkingDays: string = useMemo(() => {
    return CalendarService.getLegibleWorkingDays(professional?.configuration.workingDays ?? [], true, locale);
  }, [professional?.configuration.workingDays, locale]);

  useEffect(() => {
    if (professional) {
      const legibleSchedule: string = CalendarService.getLegibleSchedule(
        professional.configuration.scheduleTimeInit,
        professional.configuration.scheduleTimeEnd,
        professional.configuration.unavailableTimeSlot?.timeSlotUnavailableInit || undefined,
        professional.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd || undefined,
      );
      setLegibleSchedule(legibleSchedule);
    }
  }, [professional]);

  return (
    <section className='flex w-full flex-col space-y-4'>
      <h5 className='flex items-center gap-2 text-xsm font-semibold uppercase'>
        <span className='flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-center leading-none text-background'>1</span>
        {t('section.appointments.reserve.steps.title1')}
      </h5>
      <div className=''>
        <ProfessionalsCombobox
          onSelectProfessional={(professional) => setSelected(professional)}
          options={{
            loadingText: t('loading.default'),
            notFoundText: t('error.notFoundDefault'),
            placeholder: t('placeholder.professionalCombobox'),
            searchText: t('search.default'),
          }}
          className='w-fit bg-input hover:bg-input-hover'
        />
      </div>
      {professional && (
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
  );
}
