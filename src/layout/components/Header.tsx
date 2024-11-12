// Icons: https://lucide.dev/icons/
import { Settings } from 'lucide-react';
// Components
import { ActionsButton } from '@layout/components/ActionsButton';
import { HeaderMenu } from '@layout/components/HeaderMenu';
import { User } from '@layout/components/User';
// External imports
import { Link } from 'react-router-dom';
import { useAnimate } from 'motion/react';
// Imports
import type { ILinks } from '@layout/interfaces/links.interface';
import { HEADER_CONFIG } from '@config/layout/header.config';
// React component
export function Header() {
  const links: ILinks[] = HEADER_CONFIG.actionsButton;
  const [settingScope, settingAnimation] = useAnimate();

  return (
    <header className='sticky top-0 z-50 flex h-16 items-center gap-4 bg-background px-4 shadow-sm md:px-6'>
      <HeaderMenu />
      <div className='flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <ActionsButton links={links} />
        <Link
          ref={settingScope}
          to='/settings'
          onMouseOver={() => settingAnimation(settingScope.current, { rotate: '90deg' }, { duration: 0.25, ease: 'easeIn' })}
          onMouseOut={() => settingAnimation(settingScope.current, { rotate: '-90deg' }, { duration: 0.25, ease: 'easeIn' })}
        >
          <Settings size={20} strokeWidth={2} />
        </Link>
        <User />
      </div>
    </header>
  );
}
