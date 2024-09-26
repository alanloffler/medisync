// Icons: https://lucide.dev/icons/
import { CircleUser } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '@/core/components/ui/dropdown-menu';
import { DropdownMenuContent } from '@/core/components/ui/dropdown-menu';
import { DropdownMenuItem } from '@/core/components/ui/dropdown-menu';
import { DropdownMenuLabel } from '@/core/components/ui/dropdown-menu';
import { DropdownMenuSeparator } from '@/core/components/ui/dropdown-menu';
// App
import { HEADER_CONFIG } from '../../config/layout/header.config';
import { Link } from 'react-router-dom';
// React component
export function User() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' size='icon' className='rounded-full'>
          <CircleUser className='h-5 w-5' />
          <span className='sr-only'>Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{HEADER_CONFIG.user.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {HEADER_CONFIG.user.menuItems.map((item) => (
          <DropdownMenuItem key={item.id}>
            <Link key={item.id} to={item.path} className='w-full'>
              {item.title}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
