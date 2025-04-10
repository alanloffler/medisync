// Icons: https://lucide.dev/icons/
import { DynamicIcon } from 'lucide-react/dynamic';
import { LogOut, ShieldUser } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@core/components/ui/dropdown-menu';
// External imports
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import { ERole } from '@core/auth/enums/role.enum';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { UtilsString } from '@core/services/utils/string.service';
import { cn } from '@lib/utils';
import { useAuth } from '@core/auth/useAuth';
import { useNavMenuStore } from '@layout/stores/nav-menu.service';
// React component
export function User() {
  const menuExpanded = useNavMenuStore((state) => state.navMenuExpanded);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t } = useTranslation();

  async function handleLogout(): Promise<void> {
    await logout();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn('flex h-8 w-full items-center', menuExpanded ? 'justify-start' : 'justify-center')}>
        <div
          className={cn(
            'flex h-8 w-8 min-w-8 flex-shrink-0 items-center justify-center rounded-full text-white',
            user?.role === ERole.Super ? 'bg-purple-500' : 'bg-sky-500',
          )}
        >
          <span className='text-xs font-medium'>
            <ShieldUser size={20} strokeWidth={1.5} />
          </span>
        </div>
        {menuExpanded && <div className='w-3 flex-shrink-0' />}
        {menuExpanded && (
          <motion.div
            className='flex flex-grow flex-col text-left'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, delay: 0.2 }}
          >
            <div className='text-xs font-semibold'>{UtilsString.upperCase(`${user?.firstName} ${user?.lastName}`, 'each')}</div>
            <div className='text-xxs'>{user?.role === ERole.Super ? t('auth.role.super') : t('auth.role.admin')}</div>
          </motion.div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='min-w-44 space-y-1' onCloseAutoFocus={(e) => e.preventDefault()}>
        {HEADER_CONFIG.user.menuItems.map((item) => (
          <DropdownMenuItem key={item.id} onClick={() => navigate(item.path)} className='flex space-x-3 text-xsm'>
            <DynamicIcon name={item.icon as 'ban'} size={17} strokeWidth={2} />
            {<span>{t(item.key)}</span>}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className='flex space-x-3 bg-primary/10 !text-xsm font-semibold text-primary hover:bg-primary hover:text-white'
          onClick={handleLogout}
        >
          <LogOut size={17} strokeWidth={2} />
          <span>{t('user.menuItems.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
