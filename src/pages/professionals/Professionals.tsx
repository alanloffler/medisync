// Icons: https://lucide.dev/icons/
import { ChevronDown, CirclePlus, Filter, List, ListRestart, PlusCircle, Search, X } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';
import { Input } from '@/core/components/ui/input';
// App components
import { PageHeader } from '@/core/components/common/PageHeader';
import { ProfessionalsDataTable } from '@/pages/professionals/components/ProfessionalsDataTable';
// App
import type { IArea } from '@/core/interfaces/area.interface';
import type { ISpecialization } from '@/core/interfaces/specialization.interface';
import { APP_CONFIG } from '@/config/app.config';
import { AreaService } from '@/core/services/area.service';
import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PROF_CONFIG } from '@/config/professionals.config';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useDebounce } from '@/core/hooks/useDebounce';
import { useNotificationsStore } from '@/core/stores/notifications.store';
// Constants
const DEBOUNCE_TIME: number = PROF_CONFIG.search.debounceTime;
// React component
export default function Professionals() {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [reload, setReload] = useState<number>(0);
  const [search, setSearch] = useState<{ value: string; type: string }>({ value: '', type: 'professional' });
  const [specSelected, setSpecSelected] = useState<string>('Especialización');
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const debouncedSearch = useDebounce<{ value: string; type: string }>(search, DEBOUNCE_TIME);
  const navigate = useNavigate();

  function handleSearchByProfessional(event: ChangeEvent<HTMLInputElement>): void {
    setSearch({ value: event.target.value, type: 'professional' });
  }

  function handleSearchBySpecialization(specialization: ISpecialization): void {
    setSearch({ value: specialization._id, type: 'specialization' });
    setSpecSelected(specialization.name);
  }

  function handleClearSearch(): void {
    setSearch({ value: '', type: 'professional' });
    setSpecSelected('Especialización');
  }

  function handleReload(): void {
    setSearch({ value: '', type: 'professional' });
    setReload(Math.random());
  }

  useEffect(() => {
    AreaService.findAll().then((response) => {
      if (response.statusCode === 200) setAreas(response.data);
      if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
      if (response instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
    });
  }, [addNotification]);

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={PROF_CONFIG.title} breadcrumb={PROF_CONFIG.breadcrumb} />
      </div>
      {/* Page content */}
      <div className='grid gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4'>
        <Card className='col-span-1 border-none bg-slate-200 bg-transparent shadow-none md:col-span-4 lg:col-span-1 xl:col-span-1'>
          <CardContent className='p-0'>
            <div className='flex flex-col gap-6 md:w-full'>
              <Link to={`/professionals/create`} className='w-fit'>
                <Button variant={'default'} size={'sm'} className='gap-2'>
                  <PlusCircle className='h-4 w-4' strokeWidth={2} />
                  {PROF_CONFIG.buttons.addProfessional}
                </Button>
              </Link>
              <div className='flex flex-col space-y-2'>
                <div className='relative w-full'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    onChange={handleSearchByProfessional}
                    value={search.type === 'professional' ? search.value : ''}
                    type='text'
                    placeholder={PROF_CONFIG.search.placeholder}
                    className='bg-background pl-9 shadow-sm'
                  />
                  {search.type === 'professional' && search.value && (
                    <button
                      onClick={() => setSearch({ value: '', type: 'professional' })}
                      className='absolute right-3 top-3 text-muted-foreground hover:text-black'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
                {errorMessage && <div className='flex flex-row items-center text-xs font-medium text-rose-400'>{errorMessage}</div>}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className='col-span-1 overflow-y-auto md:col-span-4 lg:col-span-3 xl:col-span-3'>
          <div className='flex flex-row items-center justify-start space-x-3 py-3'>
            <div className='flex items-center space-x-2 text-sm font-medium text-slate-500'>
              <Filter size={14} strokeWidth={2} />
              <span>{PROF_CONFIG.search.filterBy}</span>
            </div>
            <DropdownMenu>
              <div className='flex flex-row items-center space-x-2'>
                <DropdownMenuTrigger
                  disabled={!areas.length}
                  className='flex w-fit items-center space-x-2 rounded-md border bg-white px-2 py-1 text-sm'
                >
                  <span>{capitalize(specSelected)}</span>
                  <ChevronDown className='h-4 w-4' strokeWidth={2} />
                </DropdownMenuTrigger>
                {specSelected !== 'Especialización' && (
                  <Button
                    variant={'default'}
                    size={'miniIcon'}
                    onClick={handleClearSearch}
                    className='h-5 w-5 rounded-full bg-black p-0 text-xs font-medium text-white hover:bg-black/70'
                  >
                    <X size={14} strokeWidth={2} />
                  </Button>
                )}
              </div>
              <DropdownMenuContent className='w-fit' align='center'>
                {areas.length > 0 &&
                  areas.map((area) => (
                    <DropdownMenuSub key={area._id}>
                      <DropdownMenuSubTrigger>
                        <span>{capitalize(area.name)}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {area.specializations.map((spec) => (
                            <DropdownMenuItem key={spec._id} onClick={() => handleSearchBySpecialization(spec)}>
                              <span>{capitalize(spec.name)}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Card>
            <CardHeader>
              <div className='grid gap-2'>
                <CardTitle className='flex items-center justify-between'>
                  <div className='flex items-center gap-3.5 px-2'>
                    <List className='h-4 w-4' strokeWidth={2} />
                    {PROF_CONFIG.table.title}
                  </div>
                  <div className='flex items-center gap-2'>
                    {/* <DropdownMenu>
                    <DropdownMenuTrigger disabled={!areas.length} asChild>
                      <Button variant={'tableHeader'} size={'miniIcon'} className='flex items-center'>
                        <ListFilter className='h-4 w-4' strokeWidth={2} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-fit' align='center'>
                      {areas.length > 0 &&
                        areas.map((area) => (
                          <DropdownMenuSub key={area._id}>
                            <DropdownMenuSubTrigger>
                              <span>{capitalize(area.name)}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {area.specializations.map((spec) => (
                                  <DropdownMenuItem key={spec._id} onClick={() => handleSearchBySpecialization(spec._id)}>
                                    <span>{capitalize(spec.name)}</span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                    <Button variant={'tableHeader'} size={'miniIcon'} onClick={handleReload}>
                      <ListRestart className='h-4 w-4' strokeWidth={2} />
                    </Button>
                    <Button variant={'tableHeaderPrimary'} size={'miniIcon'} onClick={() => navigate('/professionals/create')}>
                      <CirclePlus className='h-4 w-4' strokeWidth={2} />
                    </Button>
                  </div>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='px-3'>
              <ProfessionalsDataTable key={reload} reload={reload} search={debouncedSearch} setErrorMessage={setErrorMessage} setReload={setReload} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
