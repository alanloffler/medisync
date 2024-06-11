// Icons: https://lucide.dev/icons/
import { ArrowDownUp, CirclePlus, FilePen, FileText, List, ListRestart, PlusCircle, Search, Trash2 } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/core/components/ui/dropdown-menu';
import { Input } from '@/core/components/ui/input';
// App components
import { ProfessionalsDataTable } from './components/ProfessionalsDataTable';
// App
import { ChangeEvent, MouseEvent, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { IBreadcrumb } from '../core/components/common/interfaces/breadcrumb.interface';
import { IProfessional } from './interfaces/professional.interface';
import { Link, useNavigate } from 'react-router-dom';
import { PROF_CONFIG } from './config/professionals.config';
import { PageHeader } from '@/core/components/common/PageHeader';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useDebounce } from '@/core/hooks/useDebounce';
import { useHeaderMenuStore } from '@/layout/stores/header-menu.service';
// Constants
const DEBOUNCE_TIME: number = 500;
// React component
export default function Professionals() {
  const [search, setSearch] = useState<string>('');
  const capitalize = useCapitalize();
  const debouncedSearch = useDebounce<string>(search, DEBOUNCE_TIME); // load data
  // const itemsPerPage: number = 5; // Pagination (get this from config or db)
  const navigate = useNavigate();
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const breadcrumb: IBreadcrumb[] = [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Profesionales', path: '/professionals' },
  ];

  function handleNavigation(event: MouseEvent<HTMLAnchorElement>, path: string) {
    event.preventDefault();
    setItemSelected(2);
    navigate(path);
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }
  // #region Table
  const columns: ColumnDef<IProfessional>[] = [
    // {
    //   accessorKey: 'index',
    //   size: 50,
    //   header: () => {
    //     return <div className='text-center'>#</div>;
    //   },
    //   cell: ({ row }) => {
    //     return <div className='text-center text-sm'>{row.index + 1}</div>;
    //   },
    // },
    {
      accessorKey: 'lastName',
      // size: 150,
      // minSize: 150,
      header: ({ column }) => {
        return (
          <div className='text-left'>
            <button className='flex items-center gap-2 hover:text-accent-foreground' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              {PROF_CONFIG.table.headers[0]}
              <ArrowDownUp className='h-3 w-3' />
            </button>
          </div>
        );
      },
      cell: ({ row }) => {
        return <div className='text-left font-medium'>{`${capitalize(row.original.titleAbbreviation)} ${capitalize(row.original.lastName)}, ${capitalize(row.original.firstName)}`}</div>;
      },
    },
    {
      accessorKey: 'area',
      size: 80,
      header: ({ column }) => {
        return (
          <div className='text-left'>
            <button className='flex items-center gap-2 hover:text-accent-foreground' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              {PROF_CONFIG.table.headers[1]}
              <ArrowDownUp className='h-3 w-3' />
            </button>
          </div>
        );
      },
      cell: ({ row }) => {
        return <div className='text-left'>{capitalize(row.original.area.name)}</div>;
      },
    },
    {
      accessorKey: 'specialization',
      size: 80,
      header: ({ column }) => {
        return (
          <div className='text-center'>
            <button className='flex items-center gap-2 hover:text-accent-foreground' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              {PROF_CONFIG.table.headers[2]}
              <ArrowDownUp className='h-3 w-3' />
            </button>
          </div>
        );
      },
      cell: ({ row }) => {
        return <div className='text-left text-sm'>{capitalize(row.original.specialization.name)}</div>;
      },
    },
    {
      accessorKey: 'available',
      size: 50,
      header: ({ column }) => {
        return (
          <div className='text-center'>
            <button className='flex items-center gap-2 hover:text-accent-foreground' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              {PROF_CONFIG.table.headers[3]}
              <ArrowDownUp className='h-3 w-3' />
            </button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className='flex flex-row items-center justify-start space-x-2 text-xs'>
            <div className={`flex ${row.original.available ? 'h-2 w-2 rounded-full bg-green-400' : 'h-2 w-2 rounded-full bg-red-400'}`}></div>
            <div className={`flex ${row.original.available ? 'text-slate-800' : 'text-slate-400'}`}>{row.original.available ? 'Activo' : 'Inactivo'}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'actions',
      size: 100,
      header: () => {
        return <div className='text-center'>{PROF_CONFIG.table.headers[4]}</div>;
      },
      cell: () => {
        return (
          <div className='flex flex-row items-center justify-center space-x-4'>
            <Button variant={'ghost'} size={'miniIcon'} className=''>
              <FileText className='h-4 w-4' />
            </Button>
            <Button variant={'ghost'} size={'miniIcon'}>
              <FilePen className='h-4 w-4' />
            </Button>
            <Button variant={'ghost'} size={'miniIcon'}>
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        );
      },
    },
  ];
  // #endregion
  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={PROF_CONFIG.title} breadcrumb={breadcrumb} />
      </div>
      {/* Page content */}
      <div className='grid gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4'>
        <Card className='col-span-1 border-none bg-slate-200 bg-transparent shadow-none md:col-span-4 lg:col-span-1 xl:col-span-1'>
          <CardContent className='p-0'>
            <div className='flex flex-col gap-6'>
              <Link to={`/professionals/create`}>
                <Button variant={'default'} size={'sm'} className='gap-2'>
                  <PlusCircle className='h-4 w-4' strokeWidth={2} />
                  {PROF_CONFIG.buttons.addProfessional}
                </Button>
              </Link>
              <div className='relative flex'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input onChange={handleSearch} type='search' placeholder={PROF_CONFIG.search.placeholder} className='w-fit grow bg-background pl-9 shadow-sm' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='col-span-1 overflow-y-auto md:col-span-4 lg:col-span-3 xl:col-span-3'>
          <CardHeader>
            <div className='grid gap-2'>
              <CardTitle className='flex items-center justify-between'>
                <div className='flex items-center gap-3.5 px-2'>
                  <List className='h-4 w-4' strokeWidth={2} />
                  {PROF_CONFIG.table.title}
                </div>
                <div className='flex items-center gap-2'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'tableHeader'} size={'miniIcon'}>
                        <ArrowDownUp className='h-4 w-4' strokeWidth={2} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-fit' align='center'>
                      <DropdownMenuItem>
                        <Link to='/professionals' onClick={(event) => handleNavigation(event, '/')}>
                          Ascendente - prof
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to='/'>Descendente</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant={'tableHeader'} size={'miniIcon'}>
                    <ListRestart className='h-4 w-4' strokeWidth={2} />
                  </Button>
                  <Button variant={'tableHeaderPrimary'} size={'miniIcon'}>
                    <CirclePlus className='h-4 w-4' strokeWidth={2} />
                  </Button>
                </div>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ProfessionalsDataTable columns={columns} search={debouncedSearch} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
