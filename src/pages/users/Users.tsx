// Icons: https://lucide.dev/icons/
import { CirclePlus, List, ListRestart, PlusCircle, Search, X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@core/components/ui/card';
import { Input } from '@core/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@core/components/ui/tooltip';
// Components
import { PageHeader } from '@core/components/common/PageHeader';
import { UsersDataTable } from '@users/components/UsersDataTable';
// External imports
import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { spring } from 'framer-motion';
import { useAnimate } from 'framer-motion/mini';
// Imports
import { EUserSearch, type IUserSearch } from '@users/interfaces/user-search.interface';
import { USER_CONFIG } from '@config/user.config';
import { useDebounce } from '@core/hooks/useDebounce';
import { useHelpStore } from '@settings/stores/help.store';
// React component
export default function Users() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [reload, setReload] = useState<number>(0);
  const [search, setSearch] = useState<IUserSearch>({ value: '', type: EUserSearch.NAME });
  const [createMiniScope, createMiniAnimation] = useAnimate();
  const [createScope, createAnimation] = useAnimate();
  const [reloadScope, reloadAnimation] = useAnimate();
  const debouncedSearch = useDebounce<IUserSearch>(search, USER_CONFIG.search.debounceTime);
  const navigate = useNavigate();
  const { help } = useHelpStore();

  function handleSearchByName(event: ChangeEvent<HTMLInputElement>): void {
    setSearch({ value: event.target.value, type: EUserSearch.NAME });
  }

  function handleSearchByDNI(event: ChangeEvent<HTMLInputElement>): void {
    setSearch({ value: event.target.value, type: EUserSearch.DNI });
  }

  function handleReload(): void {
    setSearch({ value: '', type: EUserSearch.NAME });
    setReload(new Date().getTime());
  }

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Section: Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={USER_CONFIG.title} breadcrumb={USER_CONFIG.breadcrumb} />
      </div>
      {/* Section: Page content */}
      <div className='grid gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4'>
        {/* Section: Left side content */}
        <Card className='col-span-1 border-none bg-slate-200 bg-transparent shadow-none md:col-span-4 lg:col-span-1 xl:col-span-1'>
          <CardContent className='p-0'>
            <div className='flex flex-col gap-6 md:w-full'>
              <Link to={`/users/create`} className='w-fit'>
                <Button
                  variant={'default'}
                  size={'sm'}
                  className='gap-2'
                  onMouseOver={() =>
                    createAnimation(createScope.current, { scale: 1.2 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                  }
                  onMouseOut={() => createAnimation(createScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })}
                >
                  <PlusCircle ref={createScope} size={16} strokeWidth={2} />
                  {USER_CONFIG.buttons.createUser}
                </Button>
              </Link>
              {/* Search by DNI */}
              <div className='flex flex-col space-y-4'>
                <h1 className='text-lg font-semibold'>{USER_CONFIG.search.label}</h1>
                <div className='relative w-full items-center md:w-1/3 lg:w-full'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    onClick={() => search.value !== '' && search.type === EUserSearch.NAME && setSearch({ value: '', type: EUserSearch.DNI })}
                    onChange={handleSearchByDNI}
                    value={search.type === EUserSearch.DNI ? search.value : ''}
                    type='number'
                    placeholder={USER_CONFIG.search.placeholder.dni}
                    className='bg-background pl-10 shadow-sm'
                  />
                  {search.type === EUserSearch.DNI && search.value && (
                    <button
                      onClick={() => setSearch({ value: '', type: EUserSearch.DNI })}
                      className='absolute right-3 top-3 text-muted-foreground hover:text-black'
                    >
                      <X size={16} strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>
              {/* Search by firstname or lastname */}
              <div className='flex flex-col space-y-4'>
                <div className='relative w-full items-center md:w-1/3 lg:w-full'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    onClick={() => search.value !== '' && search.type === EUserSearch.DNI && setSearch({ value: '', type: EUserSearch.NAME })}
                    onChange={handleSearchByName}
                    value={search.type === EUserSearch.NAME ? search.value : ''}
                    type='text'
                    placeholder={USER_CONFIG.search.placeholder.name}
                    className='bg-background pl-10 shadow-sm'
                  />
                  {search.type === EUserSearch.NAME && search.value && (
                    <button
                      onClick={() => setSearch({ value: '', type: EUserSearch.NAME })}
                      className='absolute right-3 top-3 text-muted-foreground hover:text-black'
                    >
                      <X size={16} strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>
              {errorMessage && <div className='flex flex-row items-center text-xs font-medium text-rose-400'>{errorMessage}</div>}
            </div>
          </CardContent>
        </Card>
        {/* Section: Right side content */}
        <Card className='col-span-1 h-fit overflow-y-auto md:col-span-4 lg:col-span-3 xl:col-span-3'>
          <CardHeader>
            <div className='grid gap-2'>
              <CardTitle className='flex items-center justify-between'>
                <div className='flex items-center gap-3.5 px-2'>
                  <List size={16} strokeWidth={2} />
                  {USER_CONFIG.table.title}
                </div>
                <div className='flex items-center gap-2'>
                  {/* Reload */}
                  {help ? (
                    <TooltipProvider delayDuration={0.3}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            ref={reloadScope}
                            size={'miniIcon'}
                            variant={'tableHeader'}
                            onClick={handleReload}
                            onMouseOver={() =>
                              reloadAnimation(reloadScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                            }
                            onMouseOut={() =>
                              reloadAnimation(reloadScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                            }
                          >
                            <ListRestart size={16} strokeWidth={2} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-medium'>{USER_CONFIG.tooltip.reload}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Button
                      size={'miniIcon'}
                      variant={'tableHeader'}
                      ref={reloadScope}
                      onClick={handleReload}
                      onMouseOver={() =>
                        reloadAnimation(reloadScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                      }
                      onMouseOut={() =>
                        reloadAnimation(reloadScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                      }
                    >
                      <ListRestart size={16} strokeWidth={2} />
                    </Button>
                  )}
                  {/* Create user */}
                  {help ? (
                    <TooltipProvider delayDuration={0.3}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size={'miniIcon'}
                            variant={'tableHeaderPrimary'}
                            ref={createMiniScope}
                            onClick={() => navigate('/users/create')}
                            onMouseOver={() =>
                              createMiniAnimation(
                                createMiniScope.current,
                                { scale: 1.2 },
                                { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 },
                              )
                            }
                            onMouseOut={() =>
                              createMiniAnimation(createMiniScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                            }
                          >
                            <CirclePlus size={16} strokeWidth={2} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-medium'>{USER_CONFIG.tooltip.createUser}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Button
                      ref={createMiniScope}
                      size={'miniIcon'}
                      variant={'tableHeaderPrimary'}
                      onClick={() => navigate('/users/create')}
                      onMouseOver={() =>
                        createMiniAnimation(createMiniScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                      }
                      onMouseOut={() =>
                        createMiniAnimation(createMiniScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                      }
                    >
                      <CirclePlus size={16} strokeWidth={2} />
                    </Button>
                  )}
                </div>
              </CardTitle>
            </div>
          </CardHeader>
          {/* Table */}
          <CardContent className='px-3'>
            <UsersDataTable
              help={help}
              key={reload}
              reload={reload}
              search={debouncedSearch}
              setErrorMessage={setErrorMessage}
              setReload={setReload}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
