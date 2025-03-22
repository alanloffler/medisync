// Icons: https://lucide.dev/icons/
import { CircleUser } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@core/components/ui/dropdown-menu';
// Components
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { useAnimate } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import { HEADER_CONFIG } from '@config/layout/header.config';
import { motion } from '@core/services/motion.service';
import { useAuth } from '@core/auth/useAuth';
// React component
export function User() {
  const [scope, animation] = useAnimate();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  function handleAnimationOver(): void {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    animation(scope.current, keyframes, options);
  }

  function handleAnimationOut(): void {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    animation(scope.current, keyframes, options);
  }

  return (
    <DropdownMenu>
      <TooltipWrapper tooltip={t('tooltip.account')}>
        <DropdownMenuTrigger onMouseOver={handleAnimationOver} onMouseOut={handleAnimationOut}>
          <CircleUser ref={scope} size={20} strokeWidth={2} />
        </DropdownMenuTrigger>
      </TooltipWrapper>
      <DropdownMenuContent align='start' onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel className='text-xsm'>
          <div className='flex flex-col space-y-1'>
            <div>{t('user.title')}</div>
            {user && <div className='text-[10px] font-light'>{user.email}</div>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {HEADER_CONFIG.user.menuItems.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => navigate(item.path)}
            className='text-xsm last:bg-primary/10 last:font-semibold last:text-primary last:hover:bg-primary last:hover:text-white'
          >
            {t(item.key)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
