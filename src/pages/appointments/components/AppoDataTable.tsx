// Icons: https://lucide.dev/icons/
import { ArrowDownUp, FileText, PencilLine, Trash2 } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
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
import { TableButton } from '@core/components/common/TableButton';
import { DateTime } from '@core/components/common/DateTime';
import { Pagination } from '@core/components/common/Pagination';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IAppointment } from '@appointments/interfaces/appointment.interface';
import type { IDataTableAppointments, ITableManager } from '@core/interfaces/table.interface';
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { APPO_CONFIG } from '@config/appointments/appointments.config';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { EAppointmentSearch, type IAppointmentSearch } from '@appointments/interfaces/appointment-search.interface';
import { UserApiService } from '@users/services/user-api.service';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useDelimiter } from '@core/hooks/useDelimiter';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { useTruncateText } from '@core/hooks/useTruncateText';
// Default values for pagination and sorting
const defaultSorting: SortingState = [{ id: APPO_CONFIG.table.defaultSortingId, desc: APPO_CONFIG.table.defaultSortingType }];
const defaultPagination: PaginationState = { pageIndex: 0, pageSize: APPO_CONFIG.table.defaultItemsPerPage };
// React component
export function ApposDataTable({ search, reload, setReload, setErrorMessage, help }: IDataTableAppointments) {
  const [columns, setColumns] = useState<ColumnDef<IAppointment>[]>([]);
  const [data, setData] = useState<IAppointment[]>([]);
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
  const prevDeps = useRef<{ search: any; tableManager: ITableManager }>({ search, tableManager });
  const truncate = useTruncateText();
  const { i18n, t } = useTranslation();

  const tableColumns: ColumnDef<IAppointment>[] = [
    {
      accessorKey: 'index',
      size: 50,
      header: () => <div className='text-center'>{t(APPO_CONFIG.table.header[0])}</div>,
      cell: ({ row }) => (
        <div className='mx-auto w-fit rounded-md bg-slate-100 px-1.5 py-1 text-center text-xs text-slate-400'>{truncate(row.original._id, -3)}</div>
      ),
    },
    {
      accessorKey: 'date',
      size: 50,
      header: () => <div className='text-center'>{t(APPO_CONFIG.table.header[1])}</div>,
      cell: ({ row }) => (
        <div className='mx-auto'>
          <DateTime day={row.original.day} hour={row.original.hour} />
        </div>
      ),
    },
    {
      accessorKey: 'user',
      header: ({ column }) => (
        <div className='text-left'>
          <button
            className='flex items-center gap-2 hover:text-accent-foreground'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t(APPO_CONFIG.table.header[2])}
            <ArrowDownUp size={12} strokeWidth={2} />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left'>{`${capitalize(row.original.user.firstName)} ${capitalize(row.original.user.lastName)}`}</div>,
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
            {t(APPO_CONFIG.table.header[3])}
            <ArrowDownUp size={12} strokeWidth={2} />
          </button>
        </div>
      ),
      cell: ({ row }) => <div className='text-left'>{i18n.format(row.original.user.dni, 'number', i18n.resolvedLanguage)}</div>,
    },
    {
      accessorKey: 'professional',
      size: 80,
      header: ({ column }) => (
        <div className='text-center'>
          <button
            className='flex items-center gap-2 hover:text-accent-foreground'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t(APPO_CONFIG.table.header[4])}
            <ArrowDownUp size={12} strokeWidth={2} />
          </button>
        </div>
      ),
      cell: ({ row }) => (
        <div className='text-left text-sm'>
          {capitalize(`${row.original.professional.title.abbreviation} ${row.original.professional.firstName} ${row.original.professional.lastName}`)}
        </div>
      ),
    },
    {
      accessorKey: 'actions',
      size: 100,
      header: () => <div className='text-center'>{t(APPO_CONFIG.table.header[5])}</div>,
      cell: ({ row }) => (
        <div className='mx-auto flex w-fit flex-row items-center justify-center space-x-2'>
          <TableButton
            callback={() => navigate(`/users/${row.original._id}`)}
            className='hover:text-sky-500'
            help={help}
            tooltip={t('tooltip.details')}
          >
            <FileText size={16} strokeWidth={1.5} />
          </TableButton>
          <TableButton
            callback={() => navigate(`/users/update/${row.original._id}`)}
            className='hover:text-fuchsia-500'
            help={help}
            tooltip={t('tooltip.edit')}
          >
            <PencilLine size={16} strokeWidth={1.5} />
          </TableButton>
          <TableButton
            // callback={() => handleRemoveUserDialog(row.original)}
            callback={() => console.log(row.original)}
            className='hover:text-rose-500'
            help={help}
            tooltip={t('tooltip.delete')}
          >
            <Trash2 size={16} strokeWidth={1.5} />
          </TableButton>
        </div>
      ),
    },
  ];

  const table: ITable<IAppointment> = useReactTable({
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
    const fetchData = (search: IAppointmentSearch, sorting: SortingState, itemsPerPage: number) => {
      console.log('search on fetch', search);
      setIsLoading(true);

      let skipItems: number;

      if (prevDeps.current.search.value !== search.value) {
        setPagination(defaultPagination);
        prevDeps.current.search = search;
        skipItems = 0;
      } else {
        skipItems = tableManager.pagination.pageIndex * tableManager.pagination.pageSize;
      }

      if (search.type === EAppointmentSearch.NAME) {
        AppointmentApiService.findSearch(search.value, sorting, skipItems, itemsPerPage)
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
              console.log(response);
            }
            if (response.statusCode > 399) {
              setErrorMessage(response.message);
              addNotification({ type: 'warning', message: response.message });
              setInfoCardContent({ type: 'error', text: response.message });
            }
            if (response instanceof Error) {
              addNotification({ type: 'error', message: t('error.internalServer') });
              setInfoCardContent({ type: 'error', text: t('error.internalServer') });
            }
          })
          .finally(() => setIsLoading(false));
      }
      if (search.type === EAppointmentSearch.DNI) {
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
              addNotification({ type: 'error', message: t('error.internalServer') });
              setInfoCardContent({ type: 'error', text: t('error.internalServer') });
            }
          })
          .finally(() => setIsLoading(false));
      }
    };
    fetchData(search, tableManager.sorting, tableManager.pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tableManager]);

  // function handleRemoveUserDialog(user: IUser): void {
  //   setOpenDialog(true);
  //   setUserSelected(user);
  // }

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
          setErrorRemovingContent({ type: 'error', text: t('error.internalServer') });
          addNotification({ type: 'error', message: t('error.internalServer') });
        }
      })
      .finally(() => setIsRemoving(false));
  }

  return (
    <>
      {isLoading ? (
        <LoadingDB text={t('loading.users')} className='mt-6' />
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
          {JSON.stringify(pagination)}
          <Pagination
            className='pt-6 !text-xsm text-slate-400'
            help={help}
            itemsPerPage={APPO_CONFIG.table.itemsPerPage}
            pagination={pagination}
            setPagination={setPagination}
            table={table}
          />
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
                  <div className='text-sm'>
                    <Trans
                      i18nKey='dialog.deleteUser.content'
                      values={{
                        firstName: capitalize(userSelected.firstName),
                        lastName: capitalize(userSelected.lastName),
                        identityCard: i18n.format(userSelected.dni, 'number', i18n.resolvedLanguage),
                      }}
                      components={{
                        span: <span className='font-semibold' />,
                        i: <i />,
                      }}
                    />
                  </div>
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
