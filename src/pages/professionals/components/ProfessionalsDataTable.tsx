// Icons: https://lucide.dev/icons/
import { ArrowDownUp, FileText, PencilLine, Trash2 } from 'lucide-react';
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
import { AvailableProfessional } from '@professionals/components/common/AvailableProfessional';
import { DBCountProfessionals } from '@professionals/components/common/DBCountProfessionals';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { Pagination } from '@core/components/common/Pagination';
import { TableButton } from '@core/components/common/TableButton';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IDataTableProfessionals, ITableManager } from '@core/interfaces/table.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IProfessionalSearch } from '@professionals/interfaces/professional-search.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { EProfessionalSearch } from '@professionals/enums/professional-search.enum';
import { PROFESSIONALS_CONFIG as PROF_CONFIG } from '@config/professionals/professionals.config';
import { PROFESSIONAL_VIEW_CONFIG as PV_CONFIG } from '@config/professionals/professional-view.config';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
import { useTruncateText } from '@core/hooks/useTruncateText';
// Interfaces
interface IProfessionalsData {
  count: number;
  data: IProfessional[];
  total: number;
}

interface IVars {
  search: IProfessionalSearch;
  skipItems: number;
  tableManager: ITableManager;
}
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
  const prevDeps = useRef<IVars>({ search, skipItems, tableManager });
  const truncate = useTruncateText();
  const { i18n, t } = useTranslation();

  // Fetch professionals
  const {
    data,
    error,
    mutate: searchProfessionalsBy,
    isError,
    isPending,
    isSuccess,
  } = useMutation<IResponse<IProfessionalsData>, Error, IVars>({
    mutationKey: ['searchProfessionalsBy', search, tableManager, skipItems],
    mutationFn: async ({ search, skipItems, tableManager }) => await ProfessionalApiService.searchProfessionalsBy(search, tableManager, skipItems),
    onSuccess: (response) => {
      setColumns(tableColumns);
      setTotalItems(response.data.count);
    },
    onError: (error) => {
      addNotification({ type: 'error', message: error.message });
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
        header: () => <div className='text-center'>{t(PROF_CONFIG.table.header[0])}</div>,
        cell: ({ row }) => (
          <div className='mx-auto w-fit rounded-md bg-slate-100 px-1.5 py-1 text-center text-xs text-slate-400'>{truncate(row.original._id, -3)}</div>
        ),
      },
      {
        accessorKey: 'lastName',
        header: ({ column }) => (
          <div className='text-left'>
            {totalItems === 1 ? (
              t(PROF_CONFIG.table.header[1])
            ) : (
              <TooltipWrapper tooltip={t('tooltip.sort.name')}>
                <button
                  className='flex items-center gap-2 hover:text-accent-foreground'
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
            {UtilsString.upperCase(`${row.original.title.abbreviation} ${row.original.firstName} ${row.original.lastName}`, 'each')}
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
                  className='flex items-center gap-2 hover:text-accent-foreground'
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                  {t(PROF_CONFIG.table.header[2])}
                  <ArrowDownUp size={12} strokeWidth={2} />
                </button>
              </TooltipWrapper>
            )}
          </div>
        ),
        cell: ({ row }) => <div className='text-left'>{UtilsString.upperCase(row.original.area.name)}</div>,
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
                  className='flex items-center gap-2 hover:text-accent-foreground'
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                  {t(PROF_CONFIG.table.header[3])}
                  <ArrowDownUp size={12} strokeWidth={2} />
                </button>
              </TooltipWrapper>
            )}
          </div>
        ),
        cell: ({ row }) => <div className='text-left text-sm'>{UtilsString.upperCase(row.original.specialization.name)}</div>,
      },
      {
        accessorKey: 'available',
        size: 50,
        header: ({ column }) => (
          <div className='flex justify-center'>
            {totalItems === 1 ? (
              t(PROF_CONFIG.table.header[4])
            ) : (
              <TooltipWrapper tooltip={t('tooltip.sort.availability')}>
                <button
                  className='flex items-center gap-2 hover:text-accent-foreground'
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
          <section className='flex flex-row items-center justify-center'>
            <AvailableProfessional className='h-6' data={{ _id: row.original._id, available: row.original.available }} items={PV_CONFIG.select} />
          </section>
        ),
      },
      {
        accessorKey: 'actions',
        size: 100,
        header: () => <div className='text-center'>{t(PROF_CONFIG.table.header[5])}</div>,
        cell: ({ row }) => (
          <div className='mx-auto flex w-fit flex-row items-center justify-center space-x-2'>
            <TableButton
              callback={() => navigate(`/professionals/${row.original._id}`)}
              className='hover:text-sky-500'
              tooltip={t('tooltip.details')}
            >
              <FileText size={16} strokeWidth={1.5} />
            </TableButton>
            <TableButton
              callback={() => navigate(`/professionals/update/${row.original._id}`)}
              className='hover:text-fuchsia-500'
              tooltip={t('tooltip.delete')}
            >
              <PencilLine size={16} strokeWidth={1.5} />
            </TableButton>
            <TableButton callback={() => handleRemoveDialog(row.original)} className='hover:text-rose-500' tooltip={t('tooltip.edit')}>
              <Trash2 size={16} strokeWidth={1.5} />
            </TableButton>
            <TableButton
              callback={() => navigate(`/whatsapp/professional/${row.original._id}`)}
              className='hover:fill-green-500'
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
    [navigate, t, totalItems, truncate],
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
  } = useMutation<IResponse<IProfessional>, Error, { id: string }>({
    mutationKey: ['deleteProfessional', professionalSelected?._id],
    mutationFn: async ({ id }) => await ProfessionalApiService.remove(id),
    onSuccess: (response) => {
      setOpenDialog(false);
      addNotification({ type: 'success', message: response.message });
      searchProfessionalsBy({ search, skipItems, tableManager });
    },
    onError: (error) => {
      addNotification({ type: 'error', message: t(error.message) });
    },
    retry: 1,
  });

  function handleRemoveProfessionalDatabase(id?: string): void {
    id && deleteProfessional({ id });
  }

  useEffect(() => {
    !openDialog && setProfessionalSelected(undefined);
  }, [openDialog]);

  if (isPending) return <LoadingDB text={t('loading.professionals')} className='mt-6 p-0' />;
  if (isError) return <InfoCard text={error.message} type='error' className='mt-6' />;

  if (isSuccess) {
    return (
      <>
        {/* Section: Data table */}
        {table.getRowModel().rows?.length > 0 && (
          <>
            <DBCountProfessionals />
            <Table>
              <TableHeader className='bg-slate-100'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className='h-10'>
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
                <InfoCard text={errorDeleting.message} type='error' />
              ) : (
                <div className='text-sm'>
                  <Trans
                    i18nKey='dialog.deleteProfessional.content'
                    values={{
                      titleAbbreviation: UtilsString.upperCase(professionalSelected?.title?.abbreviation),
                      firstName: UtilsString.upperCase(professionalSelected?.firstName, 'each'),
                      lastName: UtilsString.upperCase(professionalSelected?.lastName, 'each'),
                      identityCard: i18n.format(professionalSelected?.dni, 'number', i18n.resolvedLanguage),
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
