import type React from 'react';
import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, Settings, FileText, Users, BarChart, HelpCircle, Menu, Package2 } from 'lucide-react';
import { cn } from '@lib/utils';
import { Button } from '@core/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@core/components/ui/tooltip';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { useTranslation } from 'react-i18next';

import { DynamicIcon } from 'lucide-react/dynamic';
import { APP_CONFIG } from '@config/app.config';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function SidebarNav() {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  // const navItems: NavItem[] = [
  //   {
  //     title: 'Tablero',
  //     href: '/dashboard',
  //     icon: <Home className='h-5 w-5' />,
  //   },
  //   {
  //     title: 'Projects',
  //     href: '/projects',
  //     icon: <FileText className='h-5 w-5' />,
  //   },
  //   {
  //     title: 'Team',
  //     href: '/team',
  //     icon: <Users className='h-5 w-5' />,
  //   },
  //   {
  //     title: 'Analytics',
  //     href: '/analytics',
  //     icon: <BarChart className='h-5 w-5' />,
  //   },
  //   {
  //     title: 'Settings',
  //     href: '/settings',
  //     icon: <Settings className='h-5 w-5' />,
  //   },
  //   {
  //     title: 'Help',
  //     href: '/help',
  //     icon: <HelpCircle className='h-5 w-5' />,
  //   },
  // ];

  return (
    <>
      {/* Mobile menu button */}
      <Button variant='ghost' size='icon' className='fixed left-4 top-4 z-50 md:hidden' onClick={() => setMobileOpen(!mobileOpen)}>
        <Menu className='h-5 w-5' />
        <span className='sr-only'>Toggle menu</span>
      </Button>

      {/* Sidebar navigation */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300',
          expanded ? 'w-48' : 'w-16',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className='flex h-16 items-center justify-between border-b px-4'>
          <Link to={`${APP_CONFIG.appPrefix}`} className='flex items-center gap-2 font-semibold md:text-base'>
            <Package2 className='h-6 w-6' />
            {expanded && <span>{t('appName')}</span>}
          </Link>
          <Button variant='ghost' size='icon' className={cn('ml-auto', expanded ? '' : 'mx-auto')} onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronLeft className='h-5 w-5' /> : <ChevronRight className='h-5 w-5' />}
            <span className='sr-only'>{expanded ? 'Collapse sidebar' : 'Expand sidebar'}</span>
          </Button>
        </div>

        <nav className='flex-1 space-y-1 p-2'>
          <TooltipProvider delayDuration={0}>
            {HEADER_CONFIG.headerMenu.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                      expanded ? '' : 'justify-center',
                    )}
                  >
                    <DynamicIcon name={`${item?.icon}` as 'home'} size={20} />
                    {expanded && <span className='ml-3'>{t(item.key)}</span>}
                  </Link>
                </TooltipTrigger>
                {!expanded && <TooltipContent side='right'>{item.path}</TooltipContent>}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>

        <div className='border-t p-2'>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to='/profile'
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    expanded ? '' : 'justify-center',
                  )}
                >
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted'>
                    <span className='text-xs font-medium'>US</span>
                  </div>
                  {expanded && (
                    <div className='ml-3 flex flex-col'>
                      <span className='text-sm font-medium'>User Name</span>
                      <span className='text-xs text-muted-foreground'>user@example.com</span>
                    </div>
                  )}
                </Link>
              </TooltipTrigger>
              {!expanded && <TooltipContent side='right'>User Profile</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && <div className='fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden' onClick={() => setMobileOpen(false)} />}
    </>
  );
}
