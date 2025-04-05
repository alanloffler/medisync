// Icons: https://lucide.dev/icons/
import { CirclePlus, List, ListRestart, OctagonX, PlusCircle, Search, X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
import { Input } from '@core/components/ui/input';
// Components
import { CardHeaderSecondary } from '@core/components/common/header/CardHeaderSecondary';
import { DialogRemovedUsers } from '@users/components/common/DialogRemovedUsers';
import { PageHeader } from '@core/components/common/PageHeader';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
import { UsersDataTable } from '@users/components/UsersDataTable';
// External imports
import { Link, useNavigate } from 'react-router-dom';
import { type AnimationPlaybackControls, useAnimate } from 'motion/react';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import type { IUserSearch } from '@users/interfaces/user-search.interface';
import { APP_CONFIG } from '@config/app.config';
import { ERole } from '@core/auth/enums/role.enum';
import { EUserSearch } from '@users/enums/user-search.enum';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { USER_CONFIG } from '@config/users/users.config';
import { motion } from '@core/services/motion.service';
import { useAuth } from '@core/auth/useAuth';
import { useDebounce } from '@core/hooks/useDebounce';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
// React component
export default function Users() {
  const [openDialogRemovedUsers, setOpenDialogRemovedUsers] = useState<boolean>(false);
  const [reload, setReload] = useState<string>('');
  const [search, setSearch] = useState<IUserSearch>({ value: '', type: EUserSearch.NAME });
  const [addUserIconScope, addUserIconAnimation] = useAnimate();
  const [addUserScope, addUserAnimation] = useAnimate();
  const [reloadScope, reloadAnimation] = useAnimate();
  const [removedUsersScope, removedUsersAnimation] = useAnimate();
  const debouncedSearch = useDebounce<IUserSearch>(search, APP_CONFIG.debounceTime);
  const navigate = useNavigate();
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { t } = useTranslation();
  const { user } = useAuth();

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

  function addUserAnimationOver(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1.2).type('bounce').animate();
    return addUserAnimation(addUserScope.current, keyframes, options);
  }

  function addUserAnimationOut(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    return addUserAnimation(addUserScope.current, keyframes, options);
  }

  function reloadAnimationOver(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    return reloadAnimation(reloadScope.current, keyframes, options);
  }

  function reloadAnimationOut(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    return reloadAnimation(reloadScope.current, keyframes, options);
  }

  function addUserIconAnimationOver(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    return addUserIconAnimation(addUserIconScope.current, keyframes, options);
  }

  function addUserIconAnimationOut(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    return addUserIconAnimation(addUserIconScope.current, keyframes, options);
  }

  function removedUsersAnimationOver(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    return removedUsersAnimation(removedUsersScope.current, keyframes, options);
  }

  function removedUsersAnimationOut(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    return removedUsersAnimation(removedUsersScope.current, keyframes, options);
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
              <Link to={`${APP_CONFIG.appPrefix}/users/create`} className='w-fit'>
                <Button variant='default' size='sm' className='gap-2' onMouseOver={addUserAnimationOver} onMouseOut={addUserAnimationOut}>
                  <PlusCircle ref={addUserScope} size={16} strokeWidth={2} />
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
                  ref={reloadScope}
                  size='icon7'
                  variant='tableHeader'
                  onClick={handleReload}
                  onMouseOut={reloadAnimationOut}
                  onMouseOver={reloadAnimationOver}
                >
                  <ListRestart size={17} strokeWidth={1.5} />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper tooltip={t('tooltip.addUser')}>
                <Button
                  ref={addUserIconScope}
                  size='icon7'
                  variant='tableHeaderPrimary'
                  onClick={() => navigate(`${APP_CONFIG.appPrefix}/users/create`)}
                  onMouseOut={addUserIconAnimationOut}
                  onMouseOver={addUserIconAnimationOver}
                >
                  <CirclePlus size={17} strokeWidth={1.5} />
                </Button>
              </TooltipWrapper>
              {user?.role === ERole.Super && (
                <TooltipWrapper tooltip={t('tooltip.removedUsers')}>
                  <Button
                    className='text-red-400 hover:bg-red-400 hover:text-white'
                    ref={removedUsersScope}
                    size='icon7'
                    variant='tableHeader'
                    onClick={() => setOpenDialogRemovedUsers(true)}
                    onMouseOut={removedUsersAnimationOut}
                    onMouseOver={removedUsersAnimationOver}
                  >
                    <OctagonX size={17} strokeWidth={1.5} />
                  </Button>
                </TooltipWrapper>
              )}
            </section>
          </CardHeaderSecondary>
          {/* Table */}
          <CardContent>
            <UsersDataTable reload={reload} search={debouncedSearch} setSearch={setSearch} setReload={setReload} />
          </CardContent>
        </Card>
      </section>
      {/* Dialog: Removed users */}
      <DialogRemovedUsers open={openDialogRemovedUsers} setOpen={setOpenDialogRemovedUsers} />
    </main>
  );
}
