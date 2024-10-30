// Icons: https://lucide.dev
import { Filter, X } from 'lucide-react';
// External components: http://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
// Components
import { LoadingDB } from '@/core/components/common/LoadingDB';
// External imports
import { animate, spring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
// Imports
import type { IApposFilters } from '@appointments/interfaces/appos-filters.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@/core/interfaces/response.interface';
import { APP_CONFIG } from '@/config/app.config';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { USER_VIEW_CONFIG } from '@/config/user.config';
import { useApposFilters } from '@appointments/hooks/useApposFilters';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useNotificationsStore } from '@/core/stores/notifications.store';
// React component
export function ApposFilters({ userId }: { userId: string }) {
  const [loadingProfessionals, setLoadingProfessionals] = useState<boolean>(false);
  const [loadingYears, setLoadingYears] = useState<boolean>(false);
  const [professionalError, setProfessionalError] = useState<boolean>(false);
  const [professionals, setProfessionals] = useState<IProfessional[]>([]);
  const [yearError, setYearError] = useState<boolean>(false);
  const [years, setYears] = useState<string[]>([]);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const clearButtonRef = useRef(null);
  const clearLabelRef = useRef(null);
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
          addNotification({ type: 'error', message: APP_CONFIG.error.server });
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
          addNotification({ type: 'error', message: APP_CONFIG.error.server });
        }
      })
      .finally(() => setLoadingYears(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    console.log('check professional years on db');
  }, [professional]);

  function clearButtonOverAnimation(): void {
    if (clearButtonRef.current && clearLabelRef.current) {
      animate(clearButtonRef.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
      animate(clearLabelRef.current, { opacity: 1 }, { duration: 0.2, ease: 'easeIn' });
    }
  }

  function clearButtonOutAnimation(): void {
    if (clearButtonRef.current && clearLabelRef.current) {
      animate(clearButtonRef.current, { scale: 1 }, { duration: 0.1 });
      animate(clearLabelRef.current, { opacity: 0 }, { duration: 0.1 });
    }
  }

  return (
    <main className='flex w-full items-center justify-between rounded-md border border-slate-300 bg-slate-200 px-4 py-2 shadow-sm'>
      <section className='flex items-center justify-start space-x-4'>
        <section className='flex items-center space-x-2'>
          <Filter size={16} strokeWidth={2} />
          <h1 className='text-sm font-medium'>{USER_VIEW_CONFIG.apposRecord.filters.title}</h1>
        </section>
        <Select
          disabled={professionalError}
          value={professional ? professional : ''}
          onValueChange={(e) => setFilters({ professional: e as IApposFilters['professional'] })}
        >
          <SelectTrigger className={'text-xsm h-7 w-fit space-x-3 border border-slate-300 bg-white shadow-sm'}>
            {loadingProfessionals ? (
              <LoadingDB
                variant='default'
                text={USER_VIEW_CONFIG.apposRecord.select.professional.loadingText}
                className='text-xsm h-7 px-0 font-normal'
              />
            ) : professionalError ? (
              <span className='text-red-500'>{USER_VIEW_CONFIG.apposRecord.select.professional.errorText}</span>
            ) : (
              <SelectValue placeholder={USER_VIEW_CONFIG.apposRecord.select.professional.placeholder} />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {professionals.map((professional) => (
                <SelectItem key={crypto.randomUUID()} value={professional._id}>
                  {capitalize(professional.title.abbreviation)} {capitalize(professional.lastName)}, {capitalize(professional.firstName)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select disabled={yearError} value={year ? year : ''} onValueChange={(e) => setFilters({ year: e as IApposFilters['year'] })}>
          <SelectTrigger className={'text-xsm h-7 w-fit space-x-3 border border-slate-300 bg-white shadow-sm'}>
            {loadingYears ? (
              <LoadingDB variant='default' text={USER_VIEW_CONFIG.apposRecord.select.year.loadingText} className='text-xsm h-7 px-0 font-normal' />
            ) : yearError ? (
              <span>{USER_VIEW_CONFIG.apposRecord.select.year.errorText}</span>
            ) : (
              <SelectValue placeholder={USER_VIEW_CONFIG.apposRecord.select.year.placeholder} />
            )}
          </SelectTrigger>
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
          <span ref={clearLabelRef} className='text-xs text-slate-500 opacity-0'>
            {USER_VIEW_CONFIG.apposRecord.button.clear}
          </span>
          <Button
            ref={clearButtonRef}
            variant='clear'
            size='icon5'
            onClick={() => clearFilters({ professional, year })}
            onMouseOver={clearButtonOverAnimation}
            onMouseOut={clearButtonOutAnimation}
          >
            <X size={14} strokeWidth={2} />
          </Button>
        </section>
      )}
    </main>
  );
}