// Icons: https://lucide.dev/icons/
import { ArrowDownUp, FileText, Trash2 } from 'lucide-react';
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
import { DateTime } from '@core/components/common/DateTime';
import { Id } from '@core/components/common/ui/Id';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { Pagination } from '@core/components/common/Pagination';
import { StatusSelect } from '@appointments/components/common/StatusSelect';
import { TableButton } from '@core/components/common/TableButton';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IAppointment } from '@appointments/interfaces/appointment.interface';
import type { IAppointmentSearch } from '@appointments/interfaces/appointment-search.interface';
import type { IDataTableAppointments, ITableManager } from '@core/interfaces/table.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { APPO_CONFIG } from '@config/appointments/appointments.config';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useMediaQuery } from '@core/hooks/useMediaQuery';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Interface
interface IVariables {
  itemsPerPage: number;
  search: IAppointmentSearch[];
  skipItems: number;
  sorting: SortingState;
}
// Default values for pagination and sorting
const defaultSorting: SortingState = [{ id: APPO_CONFIG.table.defaultSortingId, desc: APPO_CONFIG.table.defaultSortingType }];
const defaultPagination: PaginationState = { pageIndex: 0, pageSize: APPO_CONFIG.table.defaultItemsPerPage };
// React component
export function ApposDataTable({ search }: IDataTableAppointments) {
  const [appointmentSelected, setAppointmentSelected] = useState<IAppointment>({} as IAppointment);
  const [columns, setColumns] = useState<ColumnDef<IAppointment>[]>([]);
  const [data, setData] = useState<IAppointment[]>([]);
  const [errorRemoving, setErrorRemoving] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [tableManager, setTableManager] = useState<ITableManager>({ sorting, pagination });
  const [totalItems, setTotalItems] = useState<number>(0);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const isFirstFetch = useRef<boolean>(true);
  const isFirstTableManager = useRef<boolean>(true);
  const navigate = useNavigate();
  const prevDeps = useRef<{ search: IAppointmentSearch[]; tableManager: ITableManager }>({ search, tableManager });
  const { i18n, t } = useTranslation();

  // Fetch appointments
  const {
    data: response,
    error,
    isError,
    isPending: isLoading,
    mutate: fetchData,
  } = useMutation<IResponse<IAppointment[]>, Error, IVariables>({
    mutationKey: ['appointments', search, tableManager],
    mutationFn: async ({ search, sorting, skipItems, itemsPerPage }: IVariables) => {
      return await AppointmentApiService.findSearch(search, sorting, skipItems, itemsPerPage);
    },
    onSuccess: (response: IResponse) => {
      if (response.statusCode === 200) {
        if (response.data.length === 0) addNotification({ type: 'error', message: response.message });
        setData(response.data.data);
        setColumns(tableColumns);
        setTotalItems(response.data.count);
      }
    },
    onError: (error: Error) => {
      addNotification({ type: 'error', message: error.message });
    },
  });

  useEffect(() => {
    if (isFirstFetch.current) {
      isFirstFetch.current = false;
      return;
    } else {
      let skipItems: number;

      if (prevDeps.current.search !== search) {
        setPagination(defaultPagination);
        prevDeps.current.search = search;
        skipItems = 0;
      } else {
        skipItems = tableManager.pagination.pageIndex * tableManager.pagination.pageSize;
      }

      fetchData({ search, sorting: tableManager.sorting, skipItems, itemsPerPage: tableManager.pagination.pageSize });
    }
  }, [search, tableManager, fetchData]);

  // Table column visibility
  const isSmallDevice = useMediaQuery('only screen and (max-width : 639px)');
  const isMediumDevice = useMediaQuery('only screen and (max-width : 767px)');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    identityCard: !isSmallDevice,
    index: !isSmallDevice,
    professional: !isMediumDevice,
  });

  // Table manager
  const table: ITable<IAppointment> = useReactTable({
    columns: columns,
    data: data ?? [],
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
      columnVisibility,
      sorting,
      pagination,
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    setColumnVisibility({
      professional: !isMediumDevice,
      index: !isSmallDevice,
      identityCard: !isSmallDevice,
    });
  }, [isMediumDevice, isSmallDevice]);

  useEffect(() => {
    if (isFirstTableManager.current) {
      isFirstTableManager.current = false;
      return;
    } else {
      setTableManager({
        sorting: sorting,
        pagination: pagination,
      });
    }
  }, [sorting, pagination]);

  const tableColumns: ColumnDef<IAppointment>[] = useMemo(
    () => [
      {
        accessorKey: 'index',
        size: 30,
        header: () => <div className='text-center'>{t(APPO_CONFIG.table.header[0])}</div>,
        cell: ({ row }) => <Id id={row.original._id} />,
      },
      {
        accessorKey: 'date',
        header: () => <div className='text-center uppercase'>{t(APPO_CONFIG.table.header[1])}</div>,
        cell: ({ row }) => (
          <div className='text-center'>
            <DateTime day={row.original.day} hour={row.original.hour} className='!text-xs' />
          </div>
        ),
      },
      {
        accessorKey: 'user',
        header: ({ column }) => (
          <div className='text-center'>
            <button
              className='flex items-center gap-2 uppercase hover:text-accent-foreground'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {t(APPO_CONFIG.table.header[2])}
              <ArrowDownUp size={12} strokeWidth={2} />
            </button>
          </div>
        ),
        cell: ({ row }) => (
          <Button variant='link-table' size='xs' className='!text-xsm' onClick={() => navigate(`/users/${row.original.user._id}`)}>
            {UtilsString.upperCase(`${row.original.user.firstName} ${row.original.user.lastName}`, 'each')}
          </Button>
        ),
      },
      {
        accessorKey: 'identityCard',
        header: ({ column }) => (
          <div className='text-left'>
            <button
              className='flex items-center gap-2 uppercase hover:text-accent-foreground'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {t(APPO_CONFIG.table.header[3])}
              <ArrowDownUp size={12} strokeWidth={2} />
            </button>
          </div>
        ),
        cell: ({ row }) => (
          <div className='text-left text-muted-foreground'>{i18n.format(row.original.user.dni, 'number', i18n.resolvedLanguage)}</div>
        ),
      },
      {
        accessorKey: 'professional',
        header: ({ column }) => (
          <div className='text-center'>
            <button
              className='flex items-center gap-2 uppercase hover:text-accent-foreground'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {t(APPO_CONFIG.table.header[4])}
              <ArrowDownUp size={12} strokeWidth={2} />
            </button>
          </div>
        ),
        cell: ({ row }) => (
          <div className='text-left text-muted-foreground'>
            {UtilsString.upperCase(
              `${row.original.professional.title.abbreviation} ${row.original.professional.firstName} ${row.original.professional.lastName}`,
              'each',
            )}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        size: 60,
        header: () => <div className='text-center uppercase'>{t(APPO_CONFIG.table.header[5])}</div>,
        cell: ({ row }) => <StatusSelect appointment={row.original} mode='update' className='mx-auto h-5 w-5' />,
      },
      {
        accessorKey: 'actions',
        size: 100,
        header: () => <div className='text-center uppercase'>{t(APPO_CONFIG.table.header[6])}</div>,
        cell: ({ row }) => (
          <div className='mx-auto flex w-fit flex-row items-center justify-center space-x-2'>
            <TableButton callback={() => navigate(`/appointments/${row.original._id}`)} className='hover:text-sky-500' tooltip={t('tooltip.details')}>
              <FileText size={16} strokeWidth={1.5} />
            </TableButton>
            <TableButton callback={() => handleRemoveAppointmentDialog(row.original)} className='hover:text-rose-500' tooltip={t('tooltip.delete')}>
              <Trash2 size={16} strokeWidth={1.5} />
            </TableButton>
          </div>
        ),
      },
    ],
    [i18n, navigate, t],
  );

  // Actions
  function handleRemoveAppointmentDialog(appointment: IAppointment): void {
    setOpenDialog(true);
    setAppointmentSelected(appointment);
  }

  function handleRemoveAppointment(id: string): void {
    console.log('Appointment to remove: ', id);
    setIsRemoving(true);
    setErrorRemoving(false);
  }

  // Render
  if (isError) {
    return <InfoCard type='error' text={t(error.message)} className='mt-6' />;
  }

  if (isLoading) {
    return <LoadingDB text={t('loading.users')} className='mt-6' />;
  }

  return (
    <main className='mt-6'>
      {/* Section: Data table */}
      {table.getRowModel().rows?.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='border-t bg-slate-50 text-[11px] font-medium text-slate-500'>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className='px-1'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className='text-xsm'>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className='p-1' key={cell.id} style={{ width: `${cell.column.getSize()}px` }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            className='pt-4 !text-xsm text-slate-400'
            itemsPerPage={APPO_CONFIG.table.itemsPerPage}
            pagination={pagination}
            setPagination={setPagination}
            table={table}
          />
        </>
      ) : (
        <InfoCard type='warning' text={response?.message} />
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
                  {/* <InfoCard text={errorRemovingContent.text} type={errorRemovingContent.type} /> */}
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
                        firstName: UtilsString.upperCase(appointmentSelected.user?.firstName, 'each'),
                        lastName: UtilsString.upperCase(appointmentSelected.user?.lastName, 'each'),
                        identityCard: i18n.format(appointmentSelected.user?.dni, 'number', i18n.resolvedLanguage),
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
                    <Button variant='remove' size='sm' onClick={() => handleRemoveAppointment(appointmentSelected._id)}>
                      {isRemoving ? <LoadingDB text={t('loading.deleting')} variant='button' /> : t('button.deleteUser')}
                    </Button>
                  </footer>
                </>
              )}
            </section>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
