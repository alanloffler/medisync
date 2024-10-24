// Icons: https://lucide.dev/icons/
import { ArrowDownUp, ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, FilePen, FileText, Trash2 } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components/ui/table';
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
import { InfoCard } from '@/core/components/common/InfoCard';
import { LoadingDB } from '@/core/components/common/LoadingDB';
// External imports
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IDataTableProfessionals, ITableManager } from '@/core/interfaces/table.interface';
import type { IInfoCard } from '@/core/components/common/interfaces/infocard.interface';
import type { IProfessional } from '@/pages/professionals/interfaces/professional.interface';
import type { IResponse } from '@/core/interfaces/response.interface';
import { APP_CONFIG } from '@/config/app.config';
import { PROF_CONFIG } from '@/config/professionals.config';
import { ProfessionalApiService } from '@/pages/professionals/services/professional-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useNotificationsStore } from '@/core/stores/notifications.store';
import { useTruncateText } from '@/core/hooks/useTruncateText';
// import { useMediaQuery } from '@uidotdev/usehooks';
// Default values for pagination and sorting
const defaultSorting: SortingState = [{ id: PROF_CONFIG.table.defaultSortingId, desc: PROF_CONFIG.table.defaultSortingType }];
const defaultPagination: PaginationState = { pageIndex: 0, pageSize: PROF_CONFIG.table.defaultPageSize };
// React component
export function ProfessionalsDataTable({ search, reload, setReload, setErrorMessage }: IDataTableProfessionals) {
  const [actualSearchType, setActualSearchType] = useState<string>(search.type);
  const [columns, setColumns] = useState<ColumnDef<IProfessional>[]>([]);
  const [data, setData] = useState<IProfessional[]>([]);
  const [infoCard, setInfoCard] = useState<IInfoCard>({ text: '', type: 'error' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRemovingProfessional, setIsRemovingProfessional] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [professionalSelected, setProfessionalSelected] = useState<IProfessional>({} as IProfessional);
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [tableManager, setTableManager] = useState<ITableManager>({ sorting, pagination });
  const [totalItems, setTotalItems] = useState<number>(0);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const firstUpdate = useRef(true);
  const navigate = useNavigate();
  const truncate = useTruncateText();
  // #region Table columns
  const tableColumns: ColumnDef<IProfessional>[] = [
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
          {totalItems === 1 ? (
            PROF_CONFIG.table.headers[0]
          ) : (
            <button
              className='flex items-center gap-2 hover:text-accent-foreground'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {PROF_CONFIG.table.headers[0]}
              <ArrowDownUp className='h-3 w-3' />
            </button>
          )}
        </div>
      ),
      cell: ({ row }) => (
        <div className='text-left'>{`${capitalize(row.original.title.abbreviation)} ${capitalize(row.original.lastName)}, ${capitalize(row.original.firstName)}`}</div>
      ),
    },
    {
      accessorKey: 'area',
      size: 80,
      header: ({ column }) => (
        <div className='text-left'>
          {totalItems === 1 ? (
            PROF_CONFIG.table.headers[1]
          ) : (
            <button
              className='flex items-center gap-2 hover:text-accent-foreground'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {PROF_CONFIG.table.headers[1]}
              <ArrowDownUp className='h-3 w-3' />
            </button>
          )}
        </div>
      ),
      cell: ({ row }) => <div className='text-left'>{capitalize(row.original.area.name)}</div>,
    },
    {
      accessorKey: 'specialization',
      size: 80,
      header: ({ column }) => (
        <div className='text-center'>
          {totalItems === 1 ? (
            PROF_CONFIG.table.headers[2]
          ) : (
            <button
              className='flex items-center gap-2 hover:text-accent-foreground'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {PROF_CONFIG.table.headers[2]}
              <ArrowDownUp className='h-3 w-3' />
            </button>
          )}
        </div>
      ),
      cell: ({ row }) => <div className='text-left text-sm'>{capitalize(row.original.specialization.name)}</div>,
    },
    {
      accessorKey: 'available',
      size: 50,
      header: ({ column }) => (
        <div className='text-center'>
          {totalItems === 1 ? (
            PROF_CONFIG.table.headers[3]
          ) : (
            <button
              className='flex items-center gap-2 hover:text-accent-foreground'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {PROF_CONFIG.table.headers[3]}
              <ArrowDownUp className='h-3 w-3' />
            </button>
          )}
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex flex-row items-center justify-start space-x-2 text-xs'>
          <div className={`flex ${row.original.available ? 'h-2 w-2 rounded-full bg-green-400' : 'h-2 w-2 rounded-full bg-red-400'}`}></div>
          <div className={`flex ${row.original.available ? 'text-slate-800' : 'text-slate-400'}`}>
            {row.original.available ? 'Activo' : 'Inactivo'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'actions',
      size: 100,
      header: () => <div className='text-center'>{PROF_CONFIG.table.headers[4]}</div>,
      cell: ({ row }) => (
        <div className='flex flex-row items-center justify-center space-x-2'>
          <Button
            variant={'ghost'}
            size={'miniIcon'}
            onClick={() => navigate(`/professionals/${row.original._id}`)}
            className='hover:bg-transparent hover:text-fuchsia-500'
          >
            <FileText size={16} strokeWidth={2} />
          </Button>
          <Button
            variant={'ghost'}
            size={'miniIcon'}
            onClick={() => navigate(`/professionals/update/${row.original._id}`)}
            className='hover:bg-transparent hover:text-indigo-500'
          >
            <FilePen size={16} strokeWidth={2} />
          </Button>
          <Button
            variant={'ghost'}
            size={'miniIcon'}
            onClick={() => handleRemoveDialog(row.original)}
            className='hover:bg-transparent hover:text-red-500'
          >
            <Trash2 size={16} strokeWidth={2} />
          </Button>
          <Button
            disabled={!row.original.phone}
            variant={'ghost'}
            size={'miniIcon'}
            className='fill-current hover:bg-transparent hover:fill-green-500'
            onClick={() => navigate(`/whatsapp/professional/${row.original._id}`)}
          >
            <svg width='100' height='100' viewBox='0 0 464 488' className='h-4 w-4'>
              <path d='M462 228q0 93-66 159t-160 66q-56 0-109-28L2 464l40-120q-32-54-32-116q0-93 66-158.5T236 4t160 65.5T462 228zM236 39q-79 0-134.5 55.5T46 228q0 62 36 111l-24 70l74-23q49 31 104 31q79 0 134.5-55.5T426 228T370.5 94.5T236 39zm114 241q-1-1-10-7q-3-1-19-8.5t-19-8.5q-9-3-13 2q-1 3-4.5 7.5t-7.5 9t-5 5.5q-4 6-12 1q-34-17-45-27q-7-7-13.5-15t-12-15t-5.5-8q-3-7 3-11q4-6 8-10l6-9q2-5-1-10q-4-13-17-41q-3-9-12-9h-11q-9 0-15 7q-19 19-19 45q0 24 22 57l2 3q2 3 4.5 6.5t7 9t9 10.5t10.5 11.5t13 12.5t14.5 11.5t16.5 10t18 8.5q16 6 27.5 10t18 5t9.5 1t7-1t5-1q9-1 21.5-9t15.5-17q8-21 3-26z' />
            </svg>
          </Button>
        </div>
      ),
    },
  ];
  // #endregion
  // #region Table constructor
  // const isSmallDevice = useMediaQuery('only screen and (max-width : 639px)');
  // const isMediumDevice = useMediaQuery('only screen and (min-width : 640px) and (max-width : 767px)');
  // const isLargeDevice = useMediaQuery('only screen and (min-width : 768px) and (max-width : 1023px)');
  // const isExtraLargeDevice = useMediaQuery('only screen and (min-width : 1024px)');

  // const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
  //   index: !isSmallDevice,
  //   lastName: true,
  //   area: false,
  //   specialization: true,
  //   available: false,
  // });

  const table: ITable<IProfessional> = useReactTable({
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
      // columnVisibility,
    },
    // onColumnVisibilityChange: setColumnVisibility,
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
    const fetchData = (search: { value: string; type: string }, sorting: SortingState, skipItems: number, itemsPerPage: number) => {
      setIsLoading(true);

      if (actualSearchType !== search.type) {
        setPagination(defaultPagination);
        setActualSearchType(search.type);
      }

      if (search.type === 'specialization') {
        ProfessionalApiService.findBySpecialization(search.value, sorting, skipItems, itemsPerPage)
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
              setInfoCard({ text: response.message, type: 'warning' });
            }
            if (response instanceof Error) {
              addNotification({ type: 'error', message: APP_CONFIG.error.server });
              setInfoCard({ text: APP_CONFIG.error.server, type: 'error' });
            }
          })
          .finally(() => setIsLoading(false));
      }
      if (search.type === 'professional') {
        ProfessionalApiService.findAll(search.value, sorting, skipItems, itemsPerPage)
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
              setInfoCard({ text: response.message, type: 'warning' });
            }
            if (response instanceof Error) {
              addNotification({ type: 'error', message: APP_CONFIG.error.server });
              setInfoCard({ text: APP_CONFIG.error.server, type: 'error' });
            }
          })
          .finally(() => setIsLoading(false));
      }
    };
    fetchData(search, tableManager.sorting, tableManager.pagination.pageIndex * tableManager.pagination.pageSize, tableManager.pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tableManager]);
  // #endregion
  // #region Remove professional
  function handleRemoveDialog(professional: IProfessional): void {
    setProfessionalSelected(professional);
    setOpenDialog(true);
  }
  // TODO: display error on UI ???
  function removeProfessional(id: string): void {
    if (id) {
      setIsRemovingProfessional(true);

      ProfessionalApiService.remove(id)
        .then((response: IResponse) => {
          if (response.statusCode === 200) {
            addNotification({ type: 'success', message: response.message });
            setOpenDialog(false);
            setProfessionalSelected({} as IProfessional);
            setReload(new Date().getTime());
          }
          if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
          if (response instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
        })
        .finally(() => setIsRemovingProfessional(false));
    }
  }
  // #endregion
  return (
    <>
      {isLoading ? (
        <LoadingDB text={APP_CONFIG.loadingDB.findProfesionals} className='mt-3' />
      ) : table.getRowModel().rows?.length > 0 ? (
        <>
          <div className='flex items-center justify-end text-sm font-medium text-slate-400'>{`${totalItems} ${totalItems === 1 ? PROF_CONFIG.dbProfessionalSingular : PROF_CONFIG.dbProfessionalPlural}`}</div>
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
          <div className='flex items-center justify-between space-x-6 pt-6 lg:space-x-8'>
            <div className='flex items-center space-x-2'>
              <p className='text-xs font-normal text-slate-400'>{PROF_CONFIG.table.rowsPerPage}</p>
              <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(e) => setPagination({ pageIndex: 0, pageSize: parseInt(e) })}>
                <SelectTrigger className='h-8 w-[65px] text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-0'>
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side='top' className='min-w-[4rem]'>
                  {PROF_CONFIG.table.itemsPerPage.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`} className='text-xs'>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex w-[100px] items-center justify-center text-xs font-normal text-slate-400'>
              {PROF_CONFIG.table.pagination.page} {pagination.pageIndex + 1} {PROF_CONFIG.table.pagination.of} {table.getPageCount()}
            </div>
            {table.getPageCount() > 1 && (
              <div className='flex items-center space-x-2'>
                <Button
                  variant='ghost'
                  className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800'
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className='sr-only'>Go to first page</span>
                  <ArrowLeftIcon size={16} strokeWidth={2} />
                </Button>
                <Button
                  variant='ghost'
                  className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 dark:bg-neutral-950 dark:hover:bg-neutral-800'
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className='sr-only'>Go to previous page</span>
                  <ChevronLeftIcon size={16} strokeWidth={2} />
                </Button>
                <Button
                  variant='ghost'
                  className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 dark:bg-neutral-950 dark:hover:bg-neutral-800'
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className='sr-only'>Go to next page</span>
                  <ChevronRightIcon size={16} strokeWidth={2} />
                </Button>
                <Button
                  variant='ghost'
                  className='h-8 w-8 bg-slate-200/50 p-0 hover:bg-slate-200 lg:flex dark:bg-neutral-950 dark:hover:bg-neutral-800'
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className='sr-only'>Go to last page</span>
                  <ArrowRightIcon size={16} strokeWidth={2} />
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <InfoCard text={infoCard.text} type={infoCard.type} className='mt-3' />
      )}
      {/* Section: Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>{PROF_CONFIG.dialog.remove.title}</DialogTitle>
            <DialogDescription>{PROF_CONFIG.dialog.remove.subtitle}</DialogDescription>
            <section className='flex flex-col pt-2'>
              <span className=''>{PROF_CONFIG.dialog.remove.content.title}</span>
              <span className='mt-1 text-lg font-semibold'>{`${capitalize(professionalSelected.title?.abbreviation)} ${capitalize(professionalSelected.lastName)}, ${capitalize(professionalSelected.firstName)}`}</span>
              <footer className='mt-5 flex justify-end space-x-4'>
                <Button variant={'secondary'} size={'sm'} onClick={() => setOpenDialog(false)}>
                  {PROF_CONFIG.button.cancel}
                </Button>
                <Button variant={'remove'} size={'sm'} onClick={() => removeProfessional(professionalSelected._id)}>
                  {isRemovingProfessional ? <LoadingDB variant='button' text={PROF_CONFIG.button.isRemoving} /> : PROF_CONFIG.button.remove}
                </Button>
              </footer>
            </section>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
{
  /* <div>
    <section>
      <h1>useMediaQuery</h1>
      Resize your browser windows to see changes.
      <article>
        <figure className={isSmallDevice ? "bg-red-400" : ""}>
          phone
          <figcaption>Small</figcaption>
        </figure>
        <figure className={isMediumDevice ? "bg-red-400" : ""}>
          tablet
          <figcaption>Medium</figcaption>
        </figure>
        <figure className={isLargeDevice ? "bg-red-400" : ""}>
          laptop
          <figcaption>Large</figcaption>
        </figure>
        <figure className={isExtraLargeDevice ? "bg-red-400" : ""}>
          desktop
          <figcaption>Extra Large</figcaption>
        </figure>
      </article>
    </section>
    </div> */
}
