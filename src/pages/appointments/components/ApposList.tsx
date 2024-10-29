// External components: https://ui.shadcn.com/docs/components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components/ui/table';
// External imports
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from '@formkit/tempo';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
import { useCapitalize } from '@/core/hooks/useCapitalize';
// React component
export function ApposList({ appointments }: { appointments: IAppointmentView[] }) {
  const capitalize = useCapitalize();
  const navigate = useNavigate();

  const columns: ColumnDef<IAppointmentView>[] = [
    {
      accessorKey: 'day',
      size: 20,
      cell: ({ row }) => <div className='text-center'>{format(row.original.day, 'DD/MM/YYYY')}</div>,
      header: () => <div className='text-center'>Fecha</div>,
    },
    {
      accessorKey: 'lastName',
      cell: ({ row }) => <div className=''>{capitalize(`${row.original.professional.title.abbreviation} ${row.original.professional.lastName}, ${row.original.professional.firstName}`)}</div>,
      header: () => <div className='text-left'>Profesional</div>,
    },
    {
      accessorKey: 'actions',
      size: 100,
      cell: () => <div className='bg-yellow-300'>
        Botones acá
      </div>,
      header: () => <div className='text-right'>Acciones</div>,
    }
  ];

  const table = useReactTable<IAppointmentView>({
    data: appointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 200, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className='text-sm'>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell onClick={() => navigate(`/appointments/${row.original._id}`)} className='py-1 px-0' key={cell.id} style={{ width: `${cell.column.getSize()}px` }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
