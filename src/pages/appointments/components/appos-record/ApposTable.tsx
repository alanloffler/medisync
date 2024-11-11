// Icons: https://lucide.dev/icons/
import { FileText, MessageCircle, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@core/components/ui/table';
// Components
import { RemoveDialog } from '@core/components/common/RemoveDialog';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { format } from '@formkit/tempo';
import { type Cell, type ColumnDef, flexRender, getCoreRowModel, type Row, useReactTable } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { REMOVE_DIALOG_CONFIG } from '@config/common.config';
import { USER_VIEW_CONFIG } from '@config/user.config';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useHelpStore } from '@settings/stores/help.store';
// React component
export function ApposTable({
  appointments,
  // setRefresh,
}: {
  appointments: IAppointmentView[];
  setRefresh: React.Dispatch<React.SetStateAction<string>>;
}) {
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const { help } = useHelpStore();

  const columns: ColumnDef<IAppointmentView>[] = [
    {
      accessorKey: 'day',
      size: 80,
      cell: ({ row }) => <div className='text-center'>{format(row.original.day, 'DD/MM/YYYY')}</div>,
      header: () => <div className='text-center'>{USER_VIEW_CONFIG.apposRecord.table.headers[0]}</div>,
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
      header: () => <div className='text-left'>{USER_VIEW_CONFIG.apposRecord.table.headers[1]}</div>,
    },
    {
      accessorKey: 'actions',
      size: 100,
      cell: ({ row }) => (
        <div className='space-x-2 text-center'>
          <TooltipWrapper tooltip={USER_VIEW_CONFIG.apposRecord.table.tooltip.user.details} help={help}>
            <Button
              onClick={() => navigate(`/appointments/${row.original._id}`)}
              variant='tableHeader'
              size='miniIcon'
              className='border border-slate-300 bg-white transition-transform hover:scale-110 hover:border-sky-500 hover:bg-white hover:text-sky-500 hover:animate-in'
            >
              <FileText size={16} strokeWidth={1.5} />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper tooltip={USER_VIEW_CONFIG.apposRecord.table.tooltip.user.message} help={help}>
            <Button
              // onClick={}
              variant='tableHeader'
              size='miniIcon'
              className='border border-slate-300 bg-white transition-transform hover:scale-110 hover:border-emerald-500 hover:bg-white hover:text-emerald-500 hover:animate-in'
            >
              <MessageCircle size={16} strokeWidth={1.5} />
            </Button>
          </TooltipWrapper>
          <RemoveDialog
            action={() => AppointmentApiService.remove(row.original._id)}
            triggerButton={<Trash2 size={16} strokeWidth={1.5} />}
            dialogContent={<section>This is the dialog content, appointment {row.original._id} to be deleted</section>}
            dialogTexts={{
              title: REMOVE_DIALOG_CONFIG.appointment.title,
              description: REMOVE_DIALOG_CONFIG.appointment.description,
              cancelButton: REMOVE_DIALOG_CONFIG.appointment.cancelButton,
              removeButton: REMOVE_DIALOG_CONFIG.appointment.removeButton,
            }}
            help={help}
            tooltip={USER_VIEW_CONFIG.apposRecord.table.tooltip.user.delete}
          />
        </div>
      ),
      header: () => <div className='text-center'>{USER_VIEW_CONFIG.apposRecord.table.headers[2]}</div>,
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

  // function handleDeleteAppointment(id: string): void {
  //   // TODO: handle response and errors
  //   AppointmentApiService.remove(id).then((response: IResponse) => {
  //     console.log(response);
  //     setRefresh(crypto.randomUUID());
  //     console.log();
  //   });
  // }

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
          <TableRow key={row.id} className='hover:bg-slate-100/50'>
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
