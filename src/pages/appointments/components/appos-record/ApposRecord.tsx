// Icons: https://lucide.dev/icons/
import { CalendarClock } from 'lucide-react';
// External components
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { ApposFilters } from '@appointments/components/appos-record/ApposFilters';
import { ApposTable } from '@appointments/components/appos-record/ApposTable';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import type { PaginationState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { USER_VIEW_CONFIG as UV_CONFIG } from '@config/users/user-view.config';
import { useApposFilters } from '@appointments/hooks/useApposFilters';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Constants
const defaultPagination: PaginationState = { pageIndex: 0, pageSize: UV_CONFIG.table.appointments.defaultItemsPerPage };
// React component
export function ApposRecord({ userId }: { userId: string }) {
  const [disabledFilters, setDisabledFilters] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [refresh, setRefresh] = useState<string>('');
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { professional, year } = useApposFilters();
  const { t } = useTranslation();

  const {
    data: appointments,
    error: errorAppos,
    isError: isErrorAppos,
    isLoading: isLoadingAppos,
    isSuccess: isSuccessAppos,
  } = useQuery<IResponse<IAppointmentView[]>, Error>({
    queryKey: ['appointments', userId, professional, year, pagination.pageIndex, pagination.pageSize, refresh],
    queryFn: async () => await AppointmentApiService.findApposRecordWithFilters(userId, pagination.pageSize, pagination.pageIndex, professional, year),
    retry: 1,
  });

  useEffect(() => {
    setDisabledFilters(isErrorAppos);
    isErrorAppos && addNotification({ type: 'error', message: errorAppos.message });
  }, [addNotification, errorAppos?.message, isErrorAppos]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [professional]);

  return (
    <main>
      <Card className='flex w-full flex-col gap-3'>
        <section className='flex flex-row items-center space-x-4 border-b border-slate-200 p-4'>
          <CalendarClock size={18} strokeWidth={2} />
          <span className='text-base font-semibold'>{t('cardTitle.appointmentsRecord')}</span>
        </section>
        <CardContent className='flex flex-col gap-3'>
          <ApposFilters userId={userId} disabled={disabledFilters} />
          {isLoadingAppos && <LoadingDB variant='default' text={t('loading.appointments')} className='mt-4' />}
          {isErrorAppos && <InfoCard type={'error'} text={errorAppos.message} className='pt-4' />}
          {isSuccessAppos && appointments.data.length > 0 ? (
            <>
              <ApposTable
                appointments={appointments.data}
                pagination={pagination}
                setPagination={setPagination}
                setRefresh={setRefresh}
                totalItems={appointments.pagination?.totalItems ?? 0}
              />
              {appointments.pagination?.totalItems}
            </>
          ) : (
            !isLoadingAppos && !isErrorAppos && <InfoCard type='warning' text={appointments?.message} className='mt-4' />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
