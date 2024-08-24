// Icons: https://lucide.dev/icons/
import { CirclePlus, List, ListRestart, PlusCircle, Search, X } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Switch } from '@/core/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/core/components/ui/tooltip';
// App components
import { PageHeader } from '@/core/components/common/PageHeader';
import { UsersDataTable } from './components/UsersDataTable';
// App
import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { USER_CONFIG } from '@/config/user.config';
import { useDebounce } from '@/core/hooks/useDebounce';
// React component
export default function Users() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [helpChecked, setHelpChecked] = useState<boolean>(false); // TODO: value must be stored on db and be global
  const [reload, setReload] = useState<number>(0);
  const [searchByName, setSearchByName] = useState<string>('');
  const [searchByDNI, setSearchByDNI] = useState<string>('');
  const debouncedSearchByName = useDebounce<string>(searchByName, USER_CONFIG.search.debounceTime);
  const debouncedSearchByDNI = useDebounce<string>(searchByDNI, USER_CONFIG.search.debounceTime);
  const navigate = useNavigate();

  function handleSearchByName(event: ChangeEvent<HTMLInputElement>): void {
    setReload(new Date().getTime());
    setSearchByName(event.target.value);
  }

  function handleSearchByDNI(event: ChangeEvent<HTMLInputElement>): void {
    setReload(new Date().getTime());
    setSearchByDNI(event.target.value);
  }

  function handleReload(): void {
    setSearchByDNI('');
    setSearchByName('');
    setReload(new Date().getTime());
  }

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={USER_CONFIG.title} breadcrumb={USER_CONFIG.breadcrumb} />
      </div>
      {/* Page content */}
      <div className='grid gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4'>
        {/* Left side content */}
        <Card className='col-span-1 border-none bg-slate-200 bg-transparent shadow-none md:col-span-4 lg:col-span-1 xl:col-span-1'>
          <CardContent className='p-0'>
            <div className='flex flex-col gap-6 md:w-full'>
              <Link to={`/users/create`} className='w-fit'>
                <Button variant={'default'} size={'sm'} className='gap-2'>
                  <PlusCircle className='h-4 w-4' strokeWidth={2} />
                  {USER_CONFIG.buttons.createUser}
                </Button>
              </Link>
              {/* Search by DNI */}
              <div className='flex flex-col space-y-4'>
                <h1 className='text-lg font-semibold'>{USER_CONFIG.search.label}</h1>
                <div className='relative w-full items-center'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    onClick={() => setSearchByName('')}
                    onChange={handleSearchByDNI}
                    value={searchByDNI}
                    type='number'
                    placeholder={USER_CONFIG.search.placeholder.dni}
                    className='bg-background pl-10 shadow-sm'
                  />
                  {searchByDNI && (
                    <button
                      onClick={() => setSearchByDNI('')}
                      className='absolute right-3 top-3 text-muted-foreground hover:text-black'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
              </div>
              {/* Search by firstname or lastname */}
              <div className='flex flex-col space-y-4'>
                <div className='relative w-full items-center'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    onClick={() => setSearchByDNI('')}
                    onChange={handleSearchByName}
                    value={searchByName}
                    type='text'
                    placeholder={USER_CONFIG.search.placeholder.name}
                    className='bg-background pl-10 shadow-sm'
                  />
                  {searchByName && (
                    <button
                      onClick={() => setSearchByName('')}
                      className='absolute right-3 top-3 text-muted-foreground hover:text-black'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
              </div>
              {errorMessage && (
                <div className='flex flex-row items-center text-xs font-medium text-rose-400'>{errorMessage}</div>
              )}
              {/* Enable tooltips */}
              <div className='flex flex-row items-center space-x-2'>
                <Switch id='tooltips' checked={helpChecked} onCheckedChange={() => setHelpChecked(!helpChecked)} />
                <Label htmlFor='tooltips'>{USER_CONFIG.buttons.activateHelp}</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Right side content */}
        <Card className='col-span-1 h-fit overflow-y-auto md:col-span-4 lg:col-span-3 xl:col-span-3'>
          <CardHeader>
            <div className='grid gap-2'>
              <CardTitle className='flex items-center justify-between'>
                <div className='flex items-center gap-3.5 px-2'>
                  <List className='h-4 w-4' strokeWidth={2} />
                  {USER_CONFIG.table.title}
                </div>
                <div className='flex items-center gap-2'>
                  {/* Sort */}
                  {/* {helpChecked ? (
                    <TooltipProvider delayDuration={0.3}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant={'tableHeader'} size={'miniIcon'} className='flex items-center'>
                            <ListFilter className='h-4 w-4' strokeWidth={2} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-medium'>{USER_CONFIG.tooltip.sort}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Button variant={'tableHeader'} size={'miniIcon'} className='flex items-center'>
                      <ListFilter className='h-4 w-4' strokeWidth={2} />
                    </Button>
                  )} */}
                  {/* Reload */}
                  {helpChecked ? (
                    <TooltipProvider delayDuration={0.3}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant={'tableHeader'} size={'miniIcon'} onClick={handleReload}>
                            <ListRestart className='h-4 w-4' strokeWidth={2} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-medium'>{USER_CONFIG.tooltip.reload}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Button variant={'tableHeader'} size={'miniIcon'} onClick={handleReload}>
                      <ListRestart className='h-4 w-4' strokeWidth={2} />
                    </Button>
                  )}
                  {/* Create user */}
                  {helpChecked ? (
                    <TooltipProvider delayDuration={0.3}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={'tableHeaderPrimary'}
                            size={'miniIcon'}
                            onClick={() => navigate('/users/create')}
                          >
                            <CirclePlus className='h-4 w-4' strokeWidth={2} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-medium'>{USER_CONFIG.tooltip.createUser}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Button variant={'tableHeaderPrimary'} size={'miniIcon'} onClick={() => navigate('/users/create')}>
                      <CirclePlus className='h-4 w-4' strokeWidth={2} />
                    </Button>
                  )}
                </div>
              </CardTitle>
            </div>
          </CardHeader>
          {/* Table */}
          <CardContent className='px-3'>
            <UsersDataTable
              key={reload}
              setReload={setReload}
              search={debouncedSearchByName || debouncedSearchByDNI}
              reload={reload}
              setErrorMessage={setErrorMessage}
              help={helpChecked}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
