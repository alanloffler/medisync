// Icons: https://lucide.dev/icons/
import { ArrowDownUp, ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, FilePen, FileText, Trash2 } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@core/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@core/components/ui/tooltip';
// Tanstack Data Table: https://tanstack.com/table/latest
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type Table as ITable,
  useReactTable,
} from '@tanstack/react-table';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IDataTableUsers, ITableManager } from '@core/interfaces/table.interface';
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { APP_CONFIG } from '@config/app.config';
import { USER_CONFIG } from '@config/user.config';
import { UserApiService } from '@users/services/user-api.service';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useDelimiter } from '@core/hooks/useDelimiter';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { useTruncateText } from '@core/hooks/useTruncateText';
// Default values for pagination and sorting
const defaultSorting: SortingState = [{ id: USER_CONFIG.table.defaultSortingId, desc: USER_CONFIG.table.defaultSortingType }];
const defaultPagination: PaginationState = { pageIndex: 0, pageSize: USER_CONFIG.table.defaultPageSize };
// React component
export function UsersDataTable({ search, reload, setReload, setErrorMessage, help }: IDataTableUsers) {
  const [columns, setColumns] = useState<ColumnDef<IUser>[]>([]);
  const [data, setData] = useState<IUser[]>([]);
  const [errorRemoving, setErrorRemoving] = useState<boolean>(false);
  const [errorRemovingContent, setErrorRemovingContent] = useState<IInfoCard>({ type: 'success', text: '' });
  const [infoCardContent, setInfoCardContent] = useState<IInfoCard>({ type: 'success', text: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [tableManager, setTableManager] = useState<ITableManager>({ sorting, pagination });
  const [totalItems, setTotalItems] = useState<number>(0);
  const [userSelected, setUserSelected] = useState<IUser>({} as IUser);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const delimiter = useDelimiter();
  const firstUpdate = useRef(true);
  const navigate = useNavigate();
  const truncate = useTruncateText();

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
          <button
            className='flex items-center gap-2 hover:text-accent-foreground'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {USER_CONFIG.table.headers[0]}
            <ArrowDownUp className='h-3 w-3' />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left'>{`${capitalize(row.original.lastName)}, ${capitalize(row.original.firstName)}`}</div>,
    },
    {
      accessorKey: 'dni',
      size: 80,
      header: ({ column }) => (
        <div className='text-left'>
          <button
            className='flex items-center gap-2 hover:text-accent-foreground'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
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
          <button
            className='flex items-center gap-2 hover:text-accent-foreground'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
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
        <div className='flex flex-row items-center justify-center space-x-2'>
          {help ? (
            <>
              {/* View User */}
              <TooltipProvider delayDuration={0.3}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={'ghost'}
                      size={'miniIcon'}
                      onClick={() => navigate(`/users/${row.original._id}`)}
                      className='hover:bg-transparent hover:text-fuchsia-500'
                    >
                      <FileText size={16} strokeWidth={2} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs font-medium'>{USER_CONFIG.tooltip.actions.viewUser}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* Update User */}
              <TooltipProvider delayDuration={0.3}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={'ghost'}
                      size={'miniIcon'}
                      onClick={() => navigate(`/users/update/${row.original._id}`)}
                      className='hover:bg-transparent hover:text-indigo-500'
                    >
                      <FilePen size={16} strokeWidth={2} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs font-medium'>{USER_CONFIG.tooltip.actions.updateUser}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* Delete User */}
              <TooltipProvider delayDuration={0.3}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={'ghost'}
                      size={'miniIcon'}
                      onClick={() => handleRemoveUserDialog(row.original)}
                      className='hover:bg-transparent hover:text-red-500'
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs font-medium'>{USER_CONFIG.tooltip.actions.removeUser}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* Send WhatsApp message */}
              <TooltipProvider delayDuration={0.3}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={!row.original.phone}
                      variant={'ghost'}
                      size={'miniIcon'}
                      className='fill-current hover:bg-transparent hover:fill-green-500'
                      onClick={() => navigate(`/whatsapp/user/${row.original._id}`)}
                    >
                      <svg width='100' height='100' viewBox='0 0 464 488' className='h-4 w-4'>
                        <path d='M462 228q0 93-66 159t-160 66q-56 0-109-28L2 464l40-120q-32-54-32-116q0-93 66-158.5T236 4t160 65.5T462 228zM236 39q-79 0-134.5 55.5T46 228q0 62 36 111l-24 70l74-23q49 31 104 31q79 0 134.5-55.5T426 228T370.5 94.5T236 39zm114 241q-1-1-10-7q-3-1-19-8.5t-19-8.5q-9-3-13 2q-1 3-4.5 7.5t-7.5 9t-5 5.5q-4 6-12 1q-34-17-45-27q-7-7-13.5-15t-12-15t-5.5-8q-3-7 3-11q4-6 8-10l6-9q2-5-1-10q-4-13-17-41q-3-9-12-9h-11q-9 0-15 7q-19 19-19 45q0 24 22 57l2 3q2 3 4.5 6.5t7 9t9 10.5t10.5 11.5t13 12.5t14.5 11.5t16.5 10t18 8.5q16 6 27.5 10t18 5t9.5 1t7-1t5-1q9-1 21.5-9t15.5-17q8-21 3-26z' />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs font-medium'>{USER_CONFIG.tooltip.actions.sendWhatsAppMessage}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <>
              <Button
                variant={'ghost'}
                size={'miniIcon'}
                onClick={() => navigate(`/users/${row.original._id}`)}
                className='hover:bg-transparent hover:text-fuchsia-500'
              >
                <FileText size={16} strokeWidth={2} />
              </Button>
              <Button
                variant={'ghost'}
                size={'miniIcon'}
                onClick={() => navigate(`/users/update/${row.original._id}`)}
                className='hover:bg-transparent hover:text-indigo-500'
              >
                <FilePen size={16} strokeWidth={2} />
              </Button>
              <Button
                variant={'ghost'}
                size={'miniIcon'}
                onClick={() => handleRemoveUserDialog(row.original)}
                className='hover:bg-transparent hover:text-red-500'
              >
                <Trash2 size={16} strokeWidth={2} />
              </Button>
              <Button
                disabled={!row.original.phone}
                variant={'ghost'}
                size={'miniIcon'}
                className='fill-current hover:bg-transparent hover:fill-green-500'
                onClick={() => navigate(`/whatsapp/user/${row.original._id}`)}
              >
                <svg width='100' height='100' viewBox='0 0 464 488' className='h-4 w-4'>
                  <path d='M462 228q0 93-66 159t-160 66q-56 0-109-28L2 464l40-120q-32-54-32-116q0-93 66-158.5T236 4t160 65.5T462 228zM236 39q-79 0-134.5 55.5T46 228q0 62 36 111l-24 70l74-23q49 31 104 31q79 0 134.5-55.5T426 228T370.5 94.5T236 39zm114 241q-1-1-10-7q-3-1-19-8.5t-19-8.5q-9-3-13 2q-1 3-4.5 7.5t-7.5 9t-5 5.5q-4 6-12 1q-34-17-45-27q-7-7-13.5-15t-12-15t-5.5-8q-3-7 3-11q4-6 8-10l6-9q2-5-1-10q-4-13-17-41q-3-9-12-9h-11q-9 0-15 7q-19 19-19 45q0 24 22 57l2 3q2 3 4.5 6.5t7 9t9 10.5t10.5 11.5t13 12.5t14.5 11.5t16.5 10t18 8.5q16 6 27.5 10t18 5t9.5 1t7-1t5-1q9-1 21.5-9t15.5-17q8-21 3-26z' />
                </svg>
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const table: ITable<IUser> = useReactTable({
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
    const fetchData = (search: { value: string; type: string }, sorting: SortingState, skipItems: number, itemsPerPage: number) => {
      setIsLoading(true);

      if (search.type === 'name') {
        UserApiService.findAll(search.value, sorting, skipItems, itemsPerPage)
          .then((response: IResponse) => {
            if (response.statusCode === 200) {
              if (response.data.length === 0) {
                addNotification({ type: 'error', message: response.message });
                setInfoCardContent({ type: 'warning', text: response.message });
              }

              setData(response.data.data);
              setColumns(tableColumns);
              setTotalItems(response.data.count);
              setErrorMessage('');
            }
            if (response.statusCode > 399) {
              setErrorMessage(response.message);
              addNotification({ type: 'warning', message: response.message });
              setInfoCardContent({ type: 'error', text: response.message });
            }
            if (response instanceof Error) {
              addNotification({ type: 'error', message: APP_CONFIG.error.server });
              setInfoCardContent({ type: 'error', text: APP_CONFIG.error.server });
            }
          })
          .finally(() => setIsLoading(false));
      }
      if (search.type === 'dni') {
        UserApiService.findAllByDNI(search.value, sorting, skipItems, itemsPerPage)
          .then((response: IResponse) => {
            if (response.statusCode === 200) {
              setData(response.data.data);
              setColumns(tableColumns);
              setTotalItems(response.data.count);
              setErrorMessage('');
            }
            if (response.statusCode > 399) {
              setErrorMessage(response.message);
              addNotification({ type: 'error', message: response.message });
              setInfoCardContent({ type: 'error', text: response.message });
            }
            if (response instanceof Error) {
              addNotification({ type: 'error', message: APP_CONFIG.error.server });
              setInfoCardContent({ type: 'error', text: APP_CONFIG.error.server });
            }
          })
          .finally(() => setIsLoading(false));
      }
    };
    fetchData(search, tableManager.sorting, tableManager.pagination.pageIndex * tableManager.pagination.pageSize, tableManager.pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tableManager, help]);

  function handleRemoveUserDialog(user: IUser): void {
    setOpenDialog(true);
    setUserSelected(user);
  }

  function handleRemoveUserDatabase(id: string): void {
    setIsRemoving(true);
    setErrorRemoving(false);

    UserApiService.remove(id)
      .then((response: IResponse) => {
        if (response.statusCode === 200) {
          addNotification({ type: 'success', message: response.message });
          setOpenDialog(false);
          setUserSelected({} as IUser);
          setReload(new Date().getTime());
        }
        if (response.statusCode > 399) {
          setErrorRemoving(true);
          setErrorRemovingContent({ type: 'error', text: response.message });
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          setErrorRemoving(true);
          setErrorRemovingContent({ type: 'error', text: APP_CONFIG.error.server });
          addNotification({ type: 'error', message: APP_CONFIG.error.server });
        }
      })
      .finally(() => setIsRemoving(false));
  }

  return (
    <>
      {isLoading ? (
        <LoadingDB text={APP_CONFIG.loadingDB.findUsers} className='mt-3' />
      ) : table.getRowModel().rows?.length > 0 ? (
        <section>
          <div className='flex items-center justify-end text-sm font-medium text-slate-400'>
            {totalItems === 1 ? `${totalItems} ${USER_CONFIG.dbUsersSingular}` : `${totalItems} ${USER_CONFIG.dbUsersPlural}`}
          </div>
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
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className='px-0 py-1' key={cell.id} style={{ width: `${cell.column.getSize()}px` }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <section className='flex items-center justify-between space-x-6 pt-6 lg:space-x-8'>
            <div className='flex items-center space-x-2'>
              <p className='text-xs font-normal text-slate-400'>{USER_CONFIG.table.rowsPerPage}</p>
              <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(e) => setPagination({ pageIndex: 0, pageSize: parseInt(e) })}>
                {help ? (
                  <TooltipProvider delayDuration={0.3}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SelectTrigger className='h-8 w-[65px] text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-0'>
                          <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className='text-xs font-medium'>{USER_CONFIG.tooltip.pagination.pageSize}</p>
                      </TooltipContent>
                      <SelectContent side='top' className='min-w-[4rem]'>
                        {USER_CONFIG.table.itemsPerPage.map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`} className='text-xs'>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <>
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
                  </>
                )}
              </Select>
            </div>
            <div className='flex w-[100px] items-center justify-center text-xs font-normal text-slate-400'>
              {USER_CONFIG.table.pagination.page} {pagination.pageIndex + 1} {USER_CONFIG.table.pagination.of} {table.getPageCount()}
            </div>
            {table.getPageCount() > 1 && (
              <div className='flex items-center space-x-2'>
                {help ? (
                  <>
                    {/* First page */}
                    <TooltipProvider delayDuration={0.3}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800'
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                          >
                            <ArrowLeftIcon size={16} strokeWidth={2} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-medium'>{USER_CONFIG.tooltip.pagination.firstPage}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {/* Previous page */}
                    <TooltipProvider delayDuration={0.3}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 dark:bg-neutral-950 dark:hover:bg-neutral-800'
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                          >
                            <ChevronLeftIcon size={16} strokeWidth={2} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-medium'>{USER_CONFIG.tooltip.pagination.prevPage}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {/* Next page */}
                    <TooltipProvider delayDuration={0.3}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 dark:bg-neutral-950 dark:hover:bg-neutral-800'
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                          >
                            <ChevronRightIcon size={16} strokeWidth={2} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-medium'>{USER_CONFIG.tooltip.pagination.nextPage}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {/* Last page */}
                    <TooltipProvider delayDuration={0.3}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800'
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                          >
                            <ArrowRightIcon size={16} strokeWidth={2} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-medium'>{USER_CONFIG.tooltip.pagination.lastPage}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                ) : (
                  <>
                    <Button
                      variant='ghost'
                      className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800'
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ArrowLeftIcon size={16} strokeWidth={2} />
                    </Button>
                    <Button
                      variant='ghost'
                      className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 dark:bg-neutral-950 dark:hover:bg-neutral-800'
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronLeftIcon size={16} strokeWidth={2} />
                    </Button>
                    <Button
                      variant='ghost'
                      className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 dark:bg-neutral-950 dark:hover:bg-neutral-800'
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronRightIcon size={16} strokeWidth={2} />
                    </Button>
                    <Button
                      variant='ghost'
                      className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800'
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      <ArrowRightIcon size={16} strokeWidth={2} />
                    </Button>
                  </>
                )}
              </div>
            )}
          </section>
        </section>
      ) : (
        <InfoCard text={infoCardContent.text} type={infoCardContent.type} className='mt-3' />
      )}
      {/* Section: Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>{USER_CONFIG.dialog.remove.title}</DialogTitle>
            {errorRemoving ? <DialogDescription></DialogDescription> : <DialogDescription>{USER_CONFIG.dialog.remove.subtitle}</DialogDescription>}
            <section className='flex flex-col pt-2'>
              {errorRemoving ? (
                <>
                  <InfoCard text={errorRemovingContent.text} type={errorRemovingContent.type} />
                  <footer className='mt-5 flex justify-end space-x-4'>
                    <Button variant='default' size='sm' onClick={() => setOpenDialog(false)}>
                      {USER_CONFIG.dialog.button.close}
                    </Button>
                  </footer>
                </>
              ) : (
                <>
                  <span className=''>{USER_CONFIG.dialog.remove.content.title}</span>
                  <span className='mt-1 text-lg font-semibold'>{`${capitalize(userSelected.lastName)}, ${capitalize(userSelected.firstName)}`}</span>
                  <span className='font-medium'>{`${USER_CONFIG.dialog.remove.content.dni}: ${delimiter(userSelected.dni, '.', 3)}`}</span>
                  <footer className='mt-5 flex justify-end space-x-4'>
                    <Button variant={'secondary'} size={'sm'} onClick={() => setOpenDialog(false)}>
                      {USER_CONFIG.buttons.cancel}
                    </Button>
                    <Button variant={'remove'} size={'sm'} onClick={() => handleRemoveUserDatabase(userSelected._id)}>
                      {isRemoving ? <LoadingDB text={USER_CONFIG.buttons.removing} variant='button' /> : USER_CONFIG.buttons.remove}
                    </Button>
                  </footer>
                </>
              )}
            </section>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
