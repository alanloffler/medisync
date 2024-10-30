// Icons: https://lucide.dev/icons/
import { Menu, Package2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@core/components/ui/sheet';
// Components
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
// External imports
import { Link } from 'react-router-dom';
import { MouseEvent } from 'react';
// Imports
import { HEADER_CONFIG } from '@config/layout/header.config';
// React component
export function HeaderMenu() {
  const itemSelected = useHeaderMenuStore((state) => state.headerMenuSelected);
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);

  function handleMenuItem(e: MouseEvent<HTMLElement>): void {
    setItemSelected(parseInt(e.currentTarget.id));
  }

  return (
    <>
      <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Link to='/' className='flex items-center gap-2 font-semibold md:text-base'>
          <Package2 className='h-6 w-6' />
          <span>{HEADER_CONFIG.appName}</span>
        </Link>
        {HEADER_CONFIG.headerMenu.map((item) => (
          <Link
            id={`${item.id}`}
            key={item.id}
            to={item.path}
            onClick={(e) => handleMenuItem(e)}
            className={`${itemSelected === item.id ? 'text-primary' : 'text-muted-foreground'} transition-colors hover:text-primary`}
          >
            <span className='text-base'>{item.title}</span>
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
            <Menu className='h-5 w-5' />
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <nav className='grid gap-6 text-lg font-medium'>
            <Link to='/' className='flex items-center gap-2 text-lg font-semibold'>
              <Package2 className='h-6 w-6' />
              <span>{HEADER_CONFIG.appName}</span>
            </Link>
            {HEADER_CONFIG.headerMenu.map((item) => (
              <Link
                id={`${item.id}`}
                key={item.id}
                to={item.path}
                onClick={(e) => handleMenuItem(e)}
                className={`${itemSelected === item.id ? 'text-primary' : 'text-muted-foreground'} transition-colors hover:text-primary`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
