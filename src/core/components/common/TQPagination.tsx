// Icons: https://lucide.dev/icons/
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// External imports
import { Dispatch, SetStateAction } from 'react';
import { cn } from '@lib/utils';
// Interface
interface ITQPagination {
  className?: string;
  isPlaceholderData: boolean;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  page: number;
  pagination: ITQPaginationPagination | undefined;
  setPage: Dispatch<SetStateAction<number>>;
  texts: ITQPaginationTexts;
}

interface ITQPaginationPagination {
  hasMore: boolean;
  totalItems: number;
}

interface ITQPaginationTexts {
  of: string;
  page: string;
  rowsPerPage: string;
}
// React component
export function TQPagination({ className, isPlaceholderData, limit, page, pagination, setLimit, setPage, texts }: ITQPagination) {
  const totalPages: number | undefined = pagination && Math.ceil(pagination.totalItems / limit);

  return (
    <section className={cn('flex items-center justify-between text-sm text-foreground', className)}>
      <section className='flex w-fit flex-row items-center space-x-4'>
        <div className='w-fit'>{texts?.rowsPerPage ? texts.rowsPerPage : 'Rows per page'}</div>
        <Select defaultValue={limit.toString()} onValueChange={(e) => setLimit(parseInt(e))}>
          <SelectTrigger className='h-8 w-20'>
            <SelectValue placeholder={`${limit}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
      <section>{`${texts?.page ? texts.page : 'Page'} ${page + 1} ${texts?.of ? texts.of : 'of'} ${totalPages}`}</section>
      <section className='flex space-x-4'>
        <Button className='h-8 w-8 bg-input p-0 text-slate-700 hover:bg-input-hover' variant='ghost' disabled={page === 0} onClick={() => setPage(0)}>
          <ArrowLeft size={16} strokeWidth={2} />
        </Button>
        <Button
          className='hover:bg-input-hover h-8 w-8 bg-input p-0 text-slate-700'
          variant='ghost'
          disabled={page === 0}
          onClick={() => setPage((old: number) => Math.max(old - 1, 0))}
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </Button>
        <Button
          className='h-8 w-8 bg-input p-0 text-slate-700 hover:bg-input-hover'
          variant='ghost'
          disabled={isPlaceholderData || !pagination?.hasMore}
          onClick={() => setPage((old) => Math.max(old + 1, 0))}
        >
          <ChevronRight size={16} strokeWidth={2} />
        </Button>
        <Button
          className='h-8 w-8 bg-input p-0 text-slate-700 hover:bg-input-hover'
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
