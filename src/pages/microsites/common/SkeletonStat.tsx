// External components: https://ui.shadcn.com/docs/components
import { Skeleton } from '@core/components/ui/skeleton';
// React component
export function SkeletonStat() {
  return (
    <main className='flex flex-col gap-2'>
      <Skeleton className='h-[16px] w-[111px]' />
      <section className='flex flex-col gap-1'>
        <Skeleton className='h-[28px] w-[111px]' />
        <Skeleton className='h-[20px] w-[111px]' />
      </section>
    </main>
  );
}
