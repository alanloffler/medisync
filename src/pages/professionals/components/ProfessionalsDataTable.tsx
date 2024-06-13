// Icons: https://lucide.dev/icons/
import { ArrowDownUp, ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, FilePen, FileText, Trash2 } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components/ui/table';
// Tanstack Data Table: https://tanstack.com/table/latest
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table';
// App
import { IProfessional } from '../interfaces/professional.interface';
import { PROF_CONFIG } from '../config/professionals.config';
import { ProfessionalApiService } from '../services/professional-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationsStore } from '@/core/stores/notifications.store';
import { useTruncateText } from '@/core/hooks/useTruncateText';
// Table interfaces
interface DataTableProps {
  search: string;
  reload: number;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

interface TableManager {
  sorting: SortingState;
  pagination: PaginationState;
}
// Default values for pagination and sorting
const defaultSorting = [{ id: PROF_CONFIG.table.defaultSortingId, desc: PROF_CONFIG.table.defaultSortingType }];
const defaultPagination = { pageIndex: 0, pageSize: PROF_CONFIG.table.defaultPageSize };
// React component
export function ProfessionalsDataTable({ search, reload, setErrorMessage }: DataTableProps) {
  const [columns, setColumns] = useState<ColumnDef<IProfessional>[]>([]);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [tableManager, setTableManager] = useState<TableManager>({ sorting, pagination });
  const [totalItems, setTotalItems] = useState<number>(0);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const firstUpdate = useRef(true);
  const navigate = useNavigate();
  const truncate = useTruncateText();
  // #region Table columns
  const tableColumns: ColumnDef<IProfessional>[] = [
    {
      accessorKey: 'index',
      size: 50,
      header: () => <div className='text-center'>#</div>,
      cell: ({ row }) => <div className='text-center text-sm'>{truncate(row.original._id, -4)}</div>,
    },
    {
      accessorKey: 'lastName',
      header: ({ column }) => (
        <div className='text-left'>
          <button className='flex items-center gap-2 hover:text-accent-foreground' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {PROF_CONFIG.table.headers[0]}
            <ArrowDownUp className='h-3 w-3' />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left font-medium'>{`${capitalize(row.original.titleAbbreviation)} ${capitalize(row.original.lastName)}, ${capitalize(row.original.firstName)}`}</div>,
    },
    {
      accessorKey: 'area',
      size: 80,
      header: ({ column }) => (
        <div className='text-left'>
          <button className='flex items-center gap-2 hover:text-accent-foreground' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {PROF_CONFIG.table.headers[1]}
            <ArrowDownUp className='h-3 w-3' />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left'>{capitalize(row.original.area.name)}</div>,
    },
    {
      accessorKey: 'specialization',
      size: 80,
      header: ({ column }) => (
        <div className='text-center'>
          <button className='flex items-center gap-2 hover:text-accent-foreground' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {PROF_CONFIG.table.headers[2]}
            <ArrowDownUp className='h-3 w-3' />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left text-sm'>{capitalize(row.original.specialization.name)}</div>,
    },
    {
      accessorKey: 'available',
      size: 50,
      header: ({ column }) => (
        <div className='text-center'>
          <button className='flex items-center gap-2 hover:text-accent-foreground' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {PROF_CONFIG.table.headers[3]}
            <ArrowDownUp className='h-3 w-3' />
          </button>
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex flex-row items-center justify-start space-x-2 text-xs'>
          <div className={`flex ${row.original.available ? 'h-2 w-2 rounded-full bg-green-400' : 'h-2 w-2 rounded-full bg-red-400'}`}></div>
          <div className={`flex ${row.original.available ? 'text-slate-800' : 'text-slate-400'}`}>{row.original.available ? 'Activo' : 'Inactivo'}</div>
        </div>
      ),
    },
    {
      accessorKey: 'actions',
      size: 100,
      header: () => <div className='text-center'>{PROF_CONFIG.table.headers[4]}</div>,
      cell: ({ row }) => (
        <div className='flex flex-row items-center justify-center space-x-4'>
          <Button variant={'ghost'} size={'miniIcon'} onClick={() => navigate(`/professionals/update/${row.original._id}`)}>
            <FileText className='h-4 w-4' />
          </Button>
          <Button variant={'ghost'} size={'miniIcon'}>
            <FilePen className='h-4 w-4' />
          </Button>
          <Button variant={'ghost'} size={'miniIcon'}>
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ];
  // #endregion
  // #region Table constructor
  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: totalItems,
    state: {
      sorting,
      pagination,
    },
  });
  // #endregion
  // #region Load data, pagination and sorting
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    setTableManager({
      sorting: sorting,
      pagination: pagination,
    });
  }, [sorting, pagination]);

  useEffect(() => {
    setSorting(defaultSorting);
    setPagination(defaultPagination);
  }, [reload]);

  useEffect(() => {
    const fetchData = (search: string, sorting: SortingState, skipItems: number, itemsPerPage: number) => {
      ProfessionalApiService.findAll(search, sorting, skipItems, itemsPerPage).then((response) => {
        if (!response.statusCode) {
          setData(response.data);
          setColumns(tableColumns);
          setTotalItems(response.count);
          setErrorMessage('');
        }
        if (response.statusCode > 399) {
          setErrorMessage(response.message);
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) addNotification({ type: 'error', message: 'Internal Server Error' });
      });
    };
    fetchData(search, tableManager.sorting, tableManager.pagination.pageIndex * tableManager.pagination.pageSize, tableManager.pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tableManager]);
  // #endregion
  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
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
          <p className='text-xs font-normal text-slate-400'>{PROF_CONFIG.table.rowsPerPage}</p>
          <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(e) => setPagination({ pageIndex: 0, pageSize: parseInt(e) })}>
            <SelectTrigger className='h-8 w-[65px] text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-0'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top' className='min-w-[4rem]'>
              {PROF_CONFIG.table.itemsPerPage.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className='text-xs'>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-xs font-normal text-slate-400'>
          {PROF_CONFIG.table.pagination.page} {pagination.pageIndex + 1} {PROF_CONFIG.table.pagination.of} {table.getPageCount()}
        </div>
        {table.getPageCount() > 1 && (
          <div className='flex items-center space-x-2'>
            <Button variant='ghost' className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
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
            <Button variant='ghost' className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <span className='sr-only'>Go to last page</span>
              <ArrowRightIcon className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
