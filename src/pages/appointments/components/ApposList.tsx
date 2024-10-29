// External components: https://ui.shadcn.com/docs/components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components/ui/table';
// External imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from '@formkit/tempo';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// React component
export function ApposList({ appointments }: { appointments: IAppointmentView[] }) {
  const capitalize = useCapitalize();
  const columnHelper = createColumnHelper<IAppointmentView>();

  const columns = [
    columnHelper.accessor((row) => row.day, {
      id: 'date',
      cell: (info) => <span>{format(info.getValue(), 'DD/MM/YYYY')}</span>,
      header: () => <div className='text-center'>Fecha</div>,
    }),
    columnHelper.accessor(
      (row) =>
        `${capitalize(row.professional.title.abbreviation)} ${capitalize(row.professional.lastName)}, ${capitalize(row.professional.firstName)}`,
      {
        id: 'lastName',
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <div className='text-left'>Profesional</div>,
      },
    ),
  ];

  const table = useReactTable<IAppointmentView>({
    data: appointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell className='py-2' key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
