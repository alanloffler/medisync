// External components: https://ui.shadcn.com/docs/components
import { Skeleton } from '@core/components/ui/skeleton';
// React component
export function SkeletonDonutStat() {
  return (
    <main className='flex flex-col gap-2'>
      <Skeleton className='h-[20px] w-[173px]' />
      <section className='flex flex-row items-center gap-3'>
        <Skeleton className='h-[50px] w-[50px] rounded-full' />
        <div className='flex flex-col gap-1'>
          <Skeleton className='h-[28px] w-[111px]' />
          <Skeleton className='h-[20px] w-[111px]' />
        </div>
      </section>
    </main>
  );
}
