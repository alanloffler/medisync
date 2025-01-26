// Icons: https://lucide.dev/icons/
import { CirclePlus, List, ListRestart, PlusCircle, Search, X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
import { Input } from '@core/components/ui/input';
// Components
import { CardHeaderSecondary } from '@core/components/common/header/CardHeaderSecondary';
import { PageHeader } from '@core/components/common/PageHeader';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
import { UsersDataTable } from '@users/components/UsersDataTable';
// External imports
import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { spring, useAnimate } from 'motion/react';
import { useTranslation } from 'react-i18next';
// Imports
import type { IUserSearch } from '@users/interfaces/user-search.interface';
import { APP_CONFIG } from '@config/app.config';
import { EUserSearch } from '@users/enums/user-search.enum';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { USER_CONFIG } from '@config/users/users.config';
import { useDebounce } from '@core/hooks/useDebounce';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
// React component
export default function Users() {
  const [reload, setReload] = useState<string>('');
  const [search, setSearch] = useState<IUserSearch>({ value: '', type: EUserSearch.NAME });
  const [createMiniScope, createMiniAnimation] = useAnimate();
  const [createScope, createAnimation] = useAnimate();
  const [reloadScope, reloadAnimation] = useAnimate();
  const debouncedSearch = useDebounce<IUserSearch>(search, APP_CONFIG.debounceTime);
  const navigate = useNavigate();
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { t } = useTranslation();

  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[3].id);
  }, [setItemSelected]);

  function handleSearchByName(event: ChangeEvent<HTMLInputElement>): void {
    setSearch({ value: event.target.value, type: EUserSearch.NAME });
  }

  function handleSearchByDNI(event: ChangeEvent<HTMLInputElement>): void {
    setSearch({ value: event.target.value, type: EUserSearch.IDENTITY });
  }

  function handleReload(): void {
    setSearch({ value: '', type: EUserSearch.NAME });
    setReload(crypto.randomUUID());
  }

  return (
    <main className='flex flex-1 flex-col gap-8 p-4 md:p-8'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.users')} breadcrumb={USER_CONFIG.breadcrumb} />
      </header>
      {/* Section: Page content */}
      <section className='grid gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4'>
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
                  {t('button.addUser')}
                </Button>
              </Link>
              {/* Search by DNI */}
              <div className='flex flex-col space-y-4'>
                <h1 className='text-lg font-semibold'>{t('search.user')}</h1>
                <div className='relative w-full items-center md:w-1/3 lg:w-full'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    onClick={() => search.value !== '' && search.type === EUserSearch.NAME && setSearch({ value: '', type: EUserSearch.IDENTITY })}
                    onChange={handleSearchByDNI}
                    value={search.type === EUserSearch.IDENTITY ? search.value : ''}
                    type='number'
                    placeholder={t('label.identityCard')}
                    className='bg-background pl-10 shadow-sm'
                  />
                  {search.type === EUserSearch.IDENTITY && search.value && (
                    <button
                      onClick={() => setSearch({ value: '', type: EUserSearch.IDENTITY })}
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
                    onClick={() => search.value !== '' && search.type === EUserSearch.IDENTITY && setSearch({ value: '', type: EUserSearch.NAME })}
                    onChange={handleSearchByName}
                    value={search.type === EUserSearch.NAME ? search.value : ''}
                    type='text'
                    placeholder={t('table.header.name')}
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
            </div>
          </CardContent>
        </Card>
        {/* Section: Right side content */}
        <Card className='col-span-1 h-fit overflow-y-auto md:col-span-4 lg:col-span-3 xl:col-span-3'>
          <CardHeaderSecondary title={t('cardTitle.usersList')} icon={<List size={18} strokeWidth={2} />}>
            <section className='flex items-center space-x-3'>
              <TooltipWrapper tooltip={t('tooltip.reload')}>
                <Button
                  size='miniIcon'
                  variant='tableHeader'
                  ref={reloadScope}
                  onClick={handleReload}
                  onMouseOver={() =>
                    reloadAnimation(reloadScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                  }
                  onMouseOut={() => reloadAnimation(reloadScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })}
                >
                  <ListRestart size={17} strokeWidth={1.5} />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper tooltip={t('tooltip.addUser')}>
                <Button
                  ref={createMiniScope}
                  size='miniIcon'
                  variant='tableHeaderPrimary'
                  onClick={() => navigate('/users/create')}
                  onMouseOver={() =>
                    createMiniAnimation(createMiniScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                  }
                  onMouseOut={() =>
                    createMiniAnimation(createMiniScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                  }
                >
                  <CirclePlus size={17} strokeWidth={1.5} />
                </Button>
              </TooltipWrapper>
            </section>
          </CardHeaderSecondary>
          {/* Table */}
          <CardContent>
            <UsersDataTable reload={reload} search={debouncedSearch} setSearch={setSearch} setReload={setReload} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
