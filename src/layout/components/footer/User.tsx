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
import { spring, useAnimate } from 'motion/react';
import { useTranslation } from 'react-i18next';
// Imports
import { HEADER_CONFIG } from '@config/layout/header.config';
// React component
export function User({ help }: { help: boolean }) {
  const [userScope, userAnimation] = useAnimate();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <TooltipWrapper tooltip={t('tooltip.account')} help={help}>
        <DropdownMenuTrigger
          onMouseOver={() => userAnimation(userScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })}
          onMouseOut={() => userAnimation(userScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })}
        >
          <CircleUser ref={userScope} size={20} strokeWidth={2} />
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
