// Icons: https://lucide.dev/icons/
import {ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
import { USER_CONFIG } from '@config/users/users.config';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

export function Pagination({ table, help, setPagination, pagination }: { pagination: any, table: any, help?: boolean, setPagination: any }) {
  const {t} = useTranslation();
return <section className='flex items-center justify-between space-x-6 pt-6 lg:space-x-8'>
<div className='flex items-center space-x-2'>
  <p className='text-xs font-normal text-slate-400'>{t('pagination.rowsPerPage')}</p>
  <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(e) => setPagination({ pageIndex: 0, pageSize: parseInt(e) })}>
    <TooltipWrapper tooltip={t('tooltip.pagination.itemsPerPage')} help={help}>
      <SelectTrigger className='h-8 w-[65px] bg-input text-xs font-medium hover:bg-input-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-0'>
        <SelectValue placeholder={table.getState().pagination.pageSize} />
      </SelectTrigger>
    </TooltipWrapper>
    <SelectContent side='top' className='min-w-[4rem]' onCloseAutoFocus={(e) => e.preventDefault()}>
      {USER_CONFIG.table.itemsPerPage.map((pageSize) => (
        <SelectItem key={pageSize} value={`${pageSize}`} className='text-xs'>
          {pageSize}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
<div className='flex w-[100px] items-center justify-center text-xs font-normal text-slate-400'>
  {t('pagination.page')} {pagination.pageIndex + 1} {t('pagination.of')} {table.getPageCount()}
</div>
{table.getPageCount() > 1 && (
  <section className='flex items-center space-x-2'>
    <TooltipWrapper tooltip={t('tooltip.pagination.firstPage')} help={help}>
      <Button
        variant='ghost'
        className='h-8 w-8 bg-input p-0 hover:bg-input-hover lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800'
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <ArrowLeftIcon size={16} strokeWidth={2} />
      </Button>
    </TooltipWrapper>
    <TooltipWrapper tooltip={t('tooltip.pagination.previousPage')} help={help}>
      <Button
        variant='ghost'
        className='h-8 w-8 bg-input p-0 hover:bg-input-hover dark:bg-neutral-950 dark:hover:bg-neutral-800'
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeftIcon size={16} strokeWidth={2} />
      </Button>
    </TooltipWrapper>
    <TooltipWrapper tooltip={t('tooltip.pagination.nextPage')} help={help}>
      <Button
        variant='ghost'
        className='h-8 w-8 bg-input p-0 hover:bg-input-hover dark:bg-neutral-950 dark:hover:bg-neutral-800'
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRightIcon size={16} strokeWidth={2} />
      </Button>
    </TooltipWrapper>
    <TooltipWrapper tooltip={t('tooltip.pagination.lastPage')} help={help}>
      <Button
        variant='ghost'
        className='h-8 w-8 bg-input p-0 hover:bg-input-hover lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800'
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <ArrowRightIcon size={16} strokeWidth={2} />
      </Button>
    </TooltipWrapper>
  </section>
)}
</section>
}