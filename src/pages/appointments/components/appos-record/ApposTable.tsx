// Icons: https://lucide.dev/icons/
import { Calendar, Clock, FileText, MessageCircle, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@core/components/ui/table';
// Components
import { DateTime } from '@core/components/common/DateTime';
import { RemoveDialog } from '@core/components/common/RemoveDialog';
import { TableButton } from '@core/components/common/TableButton';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { format } from '@formkit/tempo';
import { type Cell, type ColumnDef, flexRender, getCoreRowModel, type Row, useReactTable } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { USER_VIEW_CONFIG as UV_CONFIG } from '@config/users/user-view.config';
import { UtilsString } from '@core/services/utils/string.service';
import { useHelpStore } from '@settings/stores/help.store';
// React component
export function ApposTable({
  appointments,
  setRefresh,
}: {
  appointments: IAppointmentView[];
  setRefresh: React.Dispatch<React.SetStateAction<string>>;
}) {
  const navigate = useNavigate();
  const { help } = useHelpStore();
  const { i18n, t } = useTranslation();

  const columns: ColumnDef<IAppointmentView>[] = [
    {
      accessorKey: 'day',
      size: 80,
      cell: ({ row }) => <DateTime day={row.original.day} hour={row.original.hour} />,
      header: () => <div className='text-center'>{t(UV_CONFIG.table.header[0])}</div>,
    },
    {
      accessorKey: 'lastName',
      cell: ({ row }) => (
        <div>
          {UtilsString.upperCase(
            `${row.original.professional?.title.abbreviation} ${row.original.professional?.firstName} ${row.original.professional?.lastName}`,
            'each',
          )}
        </div>
      ),
      header: () => <div className='text-left'>{t(UV_CONFIG.table.header[1])}</div>,
    },
    {
      accessorKey: 'actions',
      size: 100,
      cell: ({ row }) => (
        <div className='flex items-center justify-center space-x-2'>
          <TableButton
            callback={() => navigate(`/appointments/${row.original._id}`)}
            help={help}
            tooltip={t('tooltip.details')}
            className='hover:text-sky-500'
          >
            <FileText size={16} strokeWidth={1.5} />
          </TableButton>
          <TableButton
            callback={() => navigate(`/whatsapp/user/${row.original._id}`)}
            help={help}
            tooltip={t('tooltip.sendMessage')}
            className='hover:text-green-500'
          >
            <MessageCircle size={16} strokeWidth={1.5} />
          </TableButton>
          <RemoveDialog
            action={() => AppointmentApiService.remove(row.original._id)}
            callback={handleRefresh}
            triggerButton={<Trash2 size={16} strokeWidth={1.5} />}
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
            help={help}
            tooltip={t('tooltip.delete')}
          />
        </div>
      ),
      header: () => <div className='text-center'>{t(UV_CONFIG.table.header[2])}</div>,
    },
  ];

  const table = useReactTable<IAppointmentView>({
    data: appointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function handleRowClick(row: Row<IAppointmentView>, cell: Cell<IAppointmentView, unknown>): void {
    if (cell.column.getIndex() < row.getAllCells().length - 1) navigate(`/appointments/${row.original._id}`);
  }

  function handleRefresh(): void {
    setRefresh(crypto.randomUUID());
  }

  return (
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
  );
}
