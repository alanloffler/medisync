// Icons: https://lucide.dev/icons/
import { ChevronDown, Plus } from 'lucide-react';
// External components
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/core/components/ui/dropdown-menu';
import { Separator } from '@/core/components/ui/separator';
// External imports
import { spring } from 'framer-motion';
import { useAnimate } from 'framer-motion/mini';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Imports
import type { ILinks } from '@/layout/interfaces/links.interface';
import { useHeaderMenuStore } from '@/layout/stores/header-menu.service';
// React component
export function ActionsButton({ links }: { links: ILinks[] }) {
  const [chevronScope, chevronAnimation] = useAnimate();
  const [open, setOpen] = useState<boolean>(false);
  const [plusScope, plusAnimation] = useAnimate();
  const navigate = useNavigate();
  const setMenuItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);

  function handleClick(link: ILinks): void {
    navigate(link.path);
    setMenuItemSelected(link.menuId);
    setOpen(false);
  }

  useEffect(() => {
    chevronAnimation(chevronScope.current, { rotate: open === true ? '180deg' : '0deg' }, { duration: 0.25, ease: 'easeIn' });
  }, [chevronAnimation, chevronScope, open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <section className='flex h-8 flex-row items-center rounded-md text-sm font-medium text-white'>
        <button
          onClick={() => navigate(links[0].path)}
          onMouseOver={() => plusAnimation(plusScope.current, { scale: 1.5 }, { duration: 1, ease: 'linear', type: spring, bounce: 0.7 })}
          onMouseOut={() => plusAnimation(plusScope.current, { scale: 1 }, { duration: 1, ease: 'linear', type: spring, bounce: 0.7 })}
          className='flex h-8 w-fit items-center space-x-2 rounded-l-md bg-primary/75 px-3 py-1'
        >
          <Plus ref={plusScope} size={16} strokeWidth={2} />
          <span>{links.find((link) => link.default)?.title || links[0].title}</span>
        </button>
        <DropdownMenuTrigger
          onClick={() => setOpen(true)}
          className='flex h-8 w-8 items-center rounded-l-none rounded-r-md bg-primary px-2 hover:bg-primary/90'
          asChild
        >
          <button className='h-8 w-8'>
            <ChevronDown ref={chevronScope} size={16} strokeWidth={2} />
          </button>
        </DropdownMenuTrigger>
      </section>
      <DropdownMenuContent align='end' onCloseAutoFocus={(e) => e.preventDefault()} className='w-fit p-0 text-sm font-medium text-white'>
        {links
          .filter((item, index, array) => (array.some((i) => i.default) ? !item.default : index !== 0))
          .map((link, index) => (
            <section key={crypto.randomUUID()}>
              <button
                className='flex w-full items-center space-x-2 rounded-none bg-primary/75 px-2 py-1 hover:bg-primary'
                onClick={() => handleClick(link)}
              >
                <Plus strokeWidth={2} className='h-4 w-4' />
                <span>{link.title}</span>
              </button>
              {index < links.length - 1 && <Separator className='bg-primary/50' />}
            </section>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
