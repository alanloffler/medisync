// Icons: https://lucide.dev/icons/
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
// External imports
import { Dispatch, SetStateAction } from 'react';
// React component
export function PaginationTQ({
  pagination,
  limit,
  page,
  setPage,
  isPlaceholderData,
}: {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pagination: { totalPages: number; hasMore: boolean } | undefined;
  limit: number;
  isPlaceholderData: boolean;
}) {
  const totalPages: number | undefined = pagination && Math.ceil(pagination.totalPages / limit);

  return (
    <section className='flex items-center justify-between'>
      <section>Here select</section>
      <section className='text-xsm font-normal text-slate-400'>
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
