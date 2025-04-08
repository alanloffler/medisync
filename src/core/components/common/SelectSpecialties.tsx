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
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingText } from '@core/components/common/LoadingText';
// External imports
import { AxiosError } from 'axios';
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
interface IProps {
  callback: (value: ISpecialization) => void;
  clear: () => void;
  dropdownPlaceholder?: string;
  setDropdownPlaceholder: (placeholder?: string) => void;
  specSelected: string | undefined;
}
// React component
export function SelectSpecialties({ callback, clear, dropdownPlaceholder, setDropdownPlaceholder, specSelected }: IProps) {
  const [specializationsScope, specializationsAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation();

  const {
    data: areas,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useQuery<IResponse<IArea[]>, AxiosError<IResponse>>({
    queryKey: ['areas', 'findAll'],
    queryFn: async () => await AreaService.findAll(),
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
      addNotification({ type: 'error', message: error?.response?.data.message });
    }
  }, [addNotification, error, isError, setDropdownPlaceholder, t]);

  return (
    <section className='flex flex-row items-center justify-start space-x-3 pb-3'>
      <div className='flex items-center space-x-2 text-sm font-medium text-slate-500'>
        <Filter size={17} strokeWidth={1.5} />
        <span>{t('search.filter.by')}</span>
      </div>
      <DropdownMenu>
        <section className='flex flex-row items-center space-x-3'>
          <DropdownMenuTrigger
            disabled={!areas?.data.length}
            className='flex min-h-8 w-fit items-center space-x-2 rounded-md bg-white px-2.5 py-1 text-xsm shadow-sm'
          >
            {isLoading && <LoadingText suffix='...' text={t('loading.default')} />}
            {isError && <InfoCard size='xsm' text={dropdownPlaceholder} type='flat-colored' variant='error' />}
            {isSuccess && !specSelected && <span>{dropdownPlaceholder}</span>}
            {isSuccess && specSelected && <span>{UtilsString.upperCase(specSelected)}</span>}
            <ChevronDown size={16} strokeWidth={2} />
          </DropdownMenuTrigger>
          {specSelected !== undefined && (
            <Button
              ref={specializationsScope}
              size='icon5'
              variant='clear'
              onClick={clear}
              onMouseOver={() =>
                specializationsAnimation(specializationsScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
              }
              onMouseOut={() =>
                specializationsAnimation(specializationsScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
              }
            >
              <X size={14} strokeWidth={2} />
            </Button>
          )}
        </section>
        <DropdownMenuContent className='w-fit [&_svg]:h-3 [&_svg]:w-3' align='center' onCloseAutoFocus={(e) => e.preventDefault()}>
          {areas &&
            areas?.data.length > 0 &&
            areas?.data.map((area) => (
              <DropdownMenuSub key={area._id}>
                <DropdownMenuSubTrigger className='p-1.5 text-xsm'>
                  <span>{UtilsString.upperCase(area.name)}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {area.specializations.map((spec) => (
                      <DropdownMenuItem className='p-1.5 text-xsm' key={spec._id} onClick={() => callback(spec)}>
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
