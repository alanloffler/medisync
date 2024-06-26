// Icons: https://lucide.dev/icons/
import { ArrowDownUp, ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, FilePen, FileText, Trash2 } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components/ui/table';
// Tanstack Data Table: https://tanstack.com/table/latest
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table';
// App
import { IUser } from '../interfaces/user.interface';
import { USER_CONFIG } from '@/config/user.config';
import { UserApiService } from '../services/user-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationsStore } from '@/core/stores/notifications.store';
import { useTruncateText } from '@/core/hooks/useTruncateText';
import { useIsNumericString } from '@/core/hooks/useIsNumericString';
import { useDelimiter } from '@/core/hooks/useDelimiter';
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
const defaultSorting = [{ id: USER_CONFIG.table.defaultSortingId, desc: USER_CONFIG.table.defaultSortingType }];
const defaultPagination = { pageIndex: 0, pageSize: USER_CONFIG.table.defaultPageSize };
// React component
export function UsersDataTable({ search, reload, setErrorMessage }: DataTableProps) {
  const [columns, setColumns] = useState<ColumnDef<IUser>[]>([]);
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
  const isNumericString = useIsNumericString();
  const delimiter = useDelimiter();
  // #region Table columns
  const tableColumns: ColumnDef<IUser>[] = [
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
            {USER_CONFIG.table.headers[0]}
            <ArrowDownUp className='h-3 w-3' />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left font-medium'>{`${capitalize(row.original.lastName)}, ${capitalize(row.original.firstName)}`}</div>,
    },
    {
      accessorKey: 'dni',
      size: 80,
      header: ({ column }) => (
        <div className='text-left'>
          <button className='flex items-center gap-2 hover:text-accent-foreground' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {USER_CONFIG.table.headers[1]}
            <ArrowDownUp className='h-3 w-3' />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left'>{delimiter(row.original.dni, '.', 3)}</div>,
    },
    {
      accessorKey: 'phone',
      size: 80,
      header: ({ column }) => (
        <div className='text-center'>
          <button className='flex items-center gap-2 hover:text-accent-foreground' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {USER_CONFIG.table.headers[2]}
            <ArrowDownUp className='h-3 w-3' />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left text-sm'>{delimiter(row.original.phone, '-', 6)}</div>,
    },
    {
      accessorKey: 'actions',
      size: 100,
      header: () => <div className='text-center'>{USER_CONFIG.table.headers[3]}</div>,
      cell: ({ row }) => (
        <div className='flex flex-row items-center justify-center space-x-4'>
          
          <Button variant={'ghost'} size={'miniIcon'}>
            <FileText className='h-4 w-4' />
          </Button>
          <Button variant={'ghost'} size={'miniIcon'} onClick={() => navigate(`/professionals/update/${row.original._id}`)}>
            <FilePen className='h-4 w-4' />
          </Button>
          <Button variant={'ghost'} size={'miniIcon'}>
            <Trash2 className='h-4 w-4' />
          </Button>
          {/* <Button variant={'ghost'} size={'miniIcon'} className='fill-current hover:fill-green-500'> */}
          {/* <a aria-disabled href={`https://web.whatsapp.com/send?phone=54${row.original.phone}`} target='_top'> */}
          <Button disabled variant={'ghost'} size={'miniIcon'} className='fill-current hover:fill-green-500' onClick={() => navigate(`/whatsapp/${row.original._id}`)}>
            <svg width='100' height='100' viewBox='0 0 464 488' className='h-4 w-4'>
              <path d='M462 228q0 93-66 159t-160 66q-56 0-109-28L2 464l40-120q-32-54-32-116q0-93 66-158.5T236 4t160 65.5T462 228zM236 39q-79 0-134.5 55.5T46 228q0 62 36 111l-24 70l74-23q49 31 104 31q79 0 134.5-55.5T426 228T370.5 94.5T236 39zm114 241q-1-1-10-7q-3-1-19-8.5t-19-8.5q-9-3-13 2q-1 3-4.5 7.5t-7.5 9t-5 5.5q-4 6-12 1q-34-17-45-27q-7-7-13.5-15t-12-15t-5.5-8q-3-7 3-11q4-6 8-10l6-9q2-5-1-10q-4-13-17-41q-3-9-12-9h-11q-9 0-15 7q-19 19-19 45q0 24 22 57l2 3q2 3 4.5 6.5t7 9t9 10.5t10.5 11.5t13 12.5t14.5 11.5t16.5 10t18 8.5q16 6 27.5 10t18 5t9.5 1t7-1t5-1q9-1 21.5-9t15.5-17q8-21 3-26z' />
            </svg>
          </Button>
        </div>
      ),
    },
  ];

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
      if (!isNumericString(search)) {
        console.log('is not numeric', search);
        UserApiService.findAll(search, sorting, skipItems, itemsPerPage).then((response) => {
          console.log(response.data.data);
          if (response.statusCode === 200) {
            setData(response.data.data);
            setColumns(tableColumns);
            setTotalItems(response.data.count);
            setErrorMessage('');
          }
          if (response.statusCode > 399) {
            setErrorMessage(response.message);
            addNotification({ type: 'error', message: response.message });
          }
          if (response instanceof Error) addNotification({ type: 'error', message: 'Internal Server Error' });
        });
      } else {
        console.log('is numeric', search);
        UserApiService.findAllByDNI(search, sorting, skipItems, itemsPerPage).then((response) => {
          console.log(response.data.data);
          if (response.statusCode === 200) {
            setData(response.data.data);
            setColumns(tableColumns);
            setTotalItems(response.data.count);
            setErrorMessage('');
          }
          if (response.statusCode > 399) {
            setErrorMessage(response.message);
            addNotification({ type: 'error', message: response.message });
          }
          if (response instanceof Error) addNotification({ type: 'error', message: 'Internal Server Error' });
        });
      }
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
                {USER_CONFIG.table.noResults}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='flex items-center justify-between space-x-6 pt-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-xs font-normal text-slate-400'>{USER_CONFIG.table.rowsPerPage}</p>
          <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(e) => setPagination({ pageIndex: 0, pageSize: parseInt(e) })}>
            <SelectTrigger className='h-8 w-[65px] text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-0'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top' className='min-w-[4rem]'>
              {USER_CONFIG.table.itemsPerPage.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className='text-xs'>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-xs font-normal text-slate-400'>
          {USER_CONFIG.table.pagination.page} {pagination.pageIndex + 1} {USER_CONFIG.table.pagination.of} {table.getPageCount()}
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
