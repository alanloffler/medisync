// Icons: https://lucide.dev/icons/
import { ChevronDown, Filter, X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@core/components/ui/dropdown-menu';
// Components
import { LoadingText } from '@core/components/common/LoadingText';
// External imports
import { spring, useAnimate } from 'motion/react';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IArea } from '@core/interfaces/area.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { ISpecialization } from '@core/interfaces/specialization.interface';
import { AreaService } from '@core/services/area.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Interface
interface ISelectSpecialties {
  callback: (value: ISpecialization) => void;
  clear: () => void;
  dropdownPlaceholder: string;
  setDropdownPlaceholder: (placeholder: string) => void;
  specSelected: string | undefined;
}
// React component
export function SelectSpecialties({ callback, clear, dropdownPlaceholder, setDropdownPlaceholder, specSelected }: ISelectSpecialties) {
  const [specializationsScope, specializationsAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation();

  const {
    data: areas,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useQuery<IResponse<IArea[]>>({
    queryKey: ['areas', 'findAll'],
    queryFn: async () => await AreaService.findAll(),
    retry: 1,
  });

  useEffect(() => {
    if (isSuccess) {
      if (specSelected === undefined) setDropdownPlaceholder(UtilsString.upperCase(t('label.specialization')));
      if (specSelected !== undefined) setDropdownPlaceholder(UtilsString.upperCase(specSelected));
    }
  }, [isSuccess, t, specSelected, setDropdownPlaceholder]);

  useEffect(() => {
    if (isError) {
      setDropdownPlaceholder(t('error.default'));
      addNotification({ type: 'error', message: error?.message });
    }
  }, [addNotification, error?.message, isError, setDropdownPlaceholder, t]);

  return (
    <section className='flex flex-row items-center justify-start space-x-3 py-3'>
      <div className='flex items-center space-x-2 text-sm font-medium text-slate-500'>
        <Filter size={16} strokeWidth={2} />
        <span>{t('search.filter.by')}</span>
      </div>
      <DropdownMenu>
        <div className='flex flex-row items-center space-x-2'>
          <DropdownMenuTrigger
            disabled={!areas?.data.length}
            className='flex w-fit items-center space-x-2 rounded-md bg-white px-2 py-1 text-sm shadow-sm'
          >
            {isLoading && <LoadingText suffix='...' text={t('loading.default')} />}
            {isError && <span className='text-rose-400'>{dropdownPlaceholder}</span>}
            {isSuccess && !specSelected && <span>{dropdownPlaceholder}</span>}
            {isSuccess && specSelected && <span>{UtilsString.upperCase(specSelected)}</span>}
            <ChevronDown size={16} strokeWidth={2} />
          </DropdownMenuTrigger>
          {specSelected !== undefined && (
            <Button
              ref={specializationsScope}
              variant='default'
              size='miniIcon'
              onClick={clear}
              onMouseOver={() =>
                specializationsAnimation(specializationsScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
              }
              onMouseOut={() =>
                specializationsAnimation(specializationsScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
              }
              className='h-5 w-5 rounded-full bg-black p-0 text-xs font-medium text-white hover:bg-black/70'
            >
              <X size={14} strokeWidth={2} />
            </Button>
          )}
        </div>
        <DropdownMenuContent className='w-fit' align='center' onCloseAutoFocus={(e) => e.preventDefault()}>
          {areas &&
            areas?.data.length > 0 &&
            areas?.data.map((area) => (
              <DropdownMenuSub key={area._id}>
                <DropdownMenuSubTrigger>
                  <span>{UtilsString.upperCase(area.name)}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {area.specializations.map((spec) => (
                      <DropdownMenuItem key={spec._id} onClick={() => callback(spec)}>
                        <span>{UtilsString.upperCase(spec.name)}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
