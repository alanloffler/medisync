// Icons: https://lucide.dev/icons/
import { ChevronLeft, ChevronRight, Menu, Package2 } from 'lucide-react';
// External components
import { Button } from '@core/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@core/components/ui/tooltip';
// Components
import { User } from '@layout/components/footer/User';
import { Help } from '@layout/components/Help';
// External imports
import { DynamicIcon } from 'lucide-react/dynamic';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
import { APP_CONFIG } from '@config/app.config';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { cn } from '@lib/utils';
import { useNavMenuStore } from '@layout/stores/nav-menu.service';
// React component
export function SidebarNav() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const itemSelected = useNavMenuStore((state) => state.navMenuSelected);
  const menuExpanded = useNavMenuStore((state) => state.navMenuExpanded);
  const setItemSelected = useNavMenuStore((state) => state.setNavMenuSelected);
  const setMenuExpanded = useNavMenuStore((state) => state.setNavMenuExpanded);
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant='ghost'
        size='icon'
        className='fixed left-3 top-3 z-50 md:hidden'
        onClick={() => {
          setMobileOpen(!mobileOpen);
          setMenuExpanded(true);
        }}
      >
        <Menu className='h-5 w-5' />
        <span className='sr-only'>Toggle menu</span>
      </Button>
      {/* Sidebar navigation */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300',
          menuExpanded ? 'w-52' : 'w-16',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className='hidden h-16 items-center justify-between border-b px-4 sm:flex'>
          <Link to={`${APP_CONFIG.appPrefix}`} className='flex items-center gap-2 font-semibold md:text-base'>
            <Package2 className='h-6 w-6' />
            {menuExpanded && <span>{t('appName')}</span>}
          </Link>
          <Button variant='ghost' size='icon' className={cn('ml-auto', menuExpanded ? '' : 'mx-auto')} onClick={() => setMenuExpanded(!menuExpanded)}>
            {menuExpanded ? <ChevronLeft className='h-5 w-5' /> : <ChevronRight className='h-5 w-5' />}
            <span className='sr-only'>{menuExpanded ? 'Collapse sidebar' : 'Expand sidebar'}</span>
          </Button>
        </div>
        <nav className='mt-16 flex-1 space-y-1 border-t p-2 sm:mt-0 sm:border-t-0'>
          {HEADER_CONFIG.headerMenu.map((item) => (
            <TooltipProvider delayDuration={0.3} key={item.id}>
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                      menuExpanded ? '' : 'justify-center',
                      itemSelected === item.id && 'bg-accent',
                    )}
                    onClick={() => setItemSelected(item.id)}
                  >
                    <DynamicIcon name={`${item?.icon}` as 'home'} size={20} />
                    {menuExpanded && (
                      <motion.span className='ml-3' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1, delay: 0.2 }}>
                        {t(item.key)}
                      </motion.span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent hidden={menuExpanded} side='right'>
                  {t(item.key)}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
        <Help />
        <div className='border-t p-2'>
          <User />
        </div>
      </div>
      {/* Backdrop for mobile */}
      {mobileOpen && <div className='fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden' onClick={() => setMobileOpen(false)} />}
    </>
  );
}
