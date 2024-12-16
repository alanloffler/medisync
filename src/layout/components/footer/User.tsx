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
import { Link } from 'react-router-dom';
import { useAnimate } from 'motion/react';
import { useTranslation } from 'react-i18next';
// Imports
import { HEADER_CONFIG } from '@config/layout/header.config';
import { motion } from '@core/services/motion.service';
// React component
export function User({ help }: { help: boolean }) {
  const [scope, animation] = useAnimate();
  const { t } = useTranslation();

  function handleAnimationOver(): void {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    animation(scope.current, keyframes, options);
  }

  function handleAnimationOut(): void {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    animation(scope.current, keyframes, options);
  }

  return (
    <DropdownMenu>
      <TooltipWrapper tooltip={t('tooltip.account')} help={help}>
        <DropdownMenuTrigger
          onMouseOver={handleAnimationOver}
          onMouseOut={handleAnimationOut}
        >
          <CircleUser ref={scope} size={20} strokeWidth={2} />
        </DropdownMenuTrigger>
      </TooltipWrapper>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel className='text-xsm'>{t('user.title')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {HEADER_CONFIG.user.menuItems.map((item) => (
          <DropdownMenuItem key={item.id}>
            <Link key={item.id} to={item.path} className='text-xsm'>
              {t(item.key)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
