// Icons: https://lucide.dev/icons/
import { ChevronDown, PlusCircle } from 'lucide-react';
// External components
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@core/components/ui/dropdown-menu';
// External imports
import { useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import type { ILinks } from '@layout/interfaces/links.interface';
import { motion } from '@core/services/motion.service';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
// React component
export function ActionsButton({ links }: { links: ILinks[] }) {
  const [chevronScope, chevronAnimation] = useAnimate();
  const [open, setOpen] = useState<boolean>(false);
  const [plusScope, plusAnimation] = useAnimate();
  const navigate = useNavigate();
  const setMenuItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { t } = useTranslation();

  function handleClick(link: ILinks): void {
    navigate(link.path);
    setMenuItemSelected(link.menuId);
    setOpen(false);
  }

  useEffect(() => {
    chevronAnimation(chevronScope.current, { rotate: open === true ? '180deg' : '0deg' }, { duration: 0.25, ease: 'easeIn' });
  }, [chevronAnimation, chevronScope, open]);

  function handleAnimationOver(): void {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    plusAnimation(plusScope.current, keyframes, options);
  }

  function handleAnimationOut(): void {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    plusAnimation(plusScope.current, keyframes, options);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <section className='flex h-8 flex-row items-center rounded-md text-sm font-medium text-muted-foreground'>
        <button
          onClick={() => navigate(links[0].path)}
          onMouseOver={handleAnimationOver}
          onMouseOut={handleAnimationOut}
          className='flex h-8 w-fit items-center space-x-2 rounded-l-md bg-slate-100 px-3 py-1'
        >
          <PlusCircle ref={plusScope} size={16} strokeWidth={2} />
          <span>{links.find((link) => link.default)?.key ? t(links.find((link) => link.default)!.key) : t(links[0].key)}</span>
        </button>
        <DropdownMenuTrigger
          onClick={() => setOpen(true)}
          className='flex h-8 w-8 items-center rounded-l-none rounded-r-md border-l border-white bg-slate-200 px-2 transition-colors animate-in hover:bg-primary hover:text-white data-[state=open]:bg-primary data-[state=open]:text-white'
          asChild
        >
          <button className='h-8 w-8'>
            <ChevronDown ref={chevronScope} size={16} strokeWidth={2} />
          </button>
        </DropdownMenuTrigger>
      </section>
      <DropdownMenuContent align='end' onCloseAutoFocus={(e) => e.preventDefault()} className='w-fit p-1 text-xsm'>
        {links
          .filter((item, index, array) => (array.some((i) => i.default) ? !item.default : index !== 0))
          .map((link) => (
            <section key={crypto.randomUUID()}>
              <button
                className='flex w-full items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-primary hover:text-white'
                onClick={() => handleClick(link)}
              >
                <PlusCircle size={12} strokeWidth={2} />
                <span>{t(link.key)}</span>
              </button>
            </section>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
