// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { PageHeader } from '@core/components/common/PageHeader';
// External imports
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IAppointment } from './interfaces/appointment.interface';
import { APPO_CONFIG } from '@config/appointment.config';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
// React component
export default function Appointments() {
  const [page, setPage] = useState<number>(0);
  const limit: number = 10;
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);

  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[1].id);
  }, [setItemSelected]);

  const { data: appointments, status } = useQuery({
    queryKey: ['appointments', 'listAll', page, limit],
    queryFn: () => AppointmentApiService.findAll(page, limit),
    refetchOnWindowFocus: 'always',
    retry: 1,
  });

  const totalPages = appointments?.pagination && Math.ceil(appointments?.pagination?.totalPages / limit);

  if (status === 'error') return <>Error</>;
  if (status === 'pending') return <>Loading</>;

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={APPO_CONFIG.title} breadcrumb={APPO_CONFIG.breadcrumb} />
      </header>
      {/* Section: Page content */}
      <section className='grid gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4'>
        {/* Section: Left side content */}
        <Card className='col-span-1 border-none bg-slate-200 bg-transparent shadow-none md:col-span-4 lg:col-span-1 xl:col-span-1'>
          <CardContent className='p-0'>This is the left side content</CardContent>
        </Card>
        {/* Section: Right side content */}
        <Card className='col-span-1 h-fit space-y-4 overflow-y-auto p-4 md:col-span-4 lg:col-span-3 xl:col-span-3'>
          <h1>This is the right side content</h1>
          <section>
            {appointments.data.map((appointment: IAppointment) => (
              <div key={appointment._id}>
                <span>{`${appointment.day} / ${appointment.hour}`}</span>
              </div>
            ))}
          </section>
          <section className='flex justify-between'>
            <div>
              Página {page + 1}/{totalPages}
            </div>
            <div className='flex space-x-4'>
              <button className='bg-input px-2 py-1 disabled:opacity-50' onClick={() => setPage(0)} disabled={page === 0}>
                Primer página
              </button>
              <button className='bg-input px-2 py-1 disabled:opacity-50' onClick={() => setPage((old) => Math.max(old - 1, 0))} disabled={page === 0}>
                Menos
              </button>
              <button
                className='bg-input px-2 py-1 disabled:opacity-50'
                onClick={() => setPage((old) => Math.max(old + 1, 0))}
                disabled={!appointments.pagination?.hasMore}
              >
                Más
              </button>
              <button
                className='bg-input px-2 py-1 disabled:opacity-50'
                onClick={() => totalPages && setPage(Math.ceil(totalPages - 1))}
                disabled={!appointments.pagination?.hasMore}
              >
                Última página
              </button>
            </div>
          </section>
        </Card>
      </section>
    </main>
  );
}
