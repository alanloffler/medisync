// External components: https://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// Components
import { CategoriesShortcuts } from '@dashboard/components/shortcuts/CategoriesShortcuts';
import { LatestAppos } from '@dashboard/components/latest/LatestAppos';
import { PageHeader } from '@core/components/common/PageHeader';
import { StatisticGroup } from '@dashboard/components/StatisticGroup';
// Imports
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
// React component
export default function Dashboard() {
  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
      <PageHeader title='Dashboard' breadcrumb={DASHBOARD_CONFIG.breadcrumb} />
      {/* Section: Statistic Group */}
      <StatisticGroup />
      {/* Section: Container */}
      <section className='grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 lg:grid-cols-5 lg:gap-8 xl:grid-cols-5 xl:gap-8'>
        <section className='col-span-1 h-fit space-y-4 md:col-span-2 md:space-y-8 lg:col-span-2 lg:space-y-8 xl:col-span-2 xl:space-y-8'>
          <CategoriesShortcuts />
          <Card>Here something else</Card>
        </section>
        <section className='col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-3'>
          <LatestAppos />
        </section>
      </section>
    </main>
  );
}
