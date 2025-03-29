// Icons: https://lucide.dev/icons/
import { ArrowDownUp, Mail, MailX, MessageCircle, PencilLine, Trash2 } from 'lucide-react';
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
  type Cell,
  type ColumnDef,
  type PaginationState,
  type Row,
  type SortingState,
  type Table as ITable,
  useReactTable,
} from '@tanstack/react-table';
// Components
import { AvailableProfessional } from '@professionals/components/common/AvailableProfessional';
import { DBCountProfessionals } from '@professionals/components/common/DBCountProfessionals';
import { Id } from '@core/components/common/ui/Id';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { Pagination } from '@core/components/common/Pagination';
import { TableButton } from '@core/components/common/TableButton';
import { TableButtonGroup } from '@core/components/common/TableButtonGroup';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { AxiosError } from 'axios';
import { Trans, useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IDataTableProfessionals, ITableManager } from '@core/interfaces/table.interface';
import type { IPaginatedProfessionalsVars } from '@professionals/interfaces/mutation-vars.interface';
import type { IProfessional, IProfessionalsData } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { APP_CONFIG } from '@config/app.config';
import { EProfessionalSearch } from '@professionals/enums/professional-search.enum';
import { EUserType } from '@core/enums/user-type.enum';
import { EWhatsappTemplate } from '@whatsapp/enums/template.enum';
import { PROFESSIONALS_CONFIG as PROF_CONFIG } from '@config/professionals/professionals.config';
import { PROFESSIONAL_VIEW_CONFIG as PV_CONFIG } from '@config/professionals/professional-view.config';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useMediaQuery } from '@core/hooks/useMediaQuery';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Default values for pagination and sorting
const defaultSorting: SortingState = [{ id: PROF_CONFIG.table.defaultSortingId, desc: PROF_CONFIG.table.defaultSortingType }];
const defaultPagination: PaginationState = { pageIndex: 0, pageSize: PROF_CONFIG.table.defaultPageSize };
// React component
export function ProfessionalsDataTable({ clearDropdown, reload, search }: IDataTableProfessionals) {
  const [columns, setColumns] = useState<ColumnDef<IProfessional>[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [professionalSelected, setProfessionalSelected] = useState<IProfessional | undefined>(undefined);
  const [skipItems, setSkipItems] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [tableManager, setTableManager] = useState<ITableManager>({ sorting, pagination });
  const [totalItems, setTotalItems] = useState<number>(0);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const firstUpdate = useRef<boolean>(true);
  const navigate = useNavigate();
  const prevDeps = useRef<IPaginatedProfessionalsVars>({ search, skipItems, tableManager });
  const { i18n, t } = useTranslation();

  // Table column visibility
  const isSmallDevice = useMediaQuery('only screen and (max-width : 639px)');
  const isMediumDevice = useMediaQuery('only screen and (max-width : 767px)');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    area: !isMediumDevice,
    available: !isMediumDevice,
    specialization: !isSmallDevice,
  });

  useEffect(() => {
    setColumnVisibility({
      area: !isMediumDevice,
      available: !isMediumDevice,
      specialization: !isSmallDevice,
    });
  }, [isMediumDevice, isSmallDevice]);

  // Fetch professionals
  const {
    data,
    error,
    mutate: searchProfessionalsBy,
    isError,
    isPending,
    isSuccess,
  } = useMutation<IResponse<IProfessionalsData>, AxiosError<IResponse>, IPaginatedProfessionalsVars>({
    mutationKey: ['searchProfessionalsBy', search, tableManager, skipItems],
    mutationFn: async ({ search, skipItems, tableManager }) => await ProfessionalApiService.searchProfessionalsBy(search, tableManager, skipItems),
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
      searchProfessionalsBy({ search, skipItems, tableManager });
    } else {
      searchProfessionalsBy({ search: { type: EProfessionalSearch.INPUT, value: '' }, skipItems, tableManager });
    }
  }, [search, searchProfessionalsBy, skipItems, tableManager]);

  // Table manager
  const table: ITable<IProfessional> = useReactTable({
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
    if (search.type === EProfessionalSearch.DROPDOWN) clearDropdown();
    setSorting(defaultSorting);
    setPagination(defaultPagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const tableColumns: ColumnDef<IProfessional>[] = useMemo(
    () => [
      {
        accessorKey: 'index',
        size: 50,
        header: () => <div className='text-center uppercase'>{t(PROF_CONFIG.table.header[0])}</div>,
        cell: ({ row }) => <Id id={row.original._id} />,
      },
      {
        accessorKey: 'fullName',
        header: ({ column }) => (
          <div className='text-left'>
            {totalItems === 1 ? (
              t(PROF_CONFIG.table.header[1])
            ) : (
              <TooltipWrapper tooltip={t('tooltip.sort.name')}>
                <button
                  className='flex items-center gap-2 uppercase hover:text-accent-foreground'
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                  {t(PROF_CONFIG.table.header[1])}
                  <ArrowDownUp size={12} strokeWidth={2} />
                </button>
              </TooltipWrapper>
            )}
          </div>
        ),
        cell: ({ row }) => (
          <div className='text-left'>
            {UtilsString.upperCase(`${row.original.title.abbreviation} ${row.original.lastName}, ${row.original.firstName}`, 'each')}
          </div>
        ),
      },
      {
        accessorKey: 'area',
        size: 80,
        header: ({ column }) => (
          <div className='text-left'>
            {totalItems === 1 ? (
              t(PROF_CONFIG.table.header[2])
            ) : (
              <TooltipWrapper tooltip={t('tooltip.sort.area')}>
                <button
                  className='flex items-center gap-2 uppercase hover:text-accent-foreground'
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                  {t(PROF_CONFIG.table.header[2])}
                  <ArrowDownUp size={12} strokeWidth={2} />
                </button>
              </TooltipWrapper>
            )}
          </div>
        ),
        cell: ({ row }) => <div className='text-left text-xsm text-muted-foreground'>{UtilsString.upperCase(row.original.area.name)}</div>,
      },
      {
        accessorKey: 'specialization',
        size: 80,
        header: ({ column }) => (
          <div className='flex justify-center'>
            {totalItems === 1 ? (
              t(PROF_CONFIG.table.header[3])
            ) : (
              <TooltipWrapper tooltip={t('tooltip.sort.specialty')}>
                <button
                  className='flex items-center gap-2 uppercase hover:text-accent-foreground'
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                  {t(PROF_CONFIG.table.header[3])}
                  <ArrowDownUp size={12} strokeWidth={2} />
                </button>
              </TooltipWrapper>
            )}
          </div>
        ),
        cell: ({ row }) => <div className='text-left text-xsm text-muted-foreground'>{UtilsString.upperCase(row.original.specialization.name)}</div>,
      },
      {
        accessorKey: 'available',
        size: 30,
        header: ({ column }) => (
          <div className='flex justify-center'>
            {totalItems === 1 ? (
              t(PROF_CONFIG.table.header[4])
            ) : (
              <TooltipWrapper tooltip={t('tooltip.sort.availability')}>
                <button
                  className='flex items-center gap-2 uppercase hover:text-accent-foreground'
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                  {t(PROF_CONFIG.table.header[4])}
                  <ArrowDownUp size={12} strokeWidth={2} />
                </button>
              </TooltipWrapper>
            )}
          </div>
        ),
        cell: ({ row }) => (
          <section className='flex flex-row items-center'>
            <AvailableProfessional
              className='h-6 text-xsm text-muted-foreground'
              data={{ _id: row.original._id, available: row.original.available }}
              items={PV_CONFIG.select}
            />
          </section>
        ),
      },
      {
        accessorKey: 'actions',
        size: 100,
        header: () => <div className='text-center uppercase'>{t(PROF_CONFIG.table.header[5])}</div>,
        cell: ({ row }) => (
          <div className='mx-auto flex w-fit flex-row items-center justify-center space-x-0.5 md:space-x-2'>
            <TableButton
              callback={() => navigate(`${APP_CONFIG.appPrefix}/professionals/update/${row.original._id}`)}
              className='hover:bg-amber-100/75 hover:text-amber-400'
              tooltip={t('tooltip.edit')}
            >
              <PencilLine size={17} strokeWidth={1.5} />
            </TableButton>
            <TableButton
              callback={() => handleRemoveDialog(row.original)}
              className='hover:bg-red-100/75 hover:text-red-400'
              tooltip={t('tooltip.delete')}
            >
              <Trash2 size={17} strokeWidth={1.5} />
            </TableButton>
            <TableButtonGroup
              buttons={
                <>
                  <TableButton
                    callback={() => navigate(`${APP_CONFIG.appPrefix}/email/professional/${row.original._id}`)}
                    className='hover:bg-purple-100/75 hover:text-purple-400'
                    disabled={!row.original.email}
                    tooltip={t('tooltip.sendEmail')}
                  >
                    {!row.original.email ? <MailX size={17} strokeWidth={1.5} /> : <Mail size={17} strokeWidth={1.5} />}
                  </TableButton>
                  <TableButton
                    callback={() =>
                      navigate(`${APP_CONFIG.appPrefix}/whatsapp/${row.original._id}`, {
                        state: { type: EUserType.PROFESSIONAL, template: EWhatsappTemplate.EMPTY },
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
    ],
    [navigate, t, totalItems],
  );

  // Actions
  function handleRemoveDialog(professional: IProfessional): void {
    setOpenDialog(true);
    setProfessionalSelected(professional);
  }

  const {
    error: errorDeleting,
    mutate: deleteProfessional,
    isError: isErrorDeleting,
    isPending: isPendingDelete,
  } = useMutation<IResponse<IProfessional>, AxiosError<IResponse>, { id: string }>({
    mutationKey: ['deleteProfessional', professionalSelected?._id],
    mutationFn: async ({ id }) => await ProfessionalApiService.remove(id),
    onSuccess: (response) => {
      setOpenDialog(false);
      addNotification({ type: 'success', message: response.message });
      searchProfessionalsBy({ search, skipItems, tableManager });
    },
    onError: (error: AxiosError<IResponse>) => {
      addNotification({ type: 'error', message: error.response?.data.message });
    },
  });

  const handleRowClick = useCallback(
    (row: Row<IProfessional>, cell: Cell<IProfessional, unknown>): void => {
      if (cell.column.getIndex() < row.getAllCells().length - 1) navigate(`${APP_CONFIG.appPrefix}/professionals/${row.original._id}`);
    },
    [navigate],
  );

  function handleRemoveProfessionalDatabase(id?: string): void {
    id && deleteProfessional({ id });
  }

  useEffect(() => {
    !openDialog && setProfessionalSelected(undefined);
  }, [openDialog]);

  if (isPending) return <LoadingDB text={t('loading.professionals')} className='mt-6 p-0' />;
  if (isError)
    return <InfoCard className='mt-6' text={error.response?.data.message} variant={error.response?.status === 404 ? 'warning' : 'error'} />;

  if (isSuccess) {
    return (
      <>
        {/* Section: Data table */}
        {table.getRowModel().rows?.length > 0 && (
          <>
            <DBCountProfessionals />
            <Table>
              <TableHeader className='border-t bg-slate-50 text-[11px] font-medium text-slate-500'>
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
              <TableBody className='text-xsm'>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className='hover:bg-slate-50/70'>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className={`px-0 py-1 ${cell.column.id !== 'actions' && cell.column.id !== 'available' && 'hover:cursor-pointer'}`}
                        key={cell.id}
                        onClick={() => {
                          if (cell.column.id !== 'actions' && cell.column.id !== 'available') handleRowClick(row, cell);
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
              itemsPerPage={PROF_CONFIG.table.itemsPerPage}
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
              <DialogTitle className='text-xl'>{t('dialog.deleteProfessional.title')}</DialogTitle>
              {isErrorDeleting ? (
                <DialogDescription></DialogDescription>
              ) : (
                <DialogDescription>{t('dialog.deleteProfessional.description')}</DialogDescription>
              )}
            </DialogHeader>
            <section className='flex flex-col'>
              {isErrorDeleting ? (
                <InfoCard text={errorDeleting.message} variant='error' />
              ) : (
                <div className='text-sm'>
                  <Trans
                    i18nKey='dialog.deleteProfessional.content'
                    values={{
                      titleAbbreviation: UtilsString.upperCase(professionalSelected?.title?.abbreviation),
                      firstName: UtilsString.upperCase(professionalSelected?.firstName, 'each'),
                      lastName: UtilsString.upperCase(professionalSelected?.lastName, 'each'),
                      identityCard: i18n.format(professionalSelected?.dni, 'integer', i18n.resolvedLanguage),
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
                  <Button variant='remove' size='sm' onClick={() => handleRemoveProfessionalDatabase(professionalSelected?._id)}>
                    {isPendingDelete ? <LoadingDB variant='button' text={t('loading.deleting')} /> : t('button.deleteProfessional')}
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
