// Icons: https://lucide.dev/icons/
import { CircleUser } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@core/components/ui/dropdown-menu';
// External imports
import { Link } from 'react-router-dom';
// Imports
import { HEADER_CONFIG } from '@config/layout/header.config';
// React component
export function User() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' size='icon' className='rounded-full'>
          <CircleUser className='h-5 w-5' />
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
