// Components: https://ui.shadcn.com/docs/components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components/ui/table';
// Tanstack Data Table: https://tanstack.com/table/latest
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table';
import { PROF_CONFIG } from '../config/professionals.config';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
// Interface
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loadData: (skip: number, take: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const DataTableConfig = {
  itemsPerPage: [5, 10, 20],
  pagination: {
    page: 'Página',
    of: 'de',
  },
  rowsPerPage: 'Filas por página',
};
// React component
export function ProfessionalsDataTable<TData, TValue>({ columns, data, loadData, itemsPerPage, totalItems }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: itemsPerPage,
      })

  // useEffect(() => {
  //   console.log('pagination',pagination);
  //   setPagination(pagination)
  //   loadData(pagination.pageIndex * pagination.pageSize, pagination.pageSize);
  // }, [pagination]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination
    },
    // initialState: {
      // pagination
      // pagination: {
      //   pageIndex: 0, 
      //   pageSize: itemsPerPage,
      // },
    // },
    manualPagination: true,
    rowCount: totalItems,
    // autoResetPageIndex: true,
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className='px-0 py-1' key={cell.id} style={{ width: `${cell.column.getSize()}px` }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                {PROF_CONFIG.table.noResults}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='flex items-center justify-between space-x-6 pt-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-xs font-normal text-slate-400'>{DataTableConfig.rowsPerPage}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 w-[65px] text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-0'>
              {/* <SelectValue placeholder={table.getState().pagination.pageSize} /> */}
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent side='top' className='min-w-[4rem]'>
              {DataTableConfig.itemsPerPage.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className='text-xs'>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-xs font-normal text-slate-400'>
          Pagination {pagination.pageIndex}
          {DataTableConfig.pagination.page} {pagination.pageIndex + 1} {DataTableConfig.pagination.of} {table.getPageCount()}
          {/* {DataTableConfig.pagination.page} {table.getState().pagination.pageIndex + 1} {DataTableConfig.pagination.of} {totalItems} */}
        </div>
        {/* {table.getPageCount() > 1 && ( */}
        {itemsPerPage > 1 && (
          <div className='flex items-center space-x-2'>
            <Button variant='outline' className='hidden h-8 w-8 bg-slate-100 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <span className='sr-only'>Go to first page</span>
              <ArrowLeftIcon className='h-4 w-4' />
            </Button>
            <Button variant='outline' className='h-8 w-8 bg-slate-100 p-0 hover:bg-slate-200 dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <span className='sr-only'>Go to previous page</span>
              <ChevronLeftIcon className='h-4 w-4' />
            </Button>
            <Button variant='outline' className='h-8 w-8 bg-slate-100 p-0 hover:bg-slate-200 dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <span className='sr-only'>Go to next page</span>
              <ChevronRightIcon className='h-4 w-4' />
            </Button>
            <Button variant='outline' className='hidden h-8 w-8 bg-slate-100 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <span className='sr-only'>Go to last page</span>
              <ArrowRightIcon className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
