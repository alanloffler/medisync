// Icons: https://lucide.dev/icons/
import { Database } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { AppoItemMini } from '@appointments/components/AppoItemMini';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { TQPagination } from '@core/components/common/TQPagination';
// External imports
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
// Imports
import type { IAppointment } from './interfaces/appointment.interface';
import { APPO_CONFIG } from '@config/appointment.config';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { queryClient } from '@lib/react-query';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
// React component
export default function Appointments() {
  const _limit: number =
    APPO_CONFIG.appointmentComponent.pagination.defaultItemsPerPage && APPO_CONFIG.appointmentComponent.pagination.defaultItemsPerPage > 0
      ? APPO_CONFIG.appointmentComponent.pagination.defaultItemsPerPage
      : 10;
  const [limit, setLimit] = useState<number>(_limit);
  const [page, setPage] = useState<number>(0);
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);

  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[1].id);
  }, [setItemSelected]);

  const {
    data: appointments,
    error,
    isError,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['appointments', 'listAll', page, limit],
    queryFn: () => AppointmentApiService.findAll(page, limit),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: 'always',
    retry: 1,
  });

  useEffect(() => {
    if (!isPlaceholderData && appointments?.pagination?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ['appointments', 'listAll', page + 1, limit],
        queryFn: () => AppointmentApiService.findAll(page + 1, limit),
      });
    }
  }, [appointments, isPlaceholderData, limit, page]);

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={APPO_CONFIG.title.page} breadcrumb={APPO_CONFIG.breadcrumb} />
      </header>
      {/* Section: Page content */}
      <section className='grid gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4'>
        {/* Section: Left side content */}
        <Card className='col-span-1 border-none bg-slate-200 bg-transparent shadow-none md:col-span-4 lg:col-span-1 xl:col-span-1'>
          <CardContent className='p-0'>This is the left side content</CardContent>
        </Card>
        {/* Section: Right side content */}
        <Card className='col-span-1 h-fit space-y-4 overflow-y-auto p-0 md:col-span-4 lg:col-span-3 xl:col-span-3'>
          <div className='relative flex items-center justify-center rounded-t-lg bg-slate-200 p-3 text-slate-700'>
            <h1 className='text-center text-xl font-bold'>{APPO_CONFIG.title.list}</h1>
          </div>
          <CardContent className='space-y-2 pt-0'>
            {isLoading && <LoadingDB variant='default' text={APPO_CONFIG.loading.appointments} />}
            {isError && <InfoCard text={error.message} type='error' />}
            {!isError && !isLoading && appointments && (
              <>
                <section className='flex items-center justify-end space-x-1 px-1'>
                  <Database size={16} strokeWidth={2} className='text-blue-400' />
                  <span className='text-xsm text-slate-400'>{`${appointments?.pagination?.totalItems} ${APPO_CONFIG.table.totalItems}`}</span>
                </section>
                <section className='flex flex-col'>
                  {appointments?.data.map((appointment: IAppointment) => <AppoItemMini key={appointment._id} data={appointment} />)}
                </section>
                <TQPagination
                  className='pt-2 !text-xsm text-slate-400'
                  isPlaceholderData={isPlaceholderData}
                  limit={limit}
                  page={page}
                  pagination={appointments?.pagination}
                  setLimit={setLimit}
                  setPage={setPage}
                  texts={APPO_CONFIG.pagination}
                />
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
