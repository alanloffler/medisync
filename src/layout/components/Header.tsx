// Icons: https://lucide.dev/icons/
import { Settings } from 'lucide-react';
// Components
import { ActionsButton } from '@/layout/components/ActionsButton';
import { HeaderMenu } from '@/layout/components/HeaderMenu';
import { User } from '@/layout/components/User';
// External imports
import { Link } from 'react-router-dom';
// Imports
import { HEADER_CONFIG } from '@/config/layout/header.config';
import type { ILinks } from '@/layout/interfaces/links.interface';
// React component
export function Header() {
  const links: ILinks[] = HEADER_CONFIG.actionsButton;

  return (
    <header className='sticky top-0 z-50 flex h-16 items-center gap-4 bg-background px-4 shadow-sm md:px-6'>
      <HeaderMenu />
      <div className='flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <ActionsButton links={links} />
        <Link to='/settings'>
          <Settings className='h-5 w-5' strokeWidth={2} />
        </Link>
        <User />
      </div>
    </header>
  );
}
