// Icons: https://lucide.dev/icons/
import { ArrowDownUp, FileText, Mail, MailX, MessageCircle, PencilLine, Trash2 } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { Separator } from '@core/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@core/components/ui/table';
// Tanstack Data Table: https://tanstack.com/table/latest
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Cell,
  type ColumnDef,
  type PaginationState,
  type Row,
  type SortingState,
  type Table as ITable,
  useReactTable,
} from '@tanstack/react-table';
// Components
import { DBCountUsers } from '@users/components/common/DBCountUsers';
import { Id } from '@core/components/common/ui/Id';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { Pagination } from '@core/components/common/Pagination';
import { TableButton } from '@core/components/common/TableButton';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IAreaCode } from '@core/interfaces/area-code.interface';
import type { IDataTableUsers, ITableManager } from '@core/interfaces/table.interface';
import type { IPaginatedUsersVars } from '@users/interfaces/mutation-vars.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser, IUsersData } from '@users/interfaces/user.interface';
import { AreaCodeService } from '@core/services/area-code.service';
import { EUserSearch } from '@users/enums/user-search.enum';
import { EUserType } from '@core/enums/user-type.enum';
import { EWhatsappTemplate } from '@whatsapp/enums/template.enum';
import { USER_CONFIG } from '@config/users/users.config';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useDelimiter } from '@core/hooks/useDelimiter';
import { useMediaQuery } from '@core/hooks/useMediaQuery';
import { useNotificationsStore } from '@core/stores/notifications.store';
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
  const prevDeps = useRef<IPaginatedUsersVars>({ search, skipItems, tableManager });
  const { i18n, t } = useTranslation();

  // Table column visibility
  const isSmallDevice = useMediaQuery('only screen and (max-width : 639px)');
  const isMediumDevice = useMediaQuery('only screen and (max-width : 767px)');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    identityCard: !isSmallDevice,
    phone: !isMediumDevice,
  });

  useEffect(() => {
    setColumnVisibility({
      identityCard: !isSmallDevice,
      phone: !isMediumDevice,
    });
  }, [isMediumDevice, isSmallDevice]);

  // Fetch users
  const {
    data,
    error,
    mutate: searchUsersBy,
    isError,
    isPending,
    isSuccess,
  } = useMutation<IResponse<IUsersData>, Error, IPaginatedUsersVars>({
    mutationKey: ['searchUsersBy', search, tableManager, skipItems],
    mutationFn: async ({ search, skipItems, tableManager }) => await UserApiService.searchUsersBy(search, tableManager, skipItems),
    onSuccess: (response) => {
      setColumns(tableColumns);
      setTotalItems(response.data.count);
    },
    onError: (error) => {
      addNotification({ type: 'error', message: t(error.message) });
    },
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

  const { data: areaCode, isSuccess: areaCodeIsSuccess } = useQuery<IResponse<IAreaCode[]>, Error>({
    queryKey: ['area-code', 'find-all'],
    queryFn: async () => await AreaCodeService.findAll(),
  });

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
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: totalItems,
    state: {
      columnVisibility,
      pagination,
      sorting,
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

  const tableColumns: ColumnDef<IUser>[] = [
    {
      accessorKey: 'index',
      size: 50,
      header: () => <div className='text-center uppercase'>{t(USER_CONFIG.table.header[0])}</div>,
      cell: ({ row }) => <Id id={row.original._id} />,
    },
    {
      accessorKey: 'lastName',
      header: ({ column }) => (
        <div className='text-left'>
          <button
            className='flex items-center gap-2 uppercase hover:text-accent-foreground'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t(USER_CONFIG.table.header[1])}
            <ArrowDownUp size={12} strokeWidth={2} />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left'>{UtilsString.upperCase(`${row.original.lastName}, ${row.original.firstName}`, 'each')}</div>,
    },
    {
      accessorKey: 'identityCard',
      size: 80,
      header: ({ column }) => (
        <div className='text-left'>
          <button
            className='flex items-center gap-2 uppercase hover:text-accent-foreground'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t(USER_CONFIG.table.header[2])}
            <ArrowDownUp size={12} strokeWidth={2} />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left text-xsm text-slate-500'>{i18n.format(row.original.dni, 'number', i18n.resolvedLanguage)}</div>,
    },
    {
      accessorKey: 'phone',
      size: 150,
      header: ({ column }) => (
        <div className='text-center'>
          <button
            className='flex items-center gap-2 uppercase hover:text-accent-foreground'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t(USER_CONFIG.table.header[3])}
            <ArrowDownUp size={12} strokeWidth={2} />
          </button>
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex items-center space-x-2'>
          {areaCodeIsSuccess && (
            <img
              className='grayscale'
              height={18}
              width={18}
              src={
                new URL(
                  `../../../assets/icons/i18n/${areaCode.data.find((area) => area.code === String(row.original.areaCode))?.icon}.svg`,
                  import.meta.url,
                ).href
              }
            />
          )}
          <span className='text-left text-xsm text-slate-500'>{`(${row.original.areaCode}) ${delimiter(row.original.phone, '-', 6)}`}</span>
        </div>
      ),
    },
    {
      accessorKey: 'actions',
      size: 80,
      header: () => <div className='text-center uppercase'>{t(USER_CONFIG.table.header[4])}</div>,
      cell: ({ row }) => (
        <div className='mx-auto flex w-fit flex-row items-center justify-center space-x-0.5 md:space-x-2'>
          <TableButton
            callback={() => navigate(`/users/${row.original._id}`)}
            className='hidden hover:bg-sky-100/75 hover:text-sky-400 sm:flex'
            tooltip={t('tooltip.details')}
          >
            <FileText size={17} strokeWidth={1.5} />
          </TableButton>

          <TableButton
            callback={() => navigate(`/users/update/${row.original._id}`)}
            className='hover:bg-amber-100/75 hover:text-amber-400'
            tooltip={t('tooltip.edit')}
          >
            <PencilLine size={17} strokeWidth={1.5} />
          </TableButton>
          <TableButton
            callback={() => handleRemoveUserDialog(row.original)}
            className='hover:bg-red-100/75 hover:text-red-400'
            tooltip={t('tooltip.delete')}
          >
            <Trash2 size={17} strokeWidth={1.5} />
          </TableButton>
          <div className='px-1'>
            <Separator orientation='vertical' className='h-5 w-[1px]' />
          </div>
          <TableButton
            callback={() => navigate(`/email/user/${row.original._id}`)}
            className='hover:bg-purple-100/75 hover:text-purple-400'
            disabled={!row.original.email}
            tooltip={t('tooltip.sendEmail')}
          >
            {!row.original.email ? <MailX size={17} strokeWidth={1.5} /> : <Mail size={17} strokeWidth={1.5} />}
          </TableButton>
          <TableButton
            callback={() => navigate(`/whatsapp/${row.original._id}`, { state: { type: EUserType.USER, template: EWhatsappTemplate.EMPTY } })}
            className='hover:bg-emerald-100/75 hover:text-emerald-400'
            tooltip={t('tooltip.sendMessage')}
          >
            <MessageCircle size={17} strokeWidth={1.5} />
          </TableButton>
        </div>
      ),
    },
  ];

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
  });

  const handleRowClick = useCallback(
    (row: Row<IUser>, cell: Cell<IUser, unknown>): void => {
      if (cell.column.getIndex() < row.getAllCells().length - 1) navigate(`/users/${row.original._id}`);
    },
    [navigate],
  );

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
                  <TableRow key={headerGroup.id} className='border-t bg-slate-50 text-[11px] font-medium text-slate-500'>
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
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className='hover:bg-slate-50/70'>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className={`px-0 py-1 ${cell.column.id !== 'actions' && 'hover:cursor-pointer'}`}
                        onClick={() => handleRowClick(row, cell)}
                        key={cell.id}
                        style={{ width: `${cell.column.getSize()}px` }}
                      >
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
