// Icons: https://lucide.dev/icons/
import { ArrowDownUp, FileText, Mail, MailX, PencilLine, Trash2 } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
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
import { Pagination } from '@core/components/common/Pagination';
import { TableButton } from '@core/components/common/TableButton';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IDataTableUsers, ITableManager } from '@core/interfaces/table.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import type { IUserSearch } from '@users/interfaces/user-search.interface';
import { EUserSearch } from '@users/enums/user-search.enum';
import { USER_CONFIG } from '@config/users/users.config';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useDelimiter } from '@core/hooks/useDelimiter';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { useTruncateText } from '@core/hooks/useTruncateText';
// Interfaces
interface IUsersData {
  count: number;
  data: IUser[];
  total: number;
}

interface IVars {
  search: IUserSearch;
  skipItems: number;
  tableManager: ITableManager;
}
// Default values for pagination and sorting
const defaultSorting: SortingState = [{ id: USER_CONFIG.table.defaultSortingId, desc: USER_CONFIG.table.defaultSortingType }];
const defaultPagination: PaginationState = { pageIndex: 0, pageSize: USER_CONFIG.table.defaultPageSize };
// React component
export function UsersDataTable({ reload, search, setSearch }: IDataTableUsers) {
  const [columns, setColumns] = useState<ColumnDef<IUser>[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [skipItems, setSkipItems] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [tableManager, setTableManager] = useState<ITableManager>({ sorting, pagination });
  const [totalItems, setTotalItems] = useState<number>(0);
  const [userSelected, setUserSelected] = useState<IUser | undefined>(undefined);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const delimiter = useDelimiter();
  const firstUpdate = useRef<boolean>(true);
  const navigate = useNavigate();
  const prevDeps = useRef<IVars>({ search, skipItems, tableManager });
  const truncate = useTruncateText();
  const { i18n, t } = useTranslation();

  // Fetch users
  const {
    data,
    error,
    mutate: searchUsersBy,
    isError,
    isPending,
    isSuccess,
  } = useMutation<IResponse<IUsersData>, Error, IVars>({
    mutationKey: ['searchUsersBy', search, tableManager, skipItems],
    mutationFn: async ({ search, skipItems, tableManager }) => await UserApiService.searchUsersBy(search, tableManager, skipItems),
    onSuccess: (response) => {
      setColumns(tableColumns);
      setTotalItems(response.data.count);
    },
    onError: (error) => {
      addNotification({ type: 'error', message: t(error.message) });
    },
    retry: 1,
  });

  useEffect(() => {
    if (prevDeps.current.search.value !== search.value) {
      setPagination(defaultPagination);
      prevDeps.current.search = search;
      setSkipItems(0);
    } else {
      setSkipItems(tableManager.pagination.pageIndex * tableManager.pagination.pageSize);
    }

    if (search.value !== '') {
      searchUsersBy({ search, skipItems, tableManager });
    } else {
      searchUsersBy({ search: { value: '', type: EUserSearch.NAME }, skipItems, tableManager });
    }
  }, [search, searchUsersBy, skipItems, tableManager]);

  // Table manager
  const table: ITable<IUser> = useReactTable({
    columns: columns,
    data: data?.data.data ?? [],
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

  const tableColumns: ColumnDef<IUser>[] = useMemo(
    () => [
      {
        accessorKey: 'index',
        size: 50,
        header: () => <div className='text-center'>{t(USER_CONFIG.table.header[0])}</div>,
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
              {t(USER_CONFIG.table.header[1])}
              <ArrowDownUp size={12} strokeWidth={2} />
            </button>
          </div>
        ),
        cell: ({ row }) => <div className='text-left'>{UtilsString.upperCase(`${row.original.firstName} ${row.original.lastName}`, 'each')}</div>,
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
              {t(USER_CONFIG.table.header[2])}
              <ArrowDownUp size={12} strokeWidth={2} />
            </button>
          </div>
        ),
        cell: ({ row }) => <div className='text-left'>{i18n.format(row.original.dni, 'number', i18n.resolvedLanguage)}</div>,
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
              {t(USER_CONFIG.table.header[3])}
              <ArrowDownUp size={12} strokeWidth={2} />
            </button>
          </div>
        ),
        cell: ({ row }) => <div className='text-left text-sm'>{delimiter(row.original.phone, '-', 6)}</div>,
      },
      {
        accessorKey: 'actions',
        size: 100,
        header: () => <div className='text-center'>{t(USER_CONFIG.table.header[4])}</div>,
        cell: ({ row }) => (
          <div className='mx-auto flex w-fit flex-row items-center justify-center space-x-2'>
            <TableButton callback={() => navigate(`/users/${row.original._id}`)} className='hover:text-sky-500' tooltip={t('tooltip.details')}>
              <FileText size={16} strokeWidth={1.5} />
            </TableButton>
            <TableButton
              callback={() => navigate(`/users/update/${row.original._id}`)}
              className='hover:text-fuchsia-500'
              tooltip={t('tooltip.edit')}
            >
              <PencilLine size={16} strokeWidth={1.5} />
            </TableButton>
            <TableButton callback={() => handleRemoveUserDialog(row.original)} className='hover:text-rose-500' tooltip={t('tooltip.delete')}>
              <Trash2 size={16} strokeWidth={1.5} />
            </TableButton>
            <TableButton
              callback={() => navigate(`/email/${row.original._id}`)}
              className='hover:text-sky-500'
              disabled={!row.original.email}
              tooltip={t('tooltip.sendEmail')}
            >
              {!row.original.email ? <MailX size={16} strokeWidth={1.5} /> : <Mail size={16} strokeWidth={1.5} />}
            </TableButton>
            <TableButton
              callback={() => navigate(`/whatsapp/user/${row.original._id}`)}
              className='hover:text-green-500'
              tooltip={t('tooltip.sendMessage')}
            >
              <svg width={16} height={16} viewBox='0 0 32 32'>
                <path
                  d='M25.873,6.069c-2.619-2.623-6.103-4.067-9.814-4.069C8.411,2,2.186,8.224,2.184,15.874c-.001,2.446,.638,4.833,1.852,6.936l-1.969,7.19,7.355-1.929c2.026,1.106,4.308,1.688,6.63,1.689h.006c7.647,0,13.872-6.224,13.874-13.874,.001-3.708-1.44-7.193-4.06-9.815h0Zm-9.814,21.347h-.005c-2.069,0-4.099-.557-5.87-1.607l-.421-.25-4.365,1.145,1.165-4.256-.274-.436c-1.154-1.836-1.764-3.958-1.763-6.137,.003-6.358,5.176-11.531,11.537-11.531,3.08,.001,5.975,1.202,8.153,3.382,2.177,2.179,3.376,5.077,3.374,8.158-.003,6.359-5.176,11.532-11.532,11.532h0Zm6.325-8.636c-.347-.174-2.051-1.012-2.369-1.128-.318-.116-.549-.174-.78,.174-.231,.347-.895,1.128-1.098,1.359-.202,.232-.405,.26-.751,.086-.347-.174-1.464-.54-2.788-1.72-1.03-.919-1.726-2.054-1.929-2.402-.202-.347-.021-.535,.152-.707,.156-.156,.347-.405,.52-.607,.174-.202,.231-.347,.347-.578,.116-.232,.058-.434-.029-.607-.087-.174-.78-1.88-1.069-2.574-.281-.676-.567-.584-.78-.595-.202-.01-.433-.012-.665-.012s-.607,.086-.925,.434c-.318,.347-1.213,1.186-1.213,2.892s1.242,3.355,1.416,3.587c.174,.232,2.445,3.733,5.922,5.235,.827,.357,1.473,.571,1.977,.73,.83,.264,1.586,.227,2.183,.138,.666-.1,2.051-.839,2.34-1.649,.289-.81,.289-1.504,.202-1.649s-.318-.232-.665-.405h0Z'
                  fill='#currentColor'
                ></path>
              </svg>
            </TableButton>
          </div>
        ),
      },
    ],
    [delimiter, i18n, navigate, t, truncate],
  );

  // Actions
  function handleRemoveUserDialog(user: IUser): void {
    setOpenDialog(true);
    setUserSelected(user);
  }

  const {
    error: errorDeleting,
    mutate: deleteUser,
    isError: isErrorDeleting,
    isPending: isPendingDelete,
  } = useMutation<IResponse<IUser>, Error, { id: string }>({
    mutationKey: ['deleteUser', userSelected?._id],
    mutationFn: async ({ id }) => await UserApiService.remove(id),
    onSuccess: (response) => {
      setSearch({ value: '', type: EUserSearch.NAME });
      setOpenDialog(false);
      addNotification({ type: 'success', message: response.message });
    },
    onError: (error) => {
      addNotification({ type: 'error', message: error.message });
    },
    retry: 1,
  });

  function handleRemoveUserDatabase(id?: string): void {
    id && deleteUser({ id });
  }

  useEffect(() => {
    !openDialog && setUserSelected(undefined);
  }, [openDialog]);

  if (isPending) return <LoadingDB text={t('loading.users')} className='mt-6 p-0' />;
  if (isError) return <InfoCard text={error.message} type='error' className='mt-6' />;

  if (isSuccess) {
    return (
      <>
        {/* Section: Data table */}
        {table.getRowModel().rows?.length > 0 && (
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
            <Pagination
              className='pt-6 !text-xsm text-slate-400'
              itemsPerPage={USER_CONFIG.table.itemsPerPage}
              pagination={pagination}
              setPagination={setPagination}
              table={table}
            />
          </>
        )}
        {/* Section: Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-xl'>{t('dialog.deleteUser.title')}</DialogTitle>
              {isErrorDeleting ? (
                <DialogDescription></DialogDescription>
              ) : (
                <DialogDescription>{t('dialog.deleteUser.description')}</DialogDescription>
              )}
            </DialogHeader>
            <section className='flex flex-col'>
              {isErrorDeleting ? (
                <InfoCard text={errorDeleting.message} type='error' />
              ) : (
                <div className='text-sm'>
                  <Trans
                    i18nKey='dialog.deleteUser.content'
                    values={{
                      firstName: UtilsString.upperCase(userSelected?.firstName, 'each'),
                      lastName: UtilsString.upperCase(userSelected?.lastName, 'each'),
                      identityCard: i18n.format(userSelected?.dni, 'number', i18n.resolvedLanguage),
                    }}
                    components={{
                      span: <span className='font-semibold' />,
                      i: <i />,
                    }}
                  />
                </div>
              )}
            </section>
            <DialogFooter className='flex justify-end'>
              {isErrorDeleting ? (
                <Button variant='default' size='sm' onClick={() => setOpenDialog(false)}>
                  {t('button.close')}
                </Button>
              ) : (
                <div className='flex space-x-4'>
                  <Button variant='ghost' size='sm' onClick={() => setOpenDialog(false)}>
                    {t('button.cancel')}
                  </Button>
                  <Button variant='remove' size='sm' onClick={() => handleRemoveUserDatabase(userSelected?._id)}>
                    {isPendingDelete ? <LoadingDB className='p-0' text={t('loading.deleting')} variant='button' /> : t('button.deleteUser')}
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}
