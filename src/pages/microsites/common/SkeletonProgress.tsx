// External components: https://ui.shadcn.com/docs/components
import { Skeleton } from '@core/components/ui/skeleton';
// React component
export function SkeletonProgress() {
  return (
    <main className='flex flex-col gap-2'>
      <Skeleton className='h-[20px] w-[140px]' />
      <Skeleton className='h-4 w-full lg:w-1/2' />
    </main>
  );
}
