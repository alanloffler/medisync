// Icons: https://lucide.dev/icons/
import { ArrowDownUp, ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, FileText, PencilLine, Trash2 } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@core/components/ui/table';
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
import { DBCountUsers } from '@users/components/common/DBCountUsers';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import type { IDataTableUsers, ITableManager } from '@core/interfaces/table.interface';
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { APP_CONFIG } from '@config/app.config';
import { EUserSearch, type IUserSearch } from '@users/interfaces/user-search.interface';
import { USER_CONFIG } from '@config/users/users.config';
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
  const prevDeps = useRef<{ search: IUserSearch; tableManager: ITableManager }>({ search, tableManager });
  const truncate = useTruncateText();
  const { t } = useTranslation();

  const tableColumns: ColumnDef<IUser>[] = [
    {
      accessorKey: 'index',
      size: 50,
      header: () => <div className='text-center'>#</div>,
      cell: ({ row }) => (
        <div className='mx-auto w-fit rounded-md bg-slate-100 px-1.5 py-1 text-center text-xs text-slate-400'>{truncate(row.original._id, -3)}</div>
      ),
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
            <ArrowDownUp size={12} strokeWidth={2} />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left'>{`${capitalize(row.original.firstName)} ${capitalize(row.original.lastName)}`}</div>,
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
            <ArrowDownUp size={12} strokeWidth={2} />
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
            <ArrowDownUp size={12} strokeWidth={2} />
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
        <div className='mx-auto flex w-fit flex-row items-center justify-center space-x-1'>
          <TooltipWrapper tooltip={USER_CONFIG.table.tooltip.button.view} help={help}>
            <Button
              variant='ghost'
              size='miniIcon'
              onClick={() => navigate(`/users/${row.original._id}`)}
              className='transition-transform duration-100 ease-in-out animate-in hover:scale-110 hover:bg-transparent hover:text-sky-400'
            >
              <FileText size={16} strokeWidth={1.5} />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper tooltip={USER_CONFIG.table.tooltip.button.edit} help={help}>
            <Button
              variant='ghost'
              size='miniIcon'
              onClick={() => navigate(`/users/update/${row.original._id}`)}
              className='transition-transform duration-100 ease-in-out animate-in hover:scale-110 hover:bg-transparent hover:text-orange-400'
            >
              <PencilLine size={16} strokeWidth={1.5} />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper tooltip={USER_CONFIG.table.tooltip.button.delete} help={help}>
            <Button
              variant='ghost'
              size='miniIcon'
              onClick={() => handleRemoveUserDialog(row.original)}
              className='transition-transform duration-100 ease-in-out animate-in hover:scale-110 hover:bg-transparent hover:text-rose-400'
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper tooltip={USER_CONFIG.table.tooltip.button.sendWhatsApp} help={help}>
            <Button
              disabled={!row.original.phone}
              variant='ghost'
              size='miniIcon'
              onClick={() => navigate(`/whatsapp/user/${row.original._id}`)}
              className='transition-transform duration-100 ease-in-out animate-in hover:scale-110 hover:bg-transparent hover:fill-green-500'
            >
              <svg width={16} height={16} viewBox='0 0 32 32'>
                <path
                  d='M25.873,6.069c-2.619-2.623-6.103-4.067-9.814-4.069C8.411,2,2.186,8.224,2.184,15.874c-.001,2.446,.638,4.833,1.852,6.936l-1.969,7.19,7.355-1.929c2.026,1.106,4.308,1.688,6.63,1.689h.006c7.647,0,13.872-6.224,13.874-13.874,.001-3.708-1.44-7.193-4.06-9.815h0Zm-9.814,21.347h-.005c-2.069,0-4.099-.557-5.87-1.607l-.421-.25-4.365,1.145,1.165-4.256-.274-.436c-1.154-1.836-1.764-3.958-1.763-6.137,.003-6.358,5.176-11.531,11.537-11.531,3.08,.001,5.975,1.202,8.153,3.382,2.177,2.179,3.376,5.077,3.374,8.158-.003,6.359-5.176,11.532-11.532,11.532h0Zm6.325-8.636c-.347-.174-2.051-1.012-2.369-1.128-.318-.116-.549-.174-.78,.174-.231,.347-.895,1.128-1.098,1.359-.202,.232-.405,.26-.751,.086-.347-.174-1.464-.54-2.788-1.72-1.03-.919-1.726-2.054-1.929-2.402-.202-.347-.021-.535,.152-.707,.156-.156,.347-.405,.52-.607,.174-.202,.231-.347,.347-.578,.116-.232,.058-.434-.029-.607-.087-.174-.78-1.88-1.069-2.574-.281-.676-.567-.584-.78-.595-.202-.01-.433-.012-.665-.012s-.607,.086-.925,.434c-.318,.347-1.213,1.186-1.213,2.892s1.242,3.355,1.416,3.587c.174,.232,2.445,3.733,5.922,5.235,.827,.357,1.473,.571,1.977,.73,.83,.264,1.586,.227,2.183,.138,.666-.1,2.051-.839,2.34-1.649,.289-.81,.289-1.504,.202-1.649s-.318-.232-.665-.405h0Z'
                  fill='#currentColor'
                ></path>
              </svg>
            </Button>
          </TooltipWrapper>
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
    const fetchData = (search: IUserSearch, sorting: SortingState, itemsPerPage: number) => {
      setIsLoading(true);

      let skipItems: number;

      if (prevDeps.current.search.value !== search.value) {
        setPagination(defaultPagination);
        prevDeps.current.search = search;
        skipItems = 0;
      } else {
        skipItems = tableManager.pagination.pageIndex * tableManager.pagination.pageSize;
      }

      if (search.type === EUserSearch.NAME) {
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
      if (search.type === EUserSearch.DNI) {
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
    fetchData(search, tableManager.sorting, tableManager.pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tableManager]);

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
        <>
          <DBCountUsers />
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
                <TooltipWrapper tooltip={USER_CONFIG.table.tooltip.pagination.itemsPerPage} help={help}>
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
              {USER_CONFIG.table.pagination.page} {pagination.pageIndex + 1} {USER_CONFIG.table.pagination.of} {table.getPageCount()}
            </div>
            {table.getPageCount() > 1 && (
              <section className='flex items-center space-x-2'>
                <TooltipWrapper tooltip={USER_CONFIG.table.tooltip.pagination.firstPage} help={help}>
                  <Button
                    variant='ghost'
                    className='h-8 w-8 bg-input p-0 hover:bg-input-hover lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800'
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ArrowLeftIcon size={16} strokeWidth={2} />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltip={USER_CONFIG.table.tooltip.pagination.prevPage} help={help}>
                  <Button
                    variant='ghost'
                    className='h-8 w-8 bg-input p-0 hover:bg-input-hover dark:bg-neutral-950 dark:hover:bg-neutral-800'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeftIcon size={16} strokeWidth={2} />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltip={USER_CONFIG.table.tooltip.pagination.nextPage} help={help}>
                  <Button
                    variant='ghost'
                    className='h-8 w-8 bg-input p-0 hover:bg-input-hover dark:bg-neutral-950 dark:hover:bg-neutral-800'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronRightIcon size={16} strokeWidth={2} />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltip={USER_CONFIG.table.tooltip.pagination.lastPage} help={help}>
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
        </>
      ) : (
        <InfoCard text={infoCardContent.text} type={infoCardContent.type} className='mt-3' />
      )}
      {/* Section: Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>{t('dialog.deleteUser.title')}</DialogTitle>
            {errorRemoving ? <DialogDescription></DialogDescription> : <DialogDescription>{t('dialog.deleteUser.description')}</DialogDescription>}
            <section className='flex flex-col pt-2'>
              {/* TODO: fix the structure and use Trans component for content */}
              {errorRemoving ? (
                <>
                  <InfoCard text={errorRemovingContent.text} type={errorRemovingContent.type} />
                  <footer className='mt-5 flex justify-end space-x-4'>
                    <Button variant='default' size='sm' onClick={() => setOpenDialog(false)}>
                      {t('button.close')}
                    </Button>
                  </footer>
                </>
              ) : (
                <>
                  <span className=''>{USER_CONFIG.dialog.remove.content.title}</span>
                  <span className='mt-1 text-lg font-semibold'>{`${capitalize(userSelected.lastName)}, ${capitalize(userSelected.firstName)}`}</span>
                  <span className='font-medium'>{`${USER_CONFIG.dialog.remove.content.dni}: ${delimiter(userSelected.dni, '.', 3)}`}</span>
                  <footer className='mt-5 flex justify-end space-x-4'>
                    <Button variant='ghost' size='sm' onClick={() => setOpenDialog(false)}>
                      {t('button.cancel')}
                    </Button>
                    <Button variant='remove' size='sm' onClick={() => handleRemoveUserDatabase(userSelected._id)}>
                      {isRemoving ? <LoadingDB text={t('loading.deleting')} variant='button' /> : t('button.deleteUser')}
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
