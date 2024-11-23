// Icons: https://lucide.dev/icons/
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
// External imports
import { Dispatch, SetStateAction } from 'react';
import { cn } from '@lib/utils';
// Interface
interface ITQPagination {
  className?: string;
  isPlaceholderData: boolean;
  limit: number;
  page: number;
  pagination: ITQPaginationPagination | undefined;
  setPage: Dispatch<SetStateAction<number>>;
  texts: ITQPaginationTexts;
}

interface ITQPaginationPagination {
  hasMore: boolean;
  totalPages: number;
}

interface ITQPaginationTexts {
  of: string;
  page: string;
  rowsPerPage: string;
}
// React component
export function PaginationTQ({ className, isPlaceholderData, limit, page, pagination, setPage, texts }: ITQPagination) {
  const totalPages: number | undefined = pagination && Math.ceil(pagination.totalPages / limit);

  return (
    <section className={cn('flex items-center justify-between text-sm text-foreground', className)}>
      <section>{texts?.rowsPerPage ? texts.rowsPerPage : 'Rows per page'}</section>
      <section>{`${texts?.page ? texts.page : 'Page'} ${page + 1} ${texts?.of ? texts.of : 'of'} ${totalPages}`}</section>
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
