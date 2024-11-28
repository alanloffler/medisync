// Icons: https://lucide.dev/icons/
import { Calendar, Clock, FileText, MessageCircle, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@core/components/ui/table';
// Components
import { RemoveDialog } from '@core/components/common/RemoveDialog';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { format } from '@formkit/tempo';
import { type Cell, type ColumnDef, flexRender, getCoreRowModel, type Row, useReactTable } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
// Imports
import i18n from '@core/i18n/i18n';
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { USER_VIEW_CONFIG as UV_CONFIG } from '@config/users/user-view.config';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useHelpStore } from '@settings/stores/help.store';
// React component
export function ApposTable({
  appointments,
  setRefresh,
}: {
  appointments: IAppointmentView[];
  setRefresh: React.Dispatch<React.SetStateAction<string>>;
}) {
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const { help } = useHelpStore();
  const { t } = useTranslation();

  const columns: ColumnDef<IAppointmentView>[] = [
    {
      accessorKey: 'day',
      size: 80,
      cell: ({ row }) => (
        <section className='mx-auto flex w-fit items-center justify-center space-x-2 rounded-sm bg-slate-200 p-1 pr-2 text-slate-600'>
          <Calendar size={16} strokeWidth={2} />
          <span className='text-xsm font-normal'>{format(row.original.day, 'DD/MM/YY')}</span>
        </section>
      ),
      header: () => <div className='text-center'>{t(UV_CONFIG.table.header[0])}</div>,
    },
    {
      accessorKey: 'lastName',
      cell: ({ row }) => (
        <div>
          {capitalize(
            `${row.original.professional?.title.abbreviation} ${row.original.professional?.firstName} ${row.original.professional?.lastName}`,
          )}
        </div>
      ),
      header: () => <div className='text-left'>{t(UV_CONFIG.table.header[1])}</div>,
    },
    {
      accessorKey: 'actions',
      size: 100,
      cell: ({ row }) => (
        <div className='space-x-2 text-center'>
          <TooltipWrapper tooltip={t('tooltip.details')} help={help}>
            <Button
              onClick={() => navigate(`/appointments/${row.original._id}`)}
              variant='secondary'
              size='miniIcon'
              className='bg-transparent transition-transform hover:scale-110 hover:bg-transparent hover:text-sky-500 hover:animate-in'
            >
              <FileText size={16} strokeWidth={1.5} />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper tooltip={t('tooltip.sendMessage')} help={help}>
            <Button
              // onClick={}
              variant='secondary'
              size='miniIcon'
              className='bg-transparent transition-transform hover:scale-110 hover:bg-transparent hover:text-emerald-500 hover:animate-in'
            >
              <MessageCircle size={16} strokeWidth={1.5} />
            </Button>
          </TooltipWrapper>
          <RemoveDialog
            action={() => AppointmentApiService.remove(row.original._id)}
            callback={handleRefresh}
            triggerButton={<Trash2 size={16} strokeWidth={1.5} />}
            dialogContent={
              <section className='flex flex-col space-y-3'>
                <section className='flex flex-row gap-1'>
                  <Trans
                    i18nKey={'dialog.deleteAppointment.contentText'}
                    values={{ firstName: capitalize(row.original.user.firstName), lastName: capitalize(row.original.user.lastName) }}
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
                  <span className='font-medium'>{`${capitalize(row.original.professional.title.abbreviation)} ${capitalize(row.original.professional.firstName)} ${capitalize(row.original.professional.lastName)}`}</span>
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
