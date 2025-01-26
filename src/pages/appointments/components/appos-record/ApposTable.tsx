// Icons: https://lucide.dev/icons/
import { Calendar, Clock, FileText, Mail, MailX, MessageCircle, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Separator } from '@core/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@core/components/ui/table';
// Components
import { DateTime } from '@core/components/common/DateTime';
import { Pagination } from '@core/components/common/Pagination';
import { RemoveDialog } from '@core/components/common/RemoveDialog';
import { TableButton } from '@core/components/common/TableButton';
// External imports
import {
  type Cell,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  type Row,
  useReactTable,
} from '@tanstack/react-table';
import { Trans, useTranslation } from 'react-i18next';
import { format } from '@formkit/tempo';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { USER_VIEW_CONFIG as UV_CONFIG } from '@config/users/user-view.config';
import { UtilsString } from '@core/services/utils/string.service';
// React component
export function ApposTable({
  appointments,
  pagination,
  setPagination,
  setRefresh,
  totalItems,
}: {
  appointments: IAppointmentView[];
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  setRefresh: React.Dispatch<React.SetStateAction<string>>;
  totalItems: number;
}) {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  // Actions
  const handleRowClick = useCallback(
    (row: Row<IAppointmentView>, cell: Cell<IAppointmentView, unknown>): void => {
      if (cell.column.getIndex() < row.getAllCells().length - 1) navigate(`/appointments/${row.original._id}`);
    },
    [navigate],
  );

  const handleRefresh = useCallback((): void => {
    setRefresh(crypto.randomUUID());
  }, [setRefresh]);

  // Table manager
  const columns: ColumnDef<IAppointmentView>[] = useMemo(
    () => [
      {
        accessorKey: 'day',
        size: 80,
        cell: ({ row }) => <DateTime day={row.original.day} hour={row.original.hour} />,
        header: () => <div className='text-center'>{t(UV_CONFIG.table.appointments.header[0])}</div>,
      },
      {
        accessorKey: 'lastName',
        cell: ({ row }) => (
          <div className='flex flex-col gap-1 md:flex-row md:items-center md:justify-between lg:flex-col lg:items-start lg:justify-start xl:flex-row xl:items-center xl:justify-between'>
            <div>
              {UtilsString.upperCase(
                `${row.original.professional?.title.abbreviation} ${row.original.professional?.lastName}, ${row.original.professional?.firstName}`,
                'each',
              )}
            </div>
            <div className='text-xsm text-slate-500'>{UtilsString.upperCase(row.original.professional.specialization.name, 'each')}</div>
          </div>
        ),
        header: () => <div className='text-left'>{t(UV_CONFIG.table.appointments.header[1])}</div>,
      },
      {
        accessorKey: 'actions',
        size: 90,
        cell: ({ row }) => (
          <div className='flex items-center justify-center space-x-0.5 md:space-x-2'>
            <TableButton
              callback={() => navigate(`/appointments/${row.original._id}`)}
              tooltip={t('tooltip.details')}
              className='hover:bg-sky-100/75 hover:text-sky-400'
            >
              <FileText size={17} strokeWidth={1.5} />
            </TableButton>
            <RemoveDialog
              action={() => AppointmentApiService.remove(row.original._id)}
              callback={handleRefresh}
              dialogContent={
                <section className='flex flex-col space-y-3'>
                  <section className='flex flex-row gap-1'>
                    <Trans
                      i18nKey={'dialog.deleteAppointment.contentText'}
                      values={{
                        firstName: UtilsString.upperCase(row.original.user.firstName, 'each'),
                        lastName: UtilsString.upperCase(row.original.user.lastName, 'each'),
                      }}
                      components={{
                        span: <span className='font-semibold' />,
                      }}
                    />
                  </section>
                  <section className='flex flex-row space-x-2 font-medium'>
                    <div className='flex items-center space-x-2 rounded-sm bg-sky-100 px-2 py-1 pl-1 text-xsm text-sky-600'>
                      <Calendar size={16} strokeWidth={2} />
                      <span>{format(row.original.day, 'short', i18n.language)}</span>
                    </div>
                    <div className='flex items-center space-x-2 rounded-sm bg-emerald-100 px-2 py-1 pl-1 text-xsm text-emerald-600'>
                      <Clock size={16} strokeWidth={2} />
                      <span>{row.original.hour}</span>
                    </div>
                    <span className='font-medium'>
                      {UtilsString.upperCase(
                        `${row.original.professional.title.abbreviation} ${row.original.professional.firstName} ${row.original.professional.lastName}`,
                        'each',
                      )}
                    </span>
                  </section>
                </section>
              }
              dialogTexts={{
                cancelButton: t('button.cancel'),
                deleting: t('deleting.appointment'),
                description: t('dialog.deleteAppointment.description'),
                removeButton: t('button.deleteAppointment'),
                title: t('dialog.deleteAppointment.title'),
              }}
              tooltip={t('tooltip.delete')}
              triggerButton={<Trash2 size={17} strokeWidth={1.5} />}
            />
            <div className='px-1'>
              <Separator orientation='vertical' className='h-5 w-[1px]' />
            </div>
            <TableButton
              callback={() => console.log(`/email/user/${row.original._id}`)}
              className='hover:bg-purple-100/75 hover:text-purple-400'
              disabled={!row.original.user.email}
              tooltip={t('tooltip.sendAppoByEmail')}
            >
              {!row.original.user.email ? <MailX size={17} strokeWidth={1.5} className='stroke-red-400' /> : <Mail size={17} strokeWidth={1.5} />}
            </TableButton>
            <TableButton
              callback={() => console.log(`/whatsapp/user/${row.original._id}`)}
              className='hover:bg-emerald-100/75 hover:text-emerald-400'
              tooltip={t('tooltip.sendAppoByMessage')}
            >
              <MessageCircle size={17} strokeWidth={1.5} />
            </TableButton>
          </div>
        ),
        header: () => <div className='text-center'>{t(UV_CONFIG.table.appointments.header[2])}</div>,
      },
    ],
    [handleRefresh, i18n.language, navigate, t],
  );

  const table = useReactTable<IAppointmentView>({
    columns,
    data: appointments,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    rowCount: totalItems,
    state: {
      // sorting,
      pagination,
    },
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className='border-t bg-slate-50 text-[11px] font-medium uppercase text-slate-500'>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className='text-sm'>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className='hover:bg-slate-50/70'>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  onClick={() => handleRowClick(row, cell)}
                  className={`px-0 py-1 ${cell.column.id !== 'actions' && 'hover:cursor-pointer'}`}
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
        itemsPerPage={UV_CONFIG.table.appointments.itemsPerPageOptions}
        pagination={pagination}
        setPagination={setPagination}
        table={table}
      />
    </>
  );
}
