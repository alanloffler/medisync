// Icons: https://lucide.dev/icons/
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
// External imports
import { Dispatch, SetStateAction } from 'react';
import { cn } from '@lib/utils';
// React component
export function PaginationTQ({
  className,
  isPlaceholderData,
  limit,
  page,
  pagination,
  setPage,
}: {
  className?: string;
  isPlaceholderData: boolean;
  limit: number;
  page: number;
  pagination: { totalPages: number; hasMore: boolean } | undefined;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  const totalPages: number | undefined = pagination && Math.ceil(pagination.totalPages / limit);

  return (
    <section className={cn('flex items-center justify-between text-sm text-foreground', className)}>
      <section>Here select</section>
      <section>
        Página {page + 1} de {totalPages}
      </section>
      <section className='flex space-x-4'>
        <Button className='h-8 w-8 bg-input p-0 hover:bg-input-hover' variant='ghost' disabled={page === 0} onClick={() => setPage(0)}>
          <ArrowLeft size={16} strokeWidth={2} />
        </Button>
        <Button
          className='h-8 w-8 bg-input p-0 hover:bg-input-hover'
          variant='ghost'
          disabled={page === 0}
          onClick={() => setPage((old: number) => Math.max(old - 1, 0))}
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </Button>
        <Button
          className='h-8 w-8 bg-input p-0 hover:bg-input-hover'
          variant='ghost'
          disabled={isPlaceholderData || !pagination?.hasMore}
          onClick={() => setPage((old) => Math.max(old + 1, 0))}
        >
          <ChevronRight size={16} strokeWidth={2} />
        </Button>
        <Button
          className='h-8 w-8 bg-input p-0 hover:bg-input-hover'
          variant='ghost'
          onClick={() => totalPages && setPage(Math.ceil(totalPages - 1))}
          disabled={isPlaceholderData || !pagination?.hasMore}
        >
          <ArrowRight size={16} strokeWidth={2} />
        </Button>
      </section>
    </section>
  );
}
