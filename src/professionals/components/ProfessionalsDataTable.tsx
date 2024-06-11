// Icons: https://lucide.dev/icons/
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components/ui/table';
// Tanstack Data Table: https://tanstack.com/table/latest
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table';
// App
import { PROF_CONFIG } from '../config/professionals.config';
import { ProfessionalApiService } from '../services/professional-api.service';
import { useEffect, useState } from 'react';
import { useNotificationsStore } from '@/core/stores/notifications.store';
// Interface
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  search: string;
}
// Configuration (put in config file)
const DataTableConfig = {
  itemsPerPage: [3, 5, 10, 20],
  pagination: {
    page: 'Página',
    of: 'de',
  },
  rowsPerPage: 'Filas por página',
};
// React component
export function ProfessionalsDataTable<TData, TValue>({ columns, search }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [data2, setData2] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: itemsPerPage });

  const [key, setKey] = useState(0);

  const table = useReactTable({
    columns,
    data: data2,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: totalItems,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  useEffect(() => {
    const skipItems: number = pagination.pageIndex * pagination.pageSize;

    ProfessionalApiService.findAll(search, skipItems, itemsPerPage).then((response) => {
      console.log('pagination load data');
      // if (!response.statusCode) {
      setData2(response.data);
      setTotalItems(response.count);
      // }
      if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
      if (response instanceof Error) addNotification({ type: 'error', message: 'Internal Server Error' });
    });
    setKey(Math.random());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  useEffect(() => {
    const skipItems: number = 0;
    setPagination({ pageIndex: 0, pageSize: itemsPerPage });

    ProfessionalApiService.findAll(search, skipItems, itemsPerPage).then((response) => {
      console.log('search load data');
      if (!response.statusCode) {
        setData2(response.data);
        setTotalItems(response.count);
      }
      if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
      if (response instanceof Error) addNotification({ type: 'error', message: 'Internal Server Error' });
    });
    setKey(Math.random());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, itemsPerPage]);

  // function handlePageSizeChange(value: string) {
  //   console.log(Number(value));
  //   setPagination({ pageIndex: 0, pageSize: Number(value) });
  //   setItemsPerPage(parseInt(value));
  // }

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
        <TableBody key={key}>
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
          <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(e) => setItemsPerPage(parseInt(e))}>
            <SelectTrigger className='h-8 w-[65px] text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-0'>
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
          {DataTableConfig.pagination.page} {pagination.pageIndex + 1} {DataTableConfig.pagination.of} {table.getPageCount()}
        </div>
        {itemsPerPage > 1 && (
          <div className='flex items-center space-x-2'>
            <Button variant='ghost' className=' h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <span className='sr-only'>Go to first page</span>
              <ArrowLeftIcon className='h-4 w-4' />
            </Button>
            <Button variant='ghost' className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <span className='sr-only'>Go to previous page</span>
              <ChevronLeftIcon className='h-4 w-4' />
            </Button>
            <Button variant='ghost' className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <span className='sr-only'>Go to next page</span>
              <ChevronRightIcon className='h-4 w-4' />
            </Button>
            <Button variant='ghost' className=' h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <span className='sr-only'>Go to last page</span>
              <ArrowRightIcon className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
