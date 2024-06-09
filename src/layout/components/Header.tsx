// App
import { HeaderMenu } from './HeaderMenu';
import { HeaderSearch } from './HeaderSearch';
import { User } from './User';
// React component
export function Header() {
  return (
    // <header className='sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
    <header className='sticky top-0 z-50 flex h-16 items-center gap-4 shadow-sm bg-background px-4 md:px-6'>
      <HeaderMenu />
      <div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <HeaderSearch />
        <User />
      </div>
    </header>
  );
}
