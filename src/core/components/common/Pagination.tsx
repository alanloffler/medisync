// Icons: https://lucide.dev/icons/
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '../ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
// Components
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { useTranslation } from 'react-i18next';
// Imports
import type { IPagination } from '@core/components/common/interfaces/pagination.interface';
import { USER_CONFIG } from '@config/users/users.config';
import { cn } from '@lib/utils';
// React component
export function Pagination({ className, help, pagination, setPagination, table }: IPagination) {
  const { t } = useTranslation();

  return (
    <section className={cn('flex items-center justify-between text-sm text-foreground', className)}>
      <section className='flex w-fit flex-row items-center space-x-4'>
        <p className='w-fit'>{t('pagination.rowsPerPage')}</p>
        <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(e) => setPagination({ pageIndex: 0, pageSize: parseInt(e) })}>
          <TooltipWrapper tooltip={t('tooltip.pagination.itemsPerPage')} help={help}>
            <SelectTrigger className='h-8 w-16 bg-input text-xs text-slate-700 hover:bg-input-hover [&_svg]:opacity-100'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
          </TooltipWrapper>
          <SelectContent className='w-[65px] min-w-px' onCloseAutoFocus={(e) => e.preventDefault()}>
            <SelectGroup className='[&_svg]:h-4 [&_svg]:w-4'>
              {USER_CONFIG.table.itemsPerPage.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className='justify-between text-xs'>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
      <section>
        {t('pagination.page')} {pagination.pageIndex + 1} {t('pagination.of')} {table.getPageCount()}
      </section>
      {table.getPageCount() > 1 && (
        <section className='flex items-center space-x-4'>
          <TooltipWrapper tooltip={t('tooltip.pagination.firstPage')} help={help}>
            <Button
              variant='ghost'
              className='h-8 w-8 bg-input p-0 text-slate-700 hover:bg-input-hover'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeft size={16} strokeWidth={2} />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper tooltip={t('tooltip.pagination.previousPage')} help={help}>
            <Button
              variant='ghost'
              className='h-8 w-8 bg-input p-0 text-slate-700 hover:bg-input-hover'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper tooltip={t('tooltip.pagination.nextPage')} help={help}>
            <Button
              variant='ghost'
              className='h-8 w-8 bg-input p-0 text-slate-700 hover:bg-input-hover'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size={16} strokeWidth={2} />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper tooltip={t('tooltip.pagination.lastPage')} help={help}>
            <Button
              variant='ghost'
              className='h-8 w-8 bg-input p-0 text-slate-700 hover:bg-input-hover'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ArrowRight size={16} strokeWidth={2} />
            </Button>
          </TooltipWrapper>
        </section>
      )}
    </section>
  );
}
