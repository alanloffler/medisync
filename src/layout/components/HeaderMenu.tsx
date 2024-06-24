// Icons: https://lucide.dev/icons/
import { Package2, Menu } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/core/components/ui/sheet';
// App components
import { useHeaderMenuStore } from '../stores/header-menu.service';
// App
import { HEADER_CONFIG } from '@/layout/config/header.config';
import { Link } from 'react-router-dom';
import { MouseEvent } from 'react';
// React component
export function HeaderMenu() {
  const itemSelected = useHeaderMenuStore((state) => state.headerMenuSelected);
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);

  const handleMenuItem = (e: MouseEvent<HTMLElement>) => {
    setItemSelected(parseInt(e.currentTarget.id));
  };

  return (
    <>
      <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Link to='/' className='flex items-center gap-2 font-semibold md:text-base'>
          <Package2 className='h-6 w-6' />
          <span>{HEADER_CONFIG.appName}</span>
        </Link>
        {HEADER_CONFIG.headerMenu.map((item) => (
          <Link id={`${item.id}`} key={item.id} to={item.path} onClick={(e) => handleMenuItem(e)} className={`${itemSelected === item.id ? 'text-primary' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>
            <span className='text-base'>{item.title}</span>
          </Link>
        ))}
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <nav className='grid gap-6 text-lg font-medium'>
            <Link to='/' className='flex items-center gap-2 text-lg font-semibold'>
              <Package2 className='h-6 w-6' />
              <span>{HEADER_CONFIG.appName}</span>
            </Link>
            {HEADER_CONFIG.headerMenu.map((item) => (
              <Link id={`${item.id}`} key={item.id} to={item.path} onClick={(e) => handleMenuItem(e)} className={`${itemSelected === item.id ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
