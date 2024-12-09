// Icons: https://lucide.dev
import { Filter, X } from 'lucide-react';
// External components: http://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// Components
import { LoadingDB } from '@core/components/common/LoadingDB';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
// Imports
import type { IApposFilters } from '@appointments/interfaces/appos-filters.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { motion } from '@core/services/motion.service';
import { useApposFilters } from '@appointments/hooks/useApposFilters';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useHelpStore } from '@settings/stores/help.store';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { useTranslation } from 'react-i18next';
// React component
export function ApposFilters({ userId, disabled }: { userId: string; disabled: boolean }) {
  const [loadingProfessionals, setLoadingProfessionals] = useState<boolean>(false);
  const [loadingYears, setLoadingYears] = useState<boolean>(false);
  const [professionalError, setProfessionalError] = useState<boolean>(false);
  const [professionals, setProfessionals] = useState<IProfessional[]>([]);
  const [yearError, setYearError] = useState<boolean>(false);
  const [years, setYears] = useState<string[]>([]);
  const [clearButtonScope, clearButtonAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const { help } = useHelpStore();
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

  useEffect(() => {
    console.log('check professional years on db');
  }, [professional]);

  function clearButtonAnimationOver(): void {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    clearButtonAnimation(clearButtonScope.current, keyframes, options);
  }

  function clearButtonAnimationOut(): void {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    clearButtonAnimation(clearButtonScope.current, keyframes, options);
  }

  return (
    <main className='flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-100 px-2 py-1'>
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
          <TooltipWrapper tooltip={t('tooltip.selectProfessional')} help={help}>
            <SelectTrigger className={'h-7 w-fit space-x-3 border border-slate-300 bg-white text-xsm shadow-none'}>
              {loadingProfessionals ? (
                <LoadingDB variant='default' text={t('loading.default')} className='h-7 px-0 text-xsm font-normal' />
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
                <SelectItem key={crypto.randomUUID()} value={professional._id}>
                  {capitalize(professional.title.abbreviation)} {capitalize(professional.firstName)} {capitalize(professional.lastName)}
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
          <TooltipWrapper tooltip={t('tooltip.selectYear')} help={help}>
            <SelectTrigger className={'h-7 w-fit space-x-3 border border-slate-300 bg-white text-xsm shadow-none'}>
              {loadingYears ? (
                <LoadingDB variant='default' text={t('loading.default')} className='h-7 px-0 text-xsm font-normal' />
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
                <SelectItem key={crypto.randomUUID()} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
      {(professional || year) && (
        <section className='flex items-center space-x-2'>
          <TooltipWrapper tooltip={t('tooltip.clearFilters')} help={help}>
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
