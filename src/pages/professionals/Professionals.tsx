// Icons: https://lucide.dev/icons/
import { CirclePlus, List, ListRestart, PlusCircle, Search, X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
import { Input } from '@core/components/ui/input';
// Components
import { CardHeaderSecondary } from '@core/components/common/header/CardHeaderSecondary';
import { PageHeader } from '@core/components/common/PageHeader';
import { ProfessionalsDataTable } from '@professionals/components/ProfessionalsDataTable';
import { SelectSpecialties } from '@core/components/common/SelectSpecialties';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { type AnimationPlaybackControls, useAnimate } from 'motion/react';
import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import type { IProfessionalSearch } from '@professionals/interfaces/professional-search.interface';
import type { ISpecialization } from '@core/interfaces/specialization.interface';
import { APP_CONFIG } from '@config/app.config';
import { EProfessionalSearch } from '@professionals/enums/professional-search.enum';
import { PROFESSIONALS_CONFIG as PROF_CONFIG } from '@config/professionals/professionals.config';
import { UtilsString } from '@core/services/utils/string.service';
import { motion } from '@core/services/motion.service';
import { useDebounce } from '@core/hooks/useDebounce';
// React component
export default function Professionals() {
  const [debounceTime, setDebounceTime] = useState<number>(APP_CONFIG.debounceTime);
  const [dropdownPlaceholder, setDropdownPlaceholder] = useState<string>('');
  const [reload, setReload] = useState<string>('');
  const [search, setSearch] = useState<IProfessionalSearch>({ value: '', type: EProfessionalSearch.INPUT });
  const [specSelected, setSpecSelected] = useState<string | undefined>(undefined);
  const [addProfScope, addProfAnimation] = useAnimate();
  const [addProfIconScope, addProfIconAnimation] = useAnimate();
  const [reloadScope, reloadAnimation] = useAnimate();
  const debouncedSearch = useDebounce<IProfessionalSearch>(search, debounceTime);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearchByProfessional = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setDebounceTime(APP_CONFIG.debounceTime);
      setSpecSelected(undefined);
      setSearch({ value: event.target.value, type: EProfessionalSearch.INPUT });
    },
    [setDebounceTime, setSearch, setSpecSelected],
  );

  const handleSearchBySpecialization = useCallback(
    (specialization: ISpecialization): void => {
      setDebounceTime(0);
      setSpecSelected(specialization.name);
      setDropdownPlaceholder(UtilsString.upperCase(specialization.name, 'each'));
      setSearch({ value: specialization._id, type: EProfessionalSearch.DROPDOWN });
    },
    [setSearch, setDropdownPlaceholder, setSpecSelected, setDebounceTime],
  );

  const handleClearSearch = useCallback((): void => {
    setSpecSelected(undefined);
    setSearch({ value: '', type: EProfessionalSearch.INPUT });
  }, [setSearch, setSpecSelected]);

  const handleReload = useCallback((): void => {
    setSearch({ value: '', type: EProfessionalSearch.INPUT });
    setReload(crypto.randomUUID());
  }, [setSearch, setReload]);

  function addProfessionalAnimationOver(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1.2).type('bounce').animate();
    return addProfAnimation(addProfScope.current, keyframes, options);
  }

  function addProfessionalAnimationOut(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    return addProfAnimation(addProfScope.current, keyframes, options);
  }

  function reloadAnimationOver(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    return reloadAnimation(reloadScope.current, keyframes, options);
  }

  function reloadAnimationOut(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    return reloadAnimation(reloadScope.current, keyframes, options);
  }

  function addProfessionalIconAnimationOver(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    return addProfIconAnimation(addProfIconScope.current, keyframes, options);
  }

  function addProfessionalIconAnimationOut(): AnimationPlaybackControls {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    return addProfIconAnimation(addProfIconScope.current, keyframes, options);
  }

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.professionals')} breadcrumb={PROF_CONFIG.breadcrumb} />
      </header>
      {/* Section: Page content */}
      <section className='grid gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4'>
        <Card className='col-span-1 border-none bg-slate-200 bg-transparent shadow-none md:col-span-4 lg:col-span-1 xl:col-span-1'>
          <CardContent className='p-0'>
            <section className='flex flex-col gap-6 md:w-full'>
              <Button
                variant='default'
                size='sm'
                className='w-fit space-x-2'
                onClick={() => navigate(`${APP_CONFIG.appPrefix}/professionals/create`)}
                onMouseOver={addProfessionalAnimationOver}
                onMouseOut={addProfessionalAnimationOut}
              >
                <div ref={addProfScope}>
                  <PlusCircle size={16} strokeWidth={2} />
                </div>
                <span>{t('button.addProfessional')}</span>
              </Button>
              <div className='flex flex-col space-y-2'>
                <div className='relative w-full'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    onChange={handleSearchByProfessional}
                    value={search.type === EProfessionalSearch.INPUT ? search.value : ''}
                    type='text'
                    placeholder={t('search.professional')}
                    className='bg-background pl-9 shadow-sm md:w-1/2 lg:w-full'
                  />
                  {search.type === EProfessionalSearch.INPUT && search.value && (
                    <button
                      onClick={() => setSearch({ value: '', type: EProfessionalSearch.INPUT })}
                      className='absolute right-3 top-3 text-muted-foreground hover:text-black'
                    >
                      <X size={16} strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
        <section className='col-span-1 space-y-3 overflow-y-auto md:col-span-4 lg:col-span-3 xl:col-span-3'>
          <SelectSpecialties
            callback={handleSearchBySpecialization}
            clear={handleClearSearch}
            dropdownPlaceholder={dropdownPlaceholder}
            setDropdownPlaceholder={setDropdownPlaceholder}
            specSelected={specSelected}
          />
          {/* Section: Professionals Table */}
          <Card>
            <CardHeaderSecondary title={t('cardTitle.professionalsList')} icon={<List size={18} strokeWidth={2} />}>
              <section className='flex items-center space-x-3'>
                <TooltipWrapper tooltip={t('tooltip.reload')}>
                  <Button
                    ref={reloadScope}
                    size='icon7'
                    variant='tableHeader'
                    onClick={handleReload}
                    onMouseOver={reloadAnimationOver}
                    onMouseOut={reloadAnimationOut}
                  >
                    <ListRestart size={17} strokeWidth={1.5} />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltip={t('tooltip.addProfessional')}>
                  <Button
                    ref={addProfIconScope}
                    size='icon7'
                    variant='tableHeaderPrimary'
                    onClick={() => navigate(`${APP_CONFIG.appPrefix}/professionals/create`)}
                    onMouseOver={addProfessionalIconAnimationOver}
                    onMouseOut={addProfessionalIconAnimationOut}
                  >
                    <CirclePlus size={17} strokeWidth={1.5} />
                  </Button>
                </TooltipWrapper>
              </section>
            </CardHeaderSecondary>
            <CardContent>
              <ProfessionalsDataTable clearDropdown={handleClearSearch} reload={reload} search={debouncedSearch} setReload={setReload} />
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}
