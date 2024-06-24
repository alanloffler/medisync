// Icons: https://lucide.dev/icons/
import { CirclePlus, List, ListFilter, ListRestart, PlusCircle } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/core/components/ui/dropdown-menu';

// App components
import { PageHeader } from "@/core/components/common/PageHeader";
import { UsersDataTable } from "./components/UsersDataTable";
// App
import { USER_CONFIG } from "@/config/user.config";
import { Link, useNavigate } from 'react-router-dom';
// import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useState } from 'react';
import { useDebounce } from '@/core/hooks/useDebounce';
// Constants
const DEBOUNCE_TIME: number = 500;
// React component
export default function Users() {
  const [reload, setReload] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // const capitalize = useCapitalize();
  const debouncedSearch = useDebounce<string>(search, DEBOUNCE_TIME); // load data
  const navigate = useNavigate();

  function handleReload(): void {
    setSearch('');
    setReload(Math.random());
  }

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={USER_CONFIG.title} breadcrumb={USER_CONFIG.breadcrumb} />
      </div>
      {/* Users table */}
      <div className='grid gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4'>
        <Card className='col-span-1 border-none bg-slate-200 bg-transparent shadow-none md:col-span-4 lg:col-span-1 xl:col-span-1'>
          <CardContent className='p-0'>
            <div className='flex flex-col gap-6 md:w-full'>
              <Link to={`/users/create`} className='w-fit'>
                <Button variant={'default'} size={'sm'} className='gap-2'>
                  <PlusCircle className='h-4 w-4' strokeWidth={2} />
                  {USER_CONFIG.buttons.addUser}
                </Button>
              </Link>
              <div className='flex flex-col space-y-2'>
                {/* <div className='relative w-full'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input onChange={handleSearch} value={search} type='search' placeholder={PROF_CONFIG.search.placeholder} className='bg-background pl-9 shadow-sm' />
                </div> */}
                {errorMessage && <div className='flex flex-row items-center text-xs font-medium text-rose-400'>{errorMessage}</div>}
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
                  {USER_CONFIG.table.title}
                </div>
                <div className='flex items-center gap-2'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'tableHeader'} size={'miniIcon'} className='flex items-center'>
                        <ListFilter className='h-4 w-4' strokeWidth={2} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-fit' align='center'>
                      {/* {areas.map((area) => (
                        <DropdownMenuSub key={area._id}>
                          <DropdownMenuSubTrigger>
                            <span>{capitalize(area.name)}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {area.specializations.map((spec) => (
                                <DropdownMenuItem key={spec._id} onClick={() => setSearch(spec.name)}>
                                  <span>{capitalize(spec.name)}</span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      ))} */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant={'tableHeader'} size={'miniIcon'} onClick={handleReload}>
                    <ListRestart className='h-4 w-4' strokeWidth={2} />
                  </Button>
                  <Button variant={'tableHeaderPrimary'} size={'miniIcon'} onClick={() => navigate('/users/create')}>
                    <CirclePlus className='h-4 w-4' strokeWidth={2} />
                  </Button>
                </div>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <UsersDataTable search={debouncedSearch} reload={reload} setErrorMessage={setErrorMessage} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
