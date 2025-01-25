// Icons: https://lucide.dev
import { Filter, X } from 'lucide-react';
// External components: http://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// Components
import { LoadingText } from '@core/components/common/LoadingText';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import type { IApposFilters } from '@appointments/interfaces/appos-filters.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { UtilsString } from '@core/services/utils/string.service';
import { motion } from '@core/services/motion.service';
import { useApposFilters } from '@appointments/hooks/useApposFilters';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export function ApposFilters({ userId, disabled }: { userId: string; disabled: boolean }) {
  const [clearButtonScope, clearButtonAnimation] = useAnimate();
  const [loadingProfessionals, setLoadingProfessionals] = useState<boolean>(false);
  const [loadingYears, setLoadingYears] = useState<boolean>(false);
  const [professionalError, setProfessionalError] = useState<boolean>(false);
  const [professionals, setProfessionals] = useState<IProfessional[]>([]);
  const [yearError, setYearError] = useState<boolean>(false);
  const [years, setYears] = useState<string[]>([]);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { i18n, t } = useTranslation();
  const { professional, year, setFilters, clearFilters } = useApposFilters();

  useEffect(() => {
    setLoadingProfessionals(true);
    setLoadingYears(true);

    AppointmentApiService.findUniqueProfessionalsByUser(userId)
      .then((response: IResponse) => {
        if (response.statusCode === 200) setProfessionals(response.data);
        if (response.statusCode > 399) {
          setProfessionalError(true);
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          setProfessionalError(true);
          addNotification({ type: 'error', message: i18n.t('error.internalServer') });
        }
      })
      .finally(() => setLoadingProfessionals(false));
    // TODO: this must be a method that change the year by the professional selected
    // No professional selected, get all years -> professionalSelected, get available years by professional
    AppointmentApiService.findApposYearsByUser(userId)
      .then((response: IResponse) => {
        if (response.statusCode === 200) setYears(response.data);
        if (response.statusCode > 399) {
          setYearError(true);
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          setYearError(true);
          addNotification({ type: 'error', message: i18n.t('error.internalServer') });
        }
      })
      .finally(() => setLoadingYears(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  function clearButtonAnimationOver(): void {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    clearButtonAnimation(clearButtonScope.current, keyframes, options);
  }

  function clearButtonAnimationOut(): void {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    clearButtonAnimation(clearButtonScope.current, keyframes, options);
  }

  return (
    <main className='flex w-full items-center justify-between rounded-md bg-slate-100 p-2'>
      <section className='flex items-center justify-start space-x-4'>
        <section className='flex items-center space-x-2'>
          <Filter size={14} strokeWidth={1.5} />
          <h1 className='text-xsm font-medium'>{t('search.filter.appointments')}</h1>
        </section>
        <Select
          disabled={disabled || professionalError || professionals.length === 0}
          value={professional ? professional : ''}
          onValueChange={(e) => setFilters({ professional: e as IApposFilters['professional'] })}
        >
          <TooltipWrapper tooltip={t('tooltip.selectProfessional')}>
            <SelectTrigger className={'h-7 w-fit space-x-3 border-slate-300 bg-white text-xsm shadow-sm'}>
              {loadingProfessionals ? (
                <LoadingText text={t('loading.default')} suffix='...' />
              ) : professionalError ? (
                <span className='text-red-500'>{t('error.default')}</span>
              ) : (
                <SelectValue placeholder={t('placeholder.professionalSelect')} />
              )}
            </SelectTrigger>
          </TooltipWrapper>
          <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <SelectGroup>
              {professionals.map((professional) => (
                <SelectItem className='py-1.5 text-xsm [&_svg]:h-3 [&_svg]:w-3' key={crypto.randomUUID()} value={professional._id}>
                  {UtilsString.upperCase(`${professional.title.abbreviation} ${professional.firstName} ${professional.lastName}`, 'each')}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          disabled={disabled || yearError || years.length === 0}
          value={year ? year : ''}
          onValueChange={(e) => setFilters({ year: e as IApposFilters['year'] })}
        >
          <TooltipWrapper tooltip={t('tooltip.selectYear')}>
            <SelectTrigger className={'h-7 w-fit space-x-3 bg-white text-xsm shadow-sm'}>
              {loadingYears ? (
                <LoadingText text={t('loading.default')} suffix='...' />
              ) : yearError ? (
                <span className='text-red-500'>{t('error.default')}</span>
              ) : (
                <SelectValue placeholder={t('placeholder.yearSelect')} />
              )}
            </SelectTrigger>
          </TooltipWrapper>
          <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <SelectGroup>
              {years.map((year) => (
                <SelectItem className='py-1.5 text-xsm [&_svg]:h-3 [&_svg]:w-3' key={crypto.randomUUID()} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
      {(professional || year) && (
        <section className='flex items-center space-x-2'>
          <TooltipWrapper tooltip={t('tooltip.clearFilters')}>
            <Button
              ref={clearButtonScope}
              variant='clear'
              size='icon5'
              onClick={() => clearFilters({ professional, year })}
              onMouseOver={clearButtonAnimationOver}
              onMouseOut={clearButtonAnimationOut}
            >
              <X size={14} strokeWidth={2} />
            </Button>
          </TooltipWrapper>
        </section>
      )}
    </main>
  );
}
