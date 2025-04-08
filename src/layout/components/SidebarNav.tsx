// Icons: https://lucide.dev/icons/
import { DynamicIcon } from 'lucide-react/dynamic';
import { ChevronLeft, ChevronRight, Menu, Package2 } from 'lucide-react';
// External components
import { Button } from '@core/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@core/components/ui/tooltip';
// Components
import { User } from '@layout/components/footer/User';
import { Help } from '@layout/components/Help';
// External imports
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// Imports
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
      <div className='fixed left-0 top-0 z-50 flex h-16 w-52 border-b md:hidden'>
        <Button
          variant='ghost'
          className='relative left-3 top-3.5 h-9 w-9 p-0'
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setMenuExpanded(true);
          }}
        >
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle menu</span>
        </Button>
      </div>
      {/* Sidebar navigation */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300',
          menuExpanded ? 'w-52' : 'w-16',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className={cn('hidden h-16 items-center border-b md:flex', menuExpanded ? 'px-4' : 'pl-[8px]')}>
          <button
            onClick={() => setMenuExpanded(!menuExpanded)}
            className={cn(
              'flex w-full items-center font-semibold md:text-base',
              menuExpanded ? 'justify-between' : 'justify-center hover:text-primary',
            )}
          >
            <div className='item-center flex gap-2'>
              <Package2 className='h-6 w-6' />
              {menuExpanded && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1, delay: 0.2 }}>
                  {t('appName')}
                </motion.span>
              )}
            </div>
            {menuExpanded ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1, delay: 0.3 }}>
                <ChevronLeft className='h-5 w-5' />
              </motion.div>
            ) : (
              <ChevronRight className='h-5 w-5' />
            )}
          </button>
        </div>
        <nav className={cn('mt-16 flex-1 space-y-1 p-2 md:mt-0 md:border-t-0')}>
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
      {mobileOpen && <div className='fixed inset-0 z-30 bg-slate-50/80 backdrop-blur-[2px] md:hidden' onClick={() => setMobileOpen(false)} />}
    </>
  );
}
