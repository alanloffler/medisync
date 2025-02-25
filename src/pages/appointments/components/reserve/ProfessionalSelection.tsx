// Icons: https://lucide.dev/icons/
import { CalendarClock, CalendarDays, X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
// Components
import { ProfessionalsCombobox } from '@professionals/components/common/ProfessionalsCombobox';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { type Dispatch, type SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import { CalendarService } from '@appointments/services/calendar.service';
// Interface
interface IProps {
  clearFilters: () => void;
  professional: IProfessional | undefined;
  setSelected: Dispatch<SetStateAction<IProfessional | undefined>>;
  setDisabledDays: Dispatch<SetStateAction<number[]>>;
}
// React component
export function ProfessionalSelection({ clearFilters, professional, setSelected }: IProps) {
  const { i18n, t } = useTranslation();
  const locale: string = i18n.resolvedLanguage || i18n.language;

  const legibleWorkingDays: string = useMemo(() => {
    return CalendarService.getLegibleWorkingDays(professional?.configuration.workingDays ?? [], true, locale);
  }, [professional?.configuration.workingDays, locale]);

  return (
    <section className='flex w-full flex-col space-y-4'>
      <h5 className='flex items-center gap-2 text-xsm font-semibold uppercase'>
        <span className='flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-center leading-none text-background'>1</span>
        {t('section.appointments.reserve.steps.title1')}
      </h5>
      <div className='flex items-center space-x-3'>
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
        {professional && (
          <TooltipWrapper tooltip={t('tooltip.delete')}>
            <Button variant='clear' size='icon5' onClick={clearFilters}>
              <X size={14} strokeWidth={2} />
            </Button>
          </TooltipWrapper>
        )}
      </div>
      {professional && (
        <section className='flex w-full flex-col space-y-1 text-sm font-normal text-slate-500 md:max-w-[300px]'>
          <div className='flex flex-row items-center space-x-2'>
            <CalendarDays size={17} strokeWidth={2} className='min-w-[18px]' />
            <span>{legibleWorkingDays}</span>
          </div>
          <div className='flex flex-row items-center space-x-2'>
            <CalendarClock size={17} strokeWidth={2} />
            <span>
              {professional.configuration.unavailableTimeSlot?.timeSlotUnavailableInit &&
              professional.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd
                ? t('cardContent.scheduleHour.interval', {
                    timeInit: professional.configuration.scheduleTimeInit,
                    timeEnd: professional.configuration.scheduleTimeEnd,
                    intervalInit: professional.configuration.unavailableTimeSlot?.timeSlotUnavailableInit,
                    intervalEnd: professional.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd,
                  })
                : t('cardContent.scheduleHour.default', {
                    timeInit: professional.configuration.scheduleTimeInit,
                    timeEnd: professional.configuration.scheduleTimeEnd,
                  })}
            </span>
          </div>
        </section>
      )}
    </section>
  );
}
