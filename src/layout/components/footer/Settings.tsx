// Icons: https://lucide.dev/icons/
import { SettingsIcon } from 'lucide-react';
// Components
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAnimate } from 'motion/react';
// Imports
import { APP_CONFIG } from '@config/app.config';
import { motion } from '@core/services/motion.service';
// React component
export function Settings() {
  const [scope, animation] = useAnimate();
  const navigate = useNavigate();
  const { t } = useTranslation();

  function handleAnimationOver(): void {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    animation(scope.current, keyframes, options);
  }

  function handleAnimationOut(): void {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    animation(scope.current, keyframes, options);
  }

  return (
    <TooltipWrapper tooltip={t('tooltip.settings')}>
      <button
        className='flex items-center'
        ref={scope}
        onClick={() => navigate(`${APP_CONFIG.appPrefix}/settings`)}
        onMouseOver={handleAnimationOver}
        onMouseOut={handleAnimationOut}
      >
        <SettingsIcon size={20} strokeWidth={2} />
      </button>
    </TooltipWrapper>
  );
}
