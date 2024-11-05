// External components: https://ui.shadcn.com/docs/components
import { Avatar, AvatarFallback, AvatarImage } from '@core/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@core/components/ui/card';
// Components
import { CategoriesShortcuts } from '@dashboard/components/shortcuts/CategoriesShortcuts';
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
        <Card className='col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-3'>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-8'>
            <div className='flex items-center gap-4'>
              <Avatar className='hidden h-9 w-9 sm:flex'>
                <AvatarImage src='/avatars/01.png' alt='Avatar' />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>Olivia Martin</p>
                <p className='text-sm text-muted-foreground'>olivia.martin@email.com</p>
              </div>
              <div className='ml-auto font-medium'>+$1,999.00</div>
            </div>
            <div className='flex items-center gap-4'>
              <Avatar className='hidden h-9 w-9 sm:flex'>
                <AvatarImage src='/avatars/02.png' alt='Avatar' />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>Jackson Lee</p>
                <p className='text-sm text-muted-foreground'>jackson.lee@email.com</p>
              </div>
              <div className='ml-auto font-medium'>+$39.00</div>
            </div>
            <div className='flex items-center gap-4'>
              <Avatar className='hidden h-9 w-9 sm:flex'>
                <AvatarImage src='/avatars/03.png' alt='Avatar' />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>Isabella Nguyen</p>
                <p className='text-sm text-muted-foreground'>isabella.nguyen@email.com</p>
              </div>
              <div className='ml-auto font-medium'>+$299.00</div>
            </div>
            <div className='flex items-center gap-4'>
              <Avatar className='hidden h-9 w-9 sm:flex'>
                <AvatarImage src='/avatars/04.png' alt='Avatar' />
                <AvatarFallback>WK</AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>William Kim</p>
                <p className='text-sm text-muted-foreground'>will@email.com</p>
              </div>
              <div className='ml-auto font-medium'>+$99.00</div>
            </div>
            <div className='flex items-center gap-4'>
              <Avatar className='hidden h-9 w-9 sm:flex'>
                <AvatarImage src='/avatars/05.png' alt='Avatar' />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <p className='text-sm font-medium leading-none'>Sofia Davis</p>
                <p className='text-sm text-muted-foreground'>sofia.davis@email.com</p>
              </div>
              <div className='ml-auto font-medium'>+$39.00</div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
