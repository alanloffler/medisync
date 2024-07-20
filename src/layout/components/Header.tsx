// Icons: https://lucide.dev/icons/
import { Settings } from 'lucide-react';
// App components
import { HeaderMenu } from '@/layout/components/HeaderMenu';
import { User } from '@/layout/components/User';
// App
import { Link } from 'react-router-dom';
// React component
export function Header() {
  return (
    <header className='sticky top-0 z-50 flex h-16 items-center gap-4 shadow-sm bg-background px-4 md:px-6'>
      <HeaderMenu />
      <div className='flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <Link to='/settings'>
          <Settings className='h-5 w-5' strokeWidth={2} />
        </Link>
        <User />
      </div>
    </header>
  );
}
