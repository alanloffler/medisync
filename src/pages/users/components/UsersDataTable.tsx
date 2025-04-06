// Icons: https://lucide.dev/icons/
import { ArrowDownUp, CircleX, Mail, MailX, MessageCircle, PencilLine, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
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
import { TableButtonGroup } from '@core/components/common/TableButtonGroup';
// External imports
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IAreaCode } from '@core/interfaces/area-code.interface';
import type { IDataTableUsers, ITableManager } from '@core/interfaces/table.interface';
import type { IPaginatedUsersVars } from '@users/interfaces/mutation-vars.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser, IUsersData } from '@users/interfaces/user.interface';
import { APP_CONFIG } from '@config/app.config';
import { AreaCodeService } from '@core/services/area-code.service';
import { ERole } from '@core/auth/enums/role.enum';
import { EUserSearch } from '@users/enums/user-search.enum';
import { EUserType } from '@core/enums/user-type.enum';
import { EWhatsappTemplate } from '@whatsapp/enums/template.enum';
import { USER_CONFIG } from '@config/users/users.config';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useAuth } from '@core/auth/useAuth';
import { useDelimiter } from '@core/hooks/useDelimiter';
import { useMediaQuery } from '@core/hooks/useMediaQuery';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { DialogDelete } from './common/DialogDelete';
import { DialogRemove } from './common/DialogRemove';
// Default values for pagination and sorting
const defaultSorting: SortingState = [{ id: USER_CONFIG.table.defaultSortingId, desc: USER_CONFIG.table.defaultSortingType }];
const defaultPagination: PaginationState = { pageIndex: 0, pageSize: USER_CONFIG.table.defaultPageSize };
// React component
export function UsersDataTable({ reload, search, setSearch }: IDataTableUsers) {
  const [columns, setColumns] = useState<ColumnDef<IUser>[]>([]);
  const [openDialogRemove, setOpenDialogRemove] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [skipItems, setSkipItems] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [tableManager, setTableManager] = useState<ITableManager>({ sorting, pagination });
  const [totalItems, setTotalItems] = useState<number>(0);
  const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<IUser | undefined>(undefined);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const delimiter = useDelimiter();
  const firstUpdate = useRef<boolean>(true);
  const navigate = useNavigate();
  const prevDeps = useRef<IPaginatedUsersVars>({ search, skipItems, tableManager });
  const { i18n, t } = useTranslation();
  const { user } = useAuth();

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
  } = useMutation<IResponse<IUsersData>, AxiosError<IResponse>, IPaginatedUsersVars>({
    mutationKey: ['users', 'search-users-by', search, tableManager, skipItems],
    mutationFn: async ({ search, skipItems, tableManager }) => await UserApiService.searchUsersBy(search, tableManager, skipItems),
    onSuccess: (response) => {
      setColumns(tableColumns);
      setTotalItems(response.data.count);
    },
    onError: (error: AxiosError<IResponse>) => {
      addNotification({ type: 'error', message: error.response?.data.message });
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
      cell: ({ row }) => (
        <div className='text-left text-xsm text-muted-foreground'>{i18n.format(row.original.dni, 'integer', i18n.resolvedLanguage)}</div>
      ),
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
          <span className='text-left text-xsm text-muted-foreground'>{`(${row.original.areaCode}) ${delimiter(row.original.phone, '-', 6)}`}</span>
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
            callback={() => navigate(`${APP_CONFIG.appPrefix}/users/update/${row.original._id}`)}
            className='hover:bg-amber-100/75 hover:text-amber-400'
            tooltip={t('tooltip.edit')}
          >
            <PencilLine size={17} strokeWidth={1.5} />
          </TableButton>
          <TableButton
            callback={() => {
              setUserSelected(row.original);
              setOpenDialogDelete(true);
            }}
            className='hover:bg-red-100/75 hover:text-red-400'
            tooltip={t('tooltip.delete')}
          >
            <Trash2 size={17} strokeWidth={1.5} />
          </TableButton>
          {user?.role === ERole.Super && (
            <TableButton
              callback={() => {
                setUserSelected(row.original);
                setOpenDialogRemove(true);
              }}
              className='hover:bg-red-100/75 hover:text-red-400 [&_svg]:fill-red-100/75 [&_svg]:stroke-red-400'
              tooltip='Caution deletion'
            >
              <CircleX size={17} strokeWidth={1.5} />
            </TableButton>
          )}
          <TableButtonGroup
            buttons={
              <>
                <TableButton
                  callback={() => navigate(`${APP_CONFIG.appPrefix}/email/user/${row.original._id}`)}
                  className='hover:bg-purple-100/75 hover:text-purple-400'
                  disabled={!row.original.email}
                  tooltip={t('tooltip.sendEmail')}
                >
                  {!row.original.email ? <MailX size={17} strokeWidth={1.5} /> : <Mail size={17} strokeWidth={1.5} />}
                </TableButton>
                <TableButton
                  callback={() =>
                    navigate(`${APP_CONFIG.appPrefix}/whatsapp/${row.original._id}`, {
                      state: { type: EUserType.USER, template: EWhatsappTemplate.EMPTY },
                    })
                  }
                  className='hover:bg-emerald-100/75 hover:text-emerald-400'
                  tooltip={t('tooltip.sendMessage')}
                >
                  <MessageCircle size={17} strokeWidth={1.5} />
                </TableButton>
              </>
            }
          />
        </div>
      ),
    },
  ];

  // Actions
  const handleRowClick = useCallback(
    (row: Row<IUser>, cell: Cell<IUser, unknown>): void => {
      if (cell.column.getIndex() < row.getAllCells().length - 1) navigate(`${APP_CONFIG.appPrefix}/users/${row.original._id}`);
    },
    [navigate],
  );

  useEffect(() => {
    !openDialogRemove && setUserSelected(undefined);
  }, [openDialogRemove]);

  if (isPending) return <LoadingDB text={t('loading.users')} className='mt-6 p-0' />;
  // TODO: conditional variant if search is empty (check backend)
  if (isError) return <InfoCard className='mt-6' text={error.response?.data.message} variant='error' />;

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
              <TableBody className='text-xsm'>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className='hover:bg-slate-50/70'>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className={`px-0 py-1 ${cell.column.id !== 'actions' && 'hover:cursor-pointer'}`}
                        key={cell.id}
                        onClick={() => {
                          if (cell.column.id !== 'actions') handleRowClick(row, cell);
                        }}
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
        {/* Section: Dialog Delete (soft remove) */}
        {userSelected && (
          <DialogDelete
            onDeleteSuccess={() => {
              searchUsersBy({
                search: search.value !== '' ? search : { value: '', type: EUserSearch.NAME },
                skipItems,
                tableManager,
              });
            }}
            open={openDialogDelete}
            setOpen={setOpenDialogDelete}
            user={userSelected}
          />
        )}
        {/* Section: Dialog Removed (hard remove) */}
        {userSelected && (
          <DialogRemove
            onRemoveSuccess={() => {
              searchUsersBy({
                search: search.value !== '' ? search : { value: '', type: EUserSearch.NAME },
                skipItems,
                tableManager,
              });
            }}
            open={openDialogRemove}
            setOpen={setOpenDialogRemove}
            userSelected={userSelected}
          />
        )}
      </>
    );
  }
}
