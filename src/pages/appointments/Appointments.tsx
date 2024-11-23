// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { AppoItemMini } from '@appointments/components/AppoItemMini';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
// External imports
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
// Imports
import type { IAppointment } from './interfaces/appointment.interface';
import { APPO_CONFIG } from '@config/appointment.config';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { PaginationTQ } from '@core/components/common/PaginationTQ';
import { queryClient } from '@lib/react-query';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
// React component
export default function Appointments() {
  const [page, setPage] = useState<number>(0);
  const limit: number = 10;
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
  }, [appointments, isPlaceholderData, page]);

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
          <CardContent className='pt-2'>
            {isLoading && <LoadingDB variant='default' text={APPO_CONFIG.loading.appointments} />}
            {isError && <InfoCard text={error.message} type='error' />}
            {!isError && !isLoading && appointments && (
              <>
                <section className='[&_button]:hover:opacity-50 [&_button]:hover:blur-[2px]'>
                  {appointments?.data.map((appointment: IAppointment) => <AppoItemMini key={appointment._id} data={appointment} />)}
                </section>
                <PaginationTQ
                  pagination={appointments?.pagination}
                  limit={limit}
                  page={page}
                  setPage={setPage}
                  isPlaceholderData={isPlaceholderData}
                  className='mt-4 !text-xsm text-slate-400'
                />
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
