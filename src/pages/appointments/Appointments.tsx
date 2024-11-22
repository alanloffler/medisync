// External components: https://ui.shadcn.com/docs/components
import { Card, CardContent } from '@core/components/ui/card';
// Components
import { PageHeader } from '@core/components/common/PageHeader';
// External imports
import { useEffect } from 'react';
// Imports
import { APPO_CONFIG } from '@config/appointment.config';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
// React component
export default function Appointments() {
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);

  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[1].id);
  }, [setItemSelected]);

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
        <Card className='col-span-1 h-fit overflow-y-auto md:col-span-4 lg:col-span-3 xl:col-span-3'>This is the right side content</Card>
      </section>
    </main>
  );
}
